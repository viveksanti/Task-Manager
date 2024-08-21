let express = require("express");

let router = express.Router();
let taskController = require("../controllers/task")

let jwt = require("../../middlewares/auth");


router.post("/addTask",[jwt.isUser], taskController.addTask);
router.get("/getTasksList", [jwt.isUser], taskController.getTasksList)
 router.put("/updateTask/:id",[jwt.isUser],taskController.updateTask)
 router.get("/getTask/:id", [jwt.isUser], taskController.getTask)
 router.delete("/deleteTask/:id",[jwt.authenticateJWT], taskController.deleteTask)

module.exports = router;