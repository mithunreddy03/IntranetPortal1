require("dotenv").config(); //  Load environment variables

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const connectDB = require('./config/db');
const clubRoutes = require('./routes/clubs');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const complaintRoutes = require('./routes/complaintRoutes');
const eventRoutes = require('./routes/events');
const announcementRoutes = require('./routes/announcements');
const foodMenuRoutes = require('./routes/foodMenus');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/intranetPortal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use('/api/clubs', clubRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/food-menus', foodMenuRoutes);
app.use('/api/feedback', feedbackRoutes);

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
