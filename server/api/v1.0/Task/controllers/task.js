const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;
const Task = require("../../models/tasks").taskModel


let addTask = async (req, res) => {
    try {
      let { title, description, dueDate, assignee } = req.body;
      assignee = req.decoded.userId
      const task = new Task({
        title,
        description,
        dueDate,
        assignee
      });
      await task.save();
      res.status(201).json({
        status: true,
         message: 'Task created successfully',
         data: task });
    } catch (error) {
      res.status(400).json({
        status: false,
         message: error
         });
    }
  };

  // let getTasksList = async(req, res) => {
  //   try {
  //     let getTasks = await Task.find({assignee: req.decoded.userId})
  //     res.status(200).json({
  //       status: true,
  //       message: "Fetched Tasks",
  //       data: getTasks
  //     })
  //   }
  //   catch(err) {
  //     res.status(400).json({
  //       status: false,
  //       message: err
  //     })
  //   }
  // }

  let getTasksList = async (req, res) => {
    try {
      const userId = req.decoded.userId; // Assuming `userId` is stored in the decoded JWT
      const match = {
        assignee: mongoose.Types.ObjectId(userId)
      };

      const { priority } = req.query;
      if (priority) {
        match.priority = priority; // Add the priority filter if provided
      }
      
      const tasks = await Task.aggregate([
        {
          $match: match
        },
        {
          $lookup: {
            from: 'users', 
            localField: 'assignee', 
            foreignField: '_id', 
            as: 'assigneeDetails' 
          }
        },
        {
          $unwind: '$assigneeDetails' 
        },
        {
          $project: {
            title: 1,
            description: 1,
            dueDate: 1,
            'assigneeDetails.username': 1,
            'assigneeDetails.email': 1
          }
        }
      ]);
  
          res.status(200).json({
        status: true,
        message: "Fetched Tasks",
        data: tasks
      })
    } 
       catch(err) {
        console.log("err", err)
      res.status(400).json({
        status: false,
        message: err
      })
    }
  };

  let getTask = async(req, res) => {
    try {
      let getTask = await Task.findOne({_id: req.params.id})
      res.status(200).json({
        status: true,
        message: "Fetched Tasks",
        data: getTask
      })
    }
    catch(err) {
      res.status(400).json({
        status: false,
        message: err
      })
    }
  }

  let updateTask = async (req, res) => {
    try {
      const taskId  = req.params.id;
      console.log("taskId",taskId)
      const task = await Task.findOne({_id: req.params.id});
      if (!task) return res.status(404).json({ error: 'Task not found' });
  
      // Only allow the creator or an admin to update the task
      if (task.assignee.toString() !== req.decoded.userId ) {
        return res.status(403).json({ error: 'Access denied' });
      }
  
      const updatedTask = await Task.findOneAndUpdate({_id: taskId}, { $set: req.body }, { new: true });
      res.status(200).json({
        status: true,
         message: 'Task updated successfully',
          task: updatedTask
         });
    } catch (err) {
      res.status(400).json({
        status: false,
        message: err
         });
    }
  };
  

  let deleteTask = async (req, res) => {
    try {
     
      const task = await Task.findOne({_id: req.params.id});
      if (!task) {
        return res.status(404).json({ 
          status: false,
          message: 'Task not found' 
        });
      }
  
      // Only allow the creator or an admin to delete the task
      if (task.assignee.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          status: false,
           message: 'Access denied'
           });
      }
  
      await Task.findOneAndDelete({_id: req.params.id});
      return res.status(200).json({
        status: true,
         message: 'Task deleted successfully'
         });
    } catch (err) {
      res.status(400).json({
        status: false,
         message: err
         });
    }
  };
  

  module.exports = {
    addTask,
    getTasksList,
    getTask,
    updateTask,
    deleteTask
  }
  