const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// Create a new course
router.post('/', async (req, res) => {
    const { 
        courseId, 
        courseName, 
        courseCode, 
        instructor, 
        credits, 
        description, 
        branch, 
        batch, 
        semester 
    } = req.body;

    // Validate required fields
    if (!courseId || !courseName || !courseCode || !instructor || !credits || !branch || !batch || !semester) {
        return res.status(400).json({ message: "All required fields must be provided." });
    }

    try {
        // Check for duplicate courseId
        const existingCourseId = await Course.findOne({ courseId });
        if (existingCourseId) {
            return res.status(400).json({ message: "Course ID already exists." });
        }
        
        // Check for duplicate courseCode
        const existingCourseCode = await Course.findOne({ courseCode });
        if (existingCourseCode) {
            return res.status(400).json({ message: "Course code already exists." });
        }

        // Create new course
        const newCourse = new Course({
            courseId,
            courseName,
            courseCode,
            instructor,
            credits: Number(credits),
            description,
            branch,
            batch,
            semester: Number(semester)
        });

        await newCourse.save();
        res.status(201).json({ 
            message: "Course created successfully.", 
            course: newCourse 
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().sort({ courseName: 1 });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Error fetching courses." });
    }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }
        res.json(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Error fetching course." });
    }
});

module.exports = router;
