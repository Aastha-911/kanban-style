const express = require("express");
const {
  register,
  login,
  authenticated,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", authenticateToken, authenticated);

module.exports = router;
