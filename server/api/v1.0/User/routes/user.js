let express = require("express");

let router = express.Router();

let userController = require("./../controllers/user")

let jwt = require("././../../middlewares/auth");

router.post("/register", userController.registerUser);
router.post("/login", userController.login);
router.get("/userDetails", [jwt.authenticateJWT], userController.getUserDetails)
router.put("/updateUserDetals",[jwt.authenticateJWT],userController.updateUserDetails)
router.get("/userList", [jwt.hasAdminRole], userController.getUsersList)

module.exports = router;