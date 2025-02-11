const express = require("express");
const http = require("http"); // Import HTTP module to create server
const { Server } = require("socket.io"); // Import Socket.IO
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoute");
const authRoutes = require("./routes/authRoute");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
