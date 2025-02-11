const Task = require("../models/task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, position } = req.body;
    const newTask = new Task({
      title,
      description,
      status,
      position,
      userId: req.user.id,
    });
    await newTask.save();
    res.status(201).json({ success: true, data: newTask });
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
      .json({ success: true, message: "Error fetching tasks", error });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: updatedTask });
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
      .json({ success: true, message: "Error deleting task", error });
  }
};
