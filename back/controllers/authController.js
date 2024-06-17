const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { username, password, role } = req.body;
  const transformedRole = role ? "guest" : "";
  try {
    const user = new User({ username, password, role: transformedRole });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

const getProfile = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, logout, getProfile };
