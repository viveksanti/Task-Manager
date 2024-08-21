const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.ObjectId;
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: { 
    type: String,
    required: true },
  description: {
     type: String
    },
  dueDate: {
     type: Date
     },
  assignee: {
     type: ObjectId,
      ref: 'User'
     },
     priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'], // Define allowed priority levels
      default: 'Medium' // Default priority
    }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

let taskModel = mongoose.model("tasks", TaskSchema);

module.exports = {
    taskModel: taskModel
}
