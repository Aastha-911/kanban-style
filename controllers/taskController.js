const User = require("../models/user");
const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, position, dueDate, priority } =
      req.body;
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

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

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
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

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
