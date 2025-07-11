const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// ✅ POST /api/ratings - Add Rating (Protected)
router.post('/ratings', verifyToken, async (req, res) => {
  const { store_id, rating, review } = req.body;

  if (!store_id || !rating) {
    return res.status(400).json({ error: 'Store ID and rating are required' });
  }

  try {
    await db.promise().query(
      'INSERT INTO ratings (store_id, user_id, rating, review) VALUES (?, ?, ?, ?)',
      [store_id, req.user.id, rating, review]
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('Add Rating Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
