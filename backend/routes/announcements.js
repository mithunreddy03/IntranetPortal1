const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');

// Get all announcements - accessible to all authenticated users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Error fetching announcements', error: error.message });
    }
});

// Get a single announcement by ID - accessible to all authenticated users
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json(announcement);
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({ message: 'Error fetching announcement', error: error.message });
    }
});

// Create a new announcement - admin only
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Verify user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can create announcements' });
        }

        const { title, content, important } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const newAnnouncement = new Announcement({
            title,
            content,
            createdBy: req.user.id,
            creatorName: user.name || 'Admin',
            important: important || false
        });

        const savedAnnouncement = await newAnnouncement.save();
        res.status(201).json({ message: 'Announcement created successfully', announcement: savedAnnouncement });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
});

// Update an announcement - admin only
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // Verify user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can update announcements' });
        }

        const { title, content, important } = req.body;
        
        // Validate at least one field to update
        if (!title && !content && important === undefined) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updatedAnnouncement = await Announcement.findByIdAndUpdate(
            req.params.id,
            { 
                ...(title && { title }),
                ...(content && { content }),
                ...(important !== undefined && { important })
            },
            { new: true }
        );

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement updated successfully', announcement: updatedAnnouncement });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({ message: 'Error updating announcement', error: error.message });
    }
});

// Delete an announcement - admin only
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Verify user is an admin
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can delete announcements' });
        }

        const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully', id: req.params.id });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ message: 'Error deleting announcement', error: error.message });
    }
});

module.exports = router;
