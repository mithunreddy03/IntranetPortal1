const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Club = require('../models/Club');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'club-' + uniqueSuffix + ext);
    }
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure upload with limits
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
    fileFilter: fileFilter
});

// Create new club with image upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, founderName, date } = req.body;
        console.log('Received club data:', req.body);

        // Basic validation
        if (!name || !description || !category) {
            // Remove uploaded file if it exists and validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'Name, description, and category are required fields' });
        }

        const newClub = new Club({
            name,
            description,
            category,
            date: date || Date.now(),
            founderName: founderName || 'Admin'
        });

        // Add image path if file was uploaded
        if (req.file) {
            // Store the relative path to the uploaded file
            newClub.image = 'uploads/' + req.file.filename;
        }

        const savedClub = await newClub.save();
        console.log('Saved club:', savedClub);
        res.status(201).json({ message: 'Club created successfully', club: savedClub });
    } catch (error) {
        console.error('Error creating club:', error);
        
        // Remove uploaded file if it exists and there was an error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        if (error.code === 11000) {
            // Duplicate key error (unique constraint violation)
            return res.status(400).json({ message: 'A club with this name already exists' });
        }
        res.status(500).json({ message: 'Error creating club', error: error.message });
    }
});

// Get all clubs
router.get('/', async (req, res) => {
    try {
        const clubs = await Club.find().sort({ createdAt: -1 });
        res.json(clubs);
    } catch (error) {
        console.error('Error fetching clubs:', error);
        res.status(500).json({ message: 'Error fetching clubs', error: error.message });
    }
});

// Get a specific club by ID
router.get('/:id', async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }
        res.json(club);
    } catch (error) {
        console.error('Error fetching club:', error);
        res.status(500).json({ message: 'Error fetching club', error: error.message });
    }
});

// Update a club by ID
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, founderName, date } = req.body;
        
        // Basic validation
        if (!name || !description || !category) {
            // Remove uploaded file if it exists and validation fails
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'Name, description, and category are required fields' });
        }

        // Prepare update object
        const updateData = {
            name,
            description,
            category,
            founderName: founderName || 'Admin',
            date: date || Date.now()
        };

        // Add image path if file was uploaded
        if (req.file) {
            updateData.image = 'uploads/' + req.file.filename;
            
            // Find the old club to get its image
            const oldClub = await Club.findById(req.params.id);
            
            // Delete the old image if it exists and isn't the default
            if (oldClub && oldClub.image && oldClub.image !== 'default-club.jpg' && oldClub.image.startsWith('uploads/')) {
                const oldImagePath = path.join(__dirname, '..', oldClub.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedClub = await Club.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedClub) {
            // Remove uploaded file if it exists and club not found
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Club not found' });
        }

        res.json({ message: 'Club updated successfully', club: updatedClub });
    } catch (error) {
        console.error('Error updating club:', error);
        
        // Remove uploaded file if it exists and there was an error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        if (error.code === 11000) {
            // Duplicate key error (unique constraint violation)
            return res.status(400).json({ message: 'A club with this name already exists' });
        }
        
        res.status(500).json({ message: 'Error updating club', error: error.message });
    }
});

module.exports = router;