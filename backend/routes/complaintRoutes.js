const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint');
const authMiddleware = require('../middleware/authMiddleware');

// Submit a new complaint (student only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { category, description } = req.body;
        
        if (!category || !description) {
            return res.status(400).json({ message: 'Category and description are required' });
        }
        
        // Generate a unique complaint number
        const complaintNumber = await Complaint.generateComplaintNumber();
        
        // Create a new complaint
        const newComplaint = new Complaint({
            complaintNumber,
            studentName: req.user.name || 'Anonymous Student',
            studentId: req.user.id,
            category,
            description
        });
        
        await newComplaint.save();
        
        res.status(201).json({ 
            message: 'Complaint submitted successfully', 
            complaintNumber 
        });
        
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all complaints (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
        
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get complaints by category (admin only)
router.get('/category/:category', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const { category } = req.params;
        
        // Validate category
        if (!['Management', 'Hostel', 'Food'].includes(category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        
        const complaints = await Complaint.find({ category }).sort({ createdAt: -1 });
        res.json(complaints);
        
    } catch (error) {
        console.error('Error fetching complaints by category:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get a single complaint by ID (both admin and the student who submitted it)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        
        // If not admin, check if the complaint belongs to the requesting user
        if (req.user.role !== 'admin' && complaint.studentId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(complaint);
        
    } catch (error) {
        console.error('Error fetching complaint:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update complaint status (admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const { status } = req.body;
        
        if (!status || !['Pending', 'In Progress', 'Resolved'].includes(status)) {
            return res.status(400).json({ message: 'Valid status is required' });
        }
        
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        
        res.json(updatedComplaint);
        
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;