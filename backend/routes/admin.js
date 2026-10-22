const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Add New Scheme
router.post('/scheme', (req, res) => {
    const {
        name, description, category, ministry,
        min_age, max_age, max_income, gender,
        caste, occupation, state, benefits,
        documents, apply_steps, apply_link
    } = req.body;

    const sql = `INSERT INTO schemes (
        name, description, category, ministry,
        min_age, max_age, max_income, gender,
        caste, occupation, state, benefits,
        documents, apply_steps, apply_link
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
        name, description, category, ministry,
        min_age, max_age, max_income, gender,
        caste, occupation, state, benefits,
        documents, apply_steps, apply_link
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err });
        res.status(201).json({ message: 'Scheme added successfully!' });
    });
});

// Get All Schemes (Admin)
router.get('/schemes', (req, res) => {
    db.query('SELECT * FROM schemes', (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

// Update Scheme
router.put('/scheme/:id', (req, res) => {
    const {
        name, description, category, ministry,
        min_age, max_age, max_income, gender,
        caste, occupation, state, benefits,
        documents, apply_steps, apply_link
    } = req.body;

    const sql = `UPDATE schemes SET 
        name=?, description=?, category=?, ministry=?,
        min_age=?, max_age=?, max_income=?, gender=?,
        caste=?, occupation=?, state=?, benefits=?,
        documents=?, apply_steps=?, apply_link=?
        WHERE id=?`;

    const values = [
        name, description, category, ministry,
        min_age, max_age, max_income, gender,
        caste, occupation, state, benefits,
        documents, apply_steps, apply_link,
        req.params.id
    ];

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error', error: err });
        res.json({ message: 'Scheme updated successfully!' });
    });
});

// Delete Scheme
router.delete('/scheme/:id', (req, res) => {
    db.query('DELETE FROM schemes WHERE id = ?',
    [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ message: 'Scheme deleted successfully!' });
    });
});

// Get All Users
router.get('/users', (req, res) => {
    db.query('SELECT id, full_name, email, phone, state, created_at FROM users',
    (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

// Get Statistics
router.get('/stats', (req, res) => {
    db.query('SELECT COUNT(*) as total_users FROM users', (err, users) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        db.query('SELECT COUNT(*) as total_schemes FROM schemes', (err, schemes) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            db.query('SELECT COUNT(*) as total_saved FROM saved_schemes', (err, saved) => {
                if (err) return res.status(500).json({ message: 'Server error' });
                res.json({
                    total_users: users[0].total_users,
                    total_schemes: schemes[0].total_schemes,
                    total_saved: saved[0].total_saved
                });
            });
        });
    });
});

module.exports = router;
