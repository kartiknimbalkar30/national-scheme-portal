const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Submit Feedback
router.post('/', (req, res) => {
    const { name, email, message, rating } = req.body;

    const sql = 'INSERT INTO feedback (name, email, message, rating) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, message, rating], (err, result) => {
        if (err) {
            console.log('Feedback Error:', err);
            return res.status(500).json({ message: 'Failed to submit feedback!' });
        }
        res.status(201).json({ message: 'Thank you for your feedback!' });
    });
});

// Get All Feedback (for Admin)
router.get('/', (req, res) => {
    db.query('SELECT * FROM feedback ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

module.exports = router;
