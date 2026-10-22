const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', (req, res) => {
  const { user_id, scheme_id, rating } = req.body;

  if (!user_id || !scheme_id || !rating) {
    return res.status(400).json({ message: 'user_id, scheme_id and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  const checkSql = `SELECT id FROM ratings WHERE user_id = ? AND scheme_id = ?`;

  db.query(checkSql, [user_id, scheme_id], (err, results) => {
    if (err) {
      console.error('Error checking rating:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      const updateSql = `UPDATE ratings SET rating = ? WHERE user_id = ? AND scheme_id = ?`;
      db.query(updateSql, [rating, user_id, scheme_id], (err) => {
        if (err) {
          console.error('Error updating rating:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ message: 'Rating updated successfully!' });
      });
    } else {
      const insertSql = `INSERT INTO ratings (user_id, scheme_id, rating) VALUES (?, ?, ?)`;
      db.query(insertSql, [user_id, scheme_id, rating], (err) => {
        if (err) {
          console.error('Error inserting rating:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ message: 'Rating submitted successfully!' });
      });
    }
  });
});

router.get('/scheme/:scheme_id', (req, res) => {
  const { scheme_id } = req.params;

  const sql = `
    SELECT 
      ROUND(AVG(rating), 1) AS average_rating,
      COUNT(*) AS total_ratings
    FROM ratings
    WHERE scheme_id = ?
  `;

  db.query(sql, [scheme_id], (err, results) => {
    if (err) {
      console.error('Error fetching average rating:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({
      average_rating: results[0].average_rating || 0,
      total_ratings: results[0].total_ratings || 0
    });
  });
});

router.get('/user/:user_id/scheme/:scheme_id', (req, res) => {
  const { user_id, scheme_id } = req.params;

  const sql = `SELECT rating FROM ratings WHERE user_id = ? AND scheme_id = ?`;

  db.query(sql, [user_id, scheme_id], (err, results) => {
    if (err) {
      console.error('Error fetching user rating:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ rating: results.length > 0 ? results[0].rating : 0 });
  });
});

module.exports = router;
