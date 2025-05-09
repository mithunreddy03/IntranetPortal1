const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Create a new course
router.post('/', async (req, res) => {
    try {
        const { name, credits, semester, batch, branch } = req.body;
        console.log('Received course data:', req.body); // Debug log

        // Basic validation
        if (!name || !credits || !semester || !batch || !branch) {
            console.error('Validation Error: Missing required fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if credits is a number
        if (isNaN(credits)) {
            console.error('Validation Error: Credits must be a number');
            return res.status(400).json({ message: 'Credits must be a number' });
        }

        const newCourse = new Course({
            name,
            credits: Number(credits), // Ensure it's stored as a number
            semester,
            batch,
            branch
        });

        const savedCourse = await newCourse.save();
        console.log('Saved course:', savedCourse);
        res.status(201).json({ message: 'Course created successfully', course: savedCourse });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

module.exports = router;
