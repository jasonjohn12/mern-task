const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  getAllTasks,
} = require("../controllers/taskController");

const { auth } = require("../middleware/auth");

router.route("/").get(auth, getTasks).post(auth, createTask);
router.route("/all").get(auth, getAllTasks);

module.exports = router;
