const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
      required: true,
    },
    position: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
