const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  //console.log("req", req);
  //console.log("USER", req.userId);
  const user = await User.findById(req.userId);
  //console.log('user', user)
  if (!user) {
    res.status(401);
  }
  const tasks = await Task.find({ user: req.userId });
  res.status(200).json(tasks);
});

router.post("/", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(401);
  }
  const { description } = req.body;
  const tasks = await Task.create({ user: req.userId, description });
  res.status(201).json(tasks);
});

router.delete("/:id", auth, async (req, res) => {
  // make sure it is the users ticket
  const user = await User.findById(req.userId);

  const task = await Task.findById(req.params.id);

  if (!task.user.equals(user._id)) {
    return res.status(401).json({
      message: "You do not have access to delete this task",
    });
  }
  const taskToDelete = await Task.findByIdAndDelete(req.params.id);
  res.status(204).json(taskToDelete);
});

// const createTask = asyncHandler(async (req, res) => {
//   //const { description, completed } = req.body;
//   var data = {
//     user: req.user.id,
//     description: req.body.description,
//     completed: false,
//   };
//   console.log("data", data);
//   //const task = new Task(req.body);
//   try {
//     const newTask = await Task.create(data);
//     res.status(201).json(data);
//   } catch (error) {
//     console.log("error", error);
//     res.status(400).json(error);
//   }
// });

// const getTasks = asyncHandler(async (req, res) => {
//   // console.log("TAKS", req.cookies.token);
//   // console.log("userid", req.user.id);
//   const user = await User.findById(req.user.id);
//   //console.log('user', user)
//   if (!user) {
//     res.status(401);
//   }
//   const tasks = await Task.find({ user: req.user.id });
//   res.status(200).json(tasks);
// });

// const getAllTasks = asyncHandler(async (req, res) => {
//   const tasks = await Task.find();
//   res.status(200).json(tasks);
// });

// const deleteTask = asyncHandler(async (req, res) => {
//   const tasks = await Task.find({ user: req.user.id, _id: req.params.id });

//   res.status(204).json({ message: "Task deleted" });
// });

// module.exports = {
//   createTask,
//   getTasks,
//   getAllTasks,
//   deleteTask,
// };
module.exports = router;
