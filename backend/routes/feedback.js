const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

// Submit feedback (student only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit feedback" });
    }

    const { teacherId, content, isAnonymous } = req.body;

    // Validate required fields
    if (!teacherId || !content) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Verify the teacher exists
    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Create new feedback
    const newFeedback = new Feedback({
      studentId: req.user.id,
      teacherId,
      content,
      isAnonymous: isAnonymous || false
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: newFeedback
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get feedback for a specific teacher (teachers can only see their own feedback)
router.get("/teacher", authMiddleware, async (req, res) => {
  try {
    // Check if user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find all feedback for this teacher
    const feedback = await Feedback.find({ teacherId: req.user.id })
      .populate({
        path: "studentId",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    // Process to handle anonymous feedback
    const processedFeedback = feedback.map(item => {
      if (item.isAnonymous) {
        return {
          ...item.toObject(),
          studentId: { name: "Anonymous Student" }
        };
      }
      return item;
    });

    res.status(200).json(processedFeedback);
  } catch (error) {
    console.error("Error fetching teacher feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all feedback (admin only)
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    // Check if user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { teacherId, studentId, startDate, endDate } = req.query;
    
    // Build query object based on filters
    const query = {};
    
    if (teacherId) query.teacherId = teacherId;
    if (studentId) query.studentId = studentId;
    
    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Find feedback with filters
    const feedback = await Feedback.find(query)
      .populate({
        path: "teacherId", 
        select: "name email"
      })
      .populate({
        path: "studentId",
        select: "name email"
      })
      .sort({ createdAt: -1 });

    // Process to handle anonymous feedback
    const processedFeedback = feedback.map(item => {
      if (item.isAnonymous) {
        return {
          ...item.toObject(),
          studentId: { name: "Anonymous Student", email: "anonymous@example.com" }
        };
      }
      return item;
    });

    res.status(200).json(processedFeedback);
  } catch (error) {
    console.error("Error fetching admin feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get teachers list for dropdown (students and admins)
router.get("/teachers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "student" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const teachers = await User.find({ role: "teacher" })
      .select("name email")
      .sort({ name: 1 });
    
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get students list for dropdown (admin only)
router.get("/students", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    
    const students = await User.find({ role: "student" })
      .select("name email")
      .sort({ name: 1 });
    
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
