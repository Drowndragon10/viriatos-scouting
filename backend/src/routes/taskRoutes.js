const express = require("express");
const {
  createTask,
  getTasks,
  getTasksByUser,
} = require("../controllers/taskController");

const router = express.Router();

// Create a new task
router.post("/", createTask);

// Get all tasks
router.get("/", getTasks);

// Get tasks by user ID
router.get("/user/:idUser", getTasksByUser);

module.exports = router;
