const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { getReadableTimestampParis } = require("../utils/dateUtils");

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
  console.log(`${getReadableTimestampParis()} POST Request : register`);
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
  console.log(`${getReadableTimestampParis()} POST Request : login`);
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
      {
        id: user._id,
        username: user.username,
        role: user.role,
        preferences: user.preferences,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ message: "Login successful", user });
    console.log(
      `${getReadableTimestampParis()} User ${
        user.username
      } succesfully connected.`
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = (req, res) => {
  console.log(`${getReadableTimestampParis()} POST Request : logout`);
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
};

const getProfile = (req, res) => {
  console.log(`${getReadableTimestampParis()} GET Request : getProfile`);
  res.json({ user: req.user });
};

const updatePreferences = async (req, res) => {
  console.log(
    `${getReadableTimestampParis()} POST Request : updatePreferences`
  );
  const { preference, value } = req.body;
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (preference in user.preferences) {
      user.preferences[preference] = value;
    } else {
      return res.status(400).json({ message: "Invalid preference" });
    }

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        preferences: user.preferences,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { register, login, logout, getProfile, updatePreferences };
