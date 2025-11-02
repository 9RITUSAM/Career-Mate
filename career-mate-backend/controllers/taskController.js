import Task from "../models/Task.js";

/**
 * GET /api/tasks/:userId
 * Returns all tasks for a given user (sorted newest first)
 */
export const getTasksForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "Missing userId param" });

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    res.json(Array.isArray(tasks) ? tasks : []);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tasks
 * Body: { description, userId, dueDate?, priority? }
 */
export const createTask = async (req, res, next) => {
  try {
    const { description, userId, dueDate, priority } = req.body;
    if (!description || !userId) {
      return res.status(400).json({ error: "description and userId are required" });
    }

    const newTask = new Task({
      description,
      userId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || "medium",
    });

    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tasks/:id/complete
 * Toggles or sets task status to completed
 */
export const markTaskComplete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.status = "completed";
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};
