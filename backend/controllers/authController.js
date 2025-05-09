const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials or role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    let redirectUrl = "/";
    if (user.role === "student") {
      redirectUrl = "/student-dashboard";
    } else if (user.role === "teacher") {
      redirectUrl = "/teacher-dashboard";
    }

    res.json({ token, role: user.role, redirectUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  if (role !== "student" && role !== "teacher") {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      email,
      password,
      role
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTestUsers = async (req, res) => {
  try {
    const studentUser = new User({
      email: "student@test.com",
      password: "password123",
      role: "student"
    });
    await studentUser.save();

    const teacherUser = new User({
      email: "teacher@test.com",
      password: "password123",
      role: "teacher"
    });
    await teacherUser.save();

    res.status(201).json({ message: "Test users created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};