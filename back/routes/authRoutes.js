const express = require("express");
const {
  register,
  login,
  logout,
  getProfile,
  updatePreferences,
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authenticateToken, getProfile);
router.put("/preferences", authenticateToken, updatePreferences);

module.exports = router;
