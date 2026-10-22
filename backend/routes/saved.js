const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ===== SAVE SCHEME =====
// POST /api/saved/:id
router.post('/:id', (req, res) => {
    const { user_id } = req.body;
    const scheme_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ message: 'User not logged in!' });
    }

    // Check if already saved
    db.query(
        'SELECT * FROM saved_schemes WHERE user_id = ? AND scheme_id = ?',
        [user_id, scheme_id],
        (err, results) => {
            if (err) {
                console.error('Save Check Error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ message: 'Scheme already saved!' });
            }

            // Insert into saved_schemes
            db.query(
                'INSERT INTO saved_schemes (user_id, scheme_id) VALUES (?, ?)',
                [user_id, scheme_id],
                (err, result) => {
                    if (err) {
                        console.error('Save Insert Error:', err);
                        return res.status(500).json({ message: 'Server error' });
                    }
                    
                    // Increment save_count in schemes table
                    db.query(
                        'UPDATE schemes SET save_count = save_count + 1 WHERE id = ?',
                        [scheme_id],
                        (updateErr) => {
                            if (updateErr) {
                                console.error('Save count update error:', updateErr);
                                // Don't fail the request, just log the error
                            }
                            res.json({ 
                                message: 'Scheme saved successfully!',
                                schemeId: scheme_id,
                                userId: user_id
                            });
                        }
                    );
                }
            );
        }
    );
});

// ===== GET SAVED SCHEMES =====
// GET /api/saved/:user_id
router.get('/:user_id', (req, res) => {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required!' });
    }

    db.query(
        `SELECT schemes.*, saved_schemes.saved_at 
        FROM schemes 
        JOIN saved_schemes ON schemes.id = saved_schemes.scheme_id 
        WHERE saved_schemes.user_id = ?
        ORDER BY saved_schemes.saved_at DESC`,
        [userId],
        (err, results) => {
            if (err) {
                console.error('Get Saved Error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            res.json(results);
        }
    );
});

// ===== REMOVE SAVED SCHEME =====
// DELETE /api/saved/:id
router.delete('/:id', (req, res) => {
    const { user_id } = req.body;
    const scheme_id = req.params.id;

    if (!user_id) {
        return res.status(400).json({ message: 'User not logged in!' });
    }

    // First, check if the scheme exists in saved_schemes
    db.query(
        'SELECT * FROM saved_schemes WHERE user_id = ? AND scheme_id = ?',
        [user_id, scheme_id],
        (err, results) => {
            if (err) {
                console.error('Delete Check Error:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Scheme not found in saved list!' });
            }

            // Delete from saved_schemes
            db.query(
                'DELETE FROM saved_schemes WHERE user_id = ? AND scheme_id = ?',
                [user_id, scheme_id],
                (err, result) => {
                    if (err) {
                        console.error('Delete Error:', err);
                        return res.status(500).json({ message: 'Server error' });
                    }

                    // Decrement save_count in schemes table
                    db.query(
                        'UPDATE schemes SET save_count = save_count - 1 WHERE id = ? AND save_count > 0',
                        [scheme_id],
                        (updateErr) => {
                            if (updateErr) {
                                console.error('Save count decrement error:', updateErr);
                                // Don't fail the request, just log the error
                            }
                            res.json({ 
                                message: 'Scheme removed successfully!',
                                schemeId: scheme_id,
                                userId: user_id
                            });
                        }
                    );
                }
            );
        }
    );
});

// ===== CHECK IF SCHEME IS SAVED =====
// GET /api/saved/check/:user_id/:scheme_id
router.get('/check/:user_id/:scheme_id', (req, res) => {
    const { user_id, scheme_id } = req.params;

    if (!user_id || !scheme_id) {
        return res.status(400).json({ message: 'User ID and Scheme ID are required!' });
    }

    db.query(
        'SELECT * FROM saved_schemes WHERE user_id = ? AND scheme_id = ?',
        [user_id, scheme_id],
        (err, results) => {
            if (err) {
                console.error('Check Saved Error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            res.json({ 
                isSaved: results.length > 0,
                schemeId: scheme_id,
                userId: user_id
            });
        }
    );
});

// ===== GET SAVED SCHEMES COUNT =====
// GET /api/saved/count/:user_id
router.get('/count/:user_id', (req, res) => {
    const userId = req.params.user_id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required!' });
    }

    db.query(
        'SELECT COUNT(*) as count FROM saved_schemes WHERE user_id = ?',
        [userId],
        (err, results) => {
            if (err) {
                console.error('Count Error:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            res.json({ 
                count: results[0].count,
                userId: userId
            });
        }
    );
});

module.exports = router;
