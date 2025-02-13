const User = require("../models/user");
const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, position, dueDate, priority } =
      req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Title and description is required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newTask = new Task({
      title,
      description,
      status,
      position,
      userId: req.user.id,
      userName: user.name,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority || "Medium",
    });
    await newTask.save();

    const io = req.app.get("socketio");
    io.emit("taskCreated", newTask);

    res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error creating task", error });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ position: 1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      position: 1,
    });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching tasks", error });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only update your own tasks",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const io = req.app.get("socketio");
    io.emit("taskUpdated", updatedTask);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating task", error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own tasks",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    const io = req.app.get("socketio");
    io.emit("taskDeleted", { taskId: req.params.id });
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting task", error });
  }
};
