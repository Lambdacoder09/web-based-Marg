const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all events
router.get('/', (req, res) => {
    try {
        const events = db.prepare(`
            SELECT e.*, s.username as pharmacist_name 
            FROM events e
            LEFT JOIN staff s ON e.user_id = s.id
            ORDER BY e.timestamp DESC
            LIMIT 50
        `).all();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clear notifications (mark as read - simplified for now)
router.post('/clear', (req, res) => {
    // In a full implementation, we'd have a 'read' column.
    // For now, we'll just return success.
    res.json({ success: true });
});

module.exports = router;
