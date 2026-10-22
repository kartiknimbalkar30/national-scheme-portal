const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ===== TRACK A SCHEME VIEW =====
// POST /api/recently-viewed
router.post('/', (req, res) => {
  const { user_id, scheme_id } = req.body;

  // Validate input
  if (!user_id || !scheme_id) {
    return res.status(400).json({ 
      message: 'user_id and scheme_id are required' 
    });
  }

  // Validate user exists
  db.query('SELECT id FROM users WHERE id = ?', [user_id], (err, userResults) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate scheme exists
    db.query('SELECT id FROM schemes WHERE id = ?', [scheme_id], (err, schemeResults) => {
      if (err) {
        console.error('Error checking scheme:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      
      if (schemeResults.length === 0) {
        return res.status(404).json({ message: 'Scheme not found' });
      }

      // Check if already viewed - if yes, update timestamp; if no, insert
      const checkSql = `SELECT id FROM recently_viewed WHERE user_id = ? AND scheme_id = ?`;
      
      db.query(checkSql, [user_id, scheme_id], (err, results) => {
        if (err) {
          console.error('Error checking recently viewed:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
          // Update timestamp
          const updateSql = `UPDATE recently_viewed SET viewed_at = NOW() WHERE user_id = ? AND scheme_id = ?`;
          db.query(updateSql, [user_id, scheme_id], (err) => {
            if (err) {
              console.error('Error updating view:', err);
              return res.status(500).json({ message: 'Server error' });
            }
            
            // Increment view_count in schemes table
            db.query(
              'UPDATE schemes SET view_count = view_count + 1 WHERE id = ?',
              [scheme_id],
              (updateErr) => {
                if (updateErr) {
                  console.error('View count update error:', updateErr);
                }
                res.json({ 
                  message: 'View updated',
                  schemeId: scheme_id,
                  userId: user_id
                });
              }
            );
          });
        } else {
          // Insert new record
          const insertSql = `INSERT INTO recently_viewed (user_id, scheme_id, viewed_at) VALUES (?, ?, NOW())`;
          db.query(insertSql, [user_id, scheme_id], (err) => {
            if (err) {
              console.error('Error inserting view:', err);
              return res.status(500).json({ message: 'Server error' });
            }
            
            // Increment view_count in schemes table
            db.query(
              'UPDATE schemes SET view_count = view_count + 1 WHERE id = ?',
              [scheme_id],
              (updateErr) => {
                if (updateErr) {
                  console.error('View count update error:', updateErr);
                }
                
                // Keep only last 10 views per user
                const cleanupSql = `
                  DELETE FROM recently_viewed 
                  WHERE user_id = ? AND id NOT IN (
                    SELECT id FROM (
                      SELECT id FROM recently_viewed 
                      WHERE user_id = ? 
                      ORDER BY viewed_at DESC 
                      LIMIT 10
                    ) AS temp
                  )
                `;
                db.query(cleanupSql, [user_id, user_id], (cleanupErr) => {
                  if (cleanupErr) {
                    console.error('Cleanup error:', cleanupErr);
                  }
                  res.json({ 
                    message: 'View tracked',
                    schemeId: scheme_id,
                    userId: user_id
                  });
                });
              }
            );
          });
        }
      });
    });
  });
});

// ===== GET RECENTLY VIEWED SCHEMES =====
// GET /api/recently-viewed/:user_id
router.get('/:user_id', (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const sql = `
    SELECT 
      s.id, 
      s.name, 
      s.category, 
      s.ministry, 
      s.benefits,
      s.description,
      s.min_age,
      s.max_age,
      s.max_income,
      s.gender,
      s.state,
      s.apply_link,
      rv.viewed_at
    FROM recently_viewed rv
    JOIN schemes s ON rv.scheme_id = s.id
    WHERE rv.user_id = ?
    ORDER BY rv.viewed_at DESC
    LIMIT 10
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching recently viewed:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// ===== DELETE RECENTLY VIEWED SCHEME =====
// DELETE /api/recently-viewed/:user_id/:scheme_id
router.delete('/:user_id/:scheme_id', (req, res) => {
  const { user_id, scheme_id } = req.params;

  if (!user_id || !scheme_id) {
    return res.status(400).json({ 
      message: 'user_id and scheme_id are required' 
    });
  }

  // Check if the record exists
  db.query(
    'SELECT id FROM recently_viewed WHERE user_id = ? AND scheme_id = ?',
    [user_id, scheme_id],
    (err, results) => {
      if (err) {
        console.error('Error checking recently viewed:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Record not found' });
      }

      // Delete the record
      db.query(
        'DELETE FROM recently_viewed WHERE user_id = ? AND scheme_id = ?',
        [user_id, scheme_id],
        (err) => {
          if (err) {
            console.error('Error deleting recently viewed:', err);
            return res.status(500).json({ message: 'Server error' });
          }
          res.json({ 
            message: 'Removed from recently viewed',
            schemeId: scheme_id,
            userId: user_id
          });
        }
      );
    }
  );
});

// ===== CLEAR ALL RECENTLY VIEWED =====
// DELETE /api/recently-viewed/clear/:user_id
router.delete('/clear/:user_id', (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  db.query(
    'DELETE FROM recently_viewed WHERE user_id = ?',
    [user_id],
    (err) => {
      if (err) {
        console.error('Error clearing recently viewed:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ 
        message: 'Recently viewed cleared',
        userId: user_id
      });
    }
  );
});

// ===== GET RECENTLY VIEWED COUNT =====
// GET /api/recently-viewed/count/:user_id
router.get('/count/:user_id', (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  db.query(
    'SELECT COUNT(*) as count FROM recently_viewed WHERE user_id = ?',
    [user_id],
    (err, results) => {
      if (err) {
        console.error('Error counting recently viewed:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ 
        count: results[0].count,
        userId: user_id
      });
    }
  );
});

module.exports = router;
