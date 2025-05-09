const express = require('express');
const router = express.Router();
const Event = require('../models/event');

// Create a new event
router.post('/', async (req, res) => {
    try {
        const { eventName, eventDate, eventDescription, venue, organizer, contactEmail, registrationLink, clubId } = req.body;
        
        // Basic validation
        if (!eventName || !eventDate || !eventDescription || !venue || !clubId) {
            return res.status(400).json({ message: 'Event name, date, description, venue and club ID are required fields' });
        }

        const newEvent = new Event({
            eventName,
            eventDate,
            eventDescription,
            venue,
            organizer: organizer || 'Club Coordinator',
            contactEmail,
            registrationLink,
            clubId
        });

        const savedEvent = await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: savedEvent });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
});

// Get all events (with optional clubId filter)
router.get('/', async (req, res) => {
    try {
        const { clubId } = req.query;
        let query = {};
        
        // If clubId is provided, filter events by that clubId
        if (clubId) {
            query.clubId = clubId;
        }
        
        const events = await Event.find(query).sort({ eventDate: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
});

// Get a specific event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
});

// Update an event by ID
router.put('/:id', async (req, res) => {
    try {
        const { eventName, eventDate, eventDescription, venue, organizer, contactEmail, registrationLink } = req.body;
        
        // Basic validation
        if (!eventName || !eventDate || !eventDescription || !venue) {
            return res.status(400).json({ message: 'Event name, date, description and venue are required fields' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                eventName,
                eventDate,
                eventDescription,
                venue,
                organizer,
                contactEmail,
                registrationLink
            },
            { new: true } // Return the updated document
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
});

// Delete an event by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
});

module.exports = router;