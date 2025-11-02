import express from "express";
import {
  getTasksForUser,
  createTask,
  markTaskComplete,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// GET tasks for a user
router.get("/:userId", getTasksForUser);

// Create task
router.post("/", createTask);

// Mark complete
router.patch("/:id/complete", markTaskComplete);

// Delete
router.delete("/:id", deleteTask);

export default router;

