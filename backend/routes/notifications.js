const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/notifications/new-schemes-count?since=DATE
router.get('/new-schemes-count', (req, res) => {
  const { since } = req.query;
  const sinceDate = since || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const sql = `SELECT COUNT(*) AS count FROM schemes WHERE created_at > ?`;

  db.query(sql, [sinceDate], (err, results) => {
    if (err) {
      console.error('Error fetching new schemes count:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ count: results[0].count });
  });
});

// GET /api/notifications/latest-schemes
router.get('/latest-schemes', (req, res) => {
  const sql = `SELECT id, name, category, created_at FROM schemes ORDER BY created_at DESC LIMIT 5`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching latest schemes:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

module.exports = router;
