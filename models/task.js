const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },
  position: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Task", taskSchema);
