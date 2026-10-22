const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/match', (req, res) => {
  const { age, gender, state, caste, occupation, yearly_income } = req.body;

  const userAge = age !== undefined && age !== null && age !== '' && !isNaN(Number(age)) ? Number(age) : null;
  const userIncome = yearly_income !== undefined && yearly_income !== null && yearly_income !== '' && !isNaN(Number(yearly_income)) ? Number(yearly_income) : null;
  const userGender = gender && gender !== 'All' ? String(gender).trim() : null;
  const userState = state && state !== 'All India' ? String(state).trim() : null;
  const userCaste = caste && caste !== 'All' ? String(caste).trim() : null;
  const userOccupation = occupation && occupation !== 'All' ? String(occupation).trim() : null;

  const sql = `
    SELECT id, name, category, ministry, description, benefits, apply_link, min_age, max_age, max_income, gender, state
    FROM schemes
    WHERE (? IS NULL OR min_age IS NULL OR min_age <= ?)
      AND (? IS NULL OR max_age IS NULL OR max_age >= ?)
      AND (? IS NULL OR max_income IS NULL OR max_income >= ?)
      AND (? IS NULL OR gender = 'All' OR gender = ?)
      AND (? IS NULL OR state = 'All India' OR state = ?)
      AND (? IS NULL OR caste = 'All' OR caste = ?)
      AND (? IS NULL OR occupation = 'All' OR occupation = ?)
    ORDER BY name
  `;

  const values = [
    userAge, userAge,
    userAge, userAge,
    userIncome, userIncome,
    userGender, userGender,
    userState, userState,
    userCaste, userCaste,
    userOccupation, userOccupation
  ];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Scheme matching error:', err);
      return res.status(500).json({ message: 'Server error while matching schemes' });
    }
    res.json(results);
  });
});

// ===== IMPORTANT: /trending/top ha /:id chya AADHI asayla hava =====
// Nahitar Express '/trending/top' la id samzun '/:id' route madhe pathvतो

// Get Trending/Most Saved Schemes
router.get('/trending/top', (req, res) => {
    const sql = `
        SELECT schemes.*, COUNT(saved_schemes.id) as save_count
        FROM schemes
        LEFT JOIN saved_schemes ON schemes.id = saved_schemes.scheme_id
        GROUP BY schemes.id
        ORDER BY save_count DESC
        LIMIT 5
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.log('Trending Error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        res.json(results);
    });
});

router.get('/', (req, res) => {
  const sql = `SELECT * FROM schemes ORDER BY name`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching schemes:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// Add/Update Rating
router.post('/:id/rate', (req, res) => {
    const { user_id, rating } = req.body;
    const scheme_id = req.params.id;

    const sql = `INSERT INTO ratings (scheme_id, user_id, rating) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE rating = ?`;

    db.query(sql, [scheme_id, user_id, rating, rating], (err, result) => {
        if (err) {
            console.log('Rating Error:', err);
            return res.status(500).json({ message: 'Failed to submit rating!' });
        }
        res.json({ message: 'Rating submitted successfully!' });
    });
});

// Get Average Rating for a Scheme
router.get('/:id/rating', (req, res) => {
    const scheme_id = req.params.id;

    db.query(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as total_ratings FROM ratings WHERE scheme_id = ?',
        [scheme_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json({
                avg_rating: results[0].avg_rating ? parseFloat(results[0].avg_rating).toFixed(1) : 0,
                total_ratings: results[0].total_ratings
            });
        }
    );
});

// Get User's Rating for a Scheme
router.get('/:id/rating/:user_id', (req, res) => {
    db.query(
        'SELECT rating FROM ratings WHERE scheme_id = ? AND user_id = ?',
        [req.params.id, req.params.user_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.json({ rating: results.length > 0 ? results[0].rating : 0 });
        }
    );
});

// ===== IMPORTANT: /:id (generic) hyala sagalyat SHEVATI thevaych =====
// Karan '/:id' kahi pan match karta - '/trending/top', '/:id/rate' सुद्धा
// jar ha varti asel tar khalche routes kadhich trigger honar nahit

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM schemes WHERE id = ?`;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching scheme:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json(results[0]);
  });
});

module.exports = router;
