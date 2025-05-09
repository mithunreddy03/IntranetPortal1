const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if email, password, and role are provided
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required" });
    }

    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Admin Login Route
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin user by email
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Registration route for testing purposes
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }
  
  if (role !== "student" && role !== "teacher") {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = new User({
      email,
      password, // Will be hashed in pre-save hook
      role
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to create test users for development purposes
// Remove this route in production
router.get("/create-test-users", async (req, res) => {
  try {
    // Create a student user
    const studentUser = new User({
      email: "student@test.com",
      password: "password123", // Will be hashed in pre-save hook
      role: "student"
    });
    await studentUser.save();

    // Create a teacher user
    const teacherUser = new User({
      email: "teacher@test.com",
      password: "password123", // Will be hashed in pre-save hook
      role: "teacher"
    });
    await teacherUser.save();

    res.status(201).json({ message: "Test users created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;