const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// ✅ 1. Create Store (Protected)
router.post('/stores', verifyToken, async (req, res) => {
  const { name, description, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location are required' });
  }

  try {
    await db.promise().query(
      'INSERT INTO stores (name, description, location) VALUES (?, ?, ?)',
      [name, description, location]
    );
    res.status(201).json({ message: 'Store created successfully' });
  } catch (err) {
    console.error('Create Store Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 2. Get All Stores with Ratings
router.get('/stores', async (req, res) => {
  try {
    const [stores] = await db.promise().query(`
      SELECT 
        s.*, 
        ROUND(AVG(r.rating), 1) AS average_rating, 
        COUNT(r.id) AS total_reviews
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);

    res.json(stores);
  } catch (err) {
    console.error('Get Stores Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 3. Get One Store with Reviews
router.get('/stores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [storeResult] = await db.promise().query(`
      SELECT 
        s.*, 
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(r.id) AS total_reviews
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY s.id
    `, [id]);

    if (storeResult.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const store = storeResult[0];

    const [reviews] = await db.promise().query(`
      SELECT 
        r.rating, 
        r.review, 
        r.created_at, 
        u.name AS reviewer
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    store.reviews = reviews;

    res.json(store);
  } catch (err) {
    console.error('Get Store Details Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
