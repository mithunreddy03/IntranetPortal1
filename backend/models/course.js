const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    courseName: { 
        type: String, 
        required: true 
    },
    courseCode: { 
        type: String, 
        required: true,
        unique: true 
    },
    instructor: { 
        type: String, 
        required: true 
    },
    credits: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String 
    },
    branch: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);