const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');

// Debug middleware to log request body
router.use((req, res, next) => {
    if (req.method === 'POST' && req.path === '/register') {
        console.log('User registration request body:', req.body);
    }
    next();
});

// Create a new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, category } = req.body;

        // Validate required fields
        if (!name || !email || !password || !category) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }        // Create and save the new user
        const newUser = new User({ 
            name, 
            email, 
            password, 
            role: category 
        });
        
        const savedUser = await newUser.save();
        
        // Log the saved user for debugging
        console.log('User created successfully:', {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role
        });
        
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        console.error('Error creating user:', error.message, error.stack); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Change password endpoint
router.put('/change-password', authMiddleware, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.id;

        // Validate new password
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
});

module.exports = router;