const express = require("express");
const router = express.Router();
const Usercontroller = require("../Controllers/user");
const Taskcontroller = require("../Controllers/task");
const { signupValidator } = require("../validator");

router.post("/login", Usercontroller.login);
router.post("/addUser", signupValidator, Usercontroller.addUser);
router.get("/logout", Usercontroller.logout);
router.post('/getTasks', Usercontroller.requireSignin, Usercontroller.getTasks);
router.post('/addTask', Usercontroller.requireSignin, Taskcontroller.createTask, Usercontroller.addTask);
router.post('/deleteTask',Usercontroller.requireSignin, Usercontroller.deleteTask);             // task will be removed from user's usertasks array but will remain in database,as we never delete anything from database.
router.post('/updateTask',Usercontroller.requireSignin , Taskcontroller.updateTask);

module.exports = router;
