const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../middlewares/authMiddleware'); 
const db = require('../db/knex');

router.get('/test-db', async (req, res) => {
  try {
    const result = await db.raw('SELECT 1+1 AS result');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Example of a protected route: Creating a story
router.post('/create-story', authenticateToken, (req, res) => {
    // This route will now be protected by the authenticateToken middleware
    const user = req.user;  // Access the logged-in user info from the token
    
    // Logic to create a story goes here
    const { title, content } = req.body;  // Example fields for the story
  
    // Assuming you have a Story model or database interaction here
    // Story.create({ title, content, userId: user.id });
  
    res.json({ message: 'Story created successfully', user: user.username });
  });

module.exports = router;
