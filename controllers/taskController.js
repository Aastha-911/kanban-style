const User = require("../models/user");
const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, position } = req.body;
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
    });
    await newTask.save();
    res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating task", error });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({
      position: 1,
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
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
    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating task", error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting task", error });
  }
};
