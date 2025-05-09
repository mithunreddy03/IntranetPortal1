const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    complaintNumber: {
        type: String,
        required: true,
        unique: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['Management', 'Hostel', 'Food'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

// Function to generate a unique complaint number
complaintSchema.statics.generateComplaintNumber = async function() {
    // Get the current date
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2); // Last two digits of year
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const datePrefix = `CMP-${year}${month}${day}-`;
    
    // Find the highest complaint number with today's prefix
    const lastComplaint = await this.findOne(
        { complaintNumber: new RegExp('^' + datePrefix) },
        { complaintNumber: 1 },
        { sort: { complaintNumber: -1 } }
    );
    
    let nextNumber = 1;
    
    if (lastComplaint) {
        // Extract the numeric part and increment
        const lastNumber = parseInt(lastComplaint.complaintNumber.split('-').pop());
        nextNumber = lastNumber + 1;
    }
    
    // Format with leading zeros (e.g., CMP-230508-001)
    return `${datePrefix}${String(nextNumber).padStart(3, '0')}`;
};

module.exports = mongoose.model('Complaint', complaintSchema);