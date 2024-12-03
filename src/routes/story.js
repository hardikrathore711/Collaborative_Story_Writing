const express = require('express');
const db = require('../db/knex');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new story
router.post('/create',authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const creatorUserId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: 'Story title and content are required' });
  }

  try {
    const [newStory] = await db('stories')
      .insert({ title, content, creator_user_id: creatorUserId })
      .returning(['id', 'title', 'content','creator_user_id']);
    res.status(201).json({ message: 'Story created successfully', newStory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating story' , error: err });
  }
});

// Add a new part to a story
router.post('/:storyId/add-part',authenticateToken, async (req, res) => {
  const { storyId } = req.params;
  const { title, content, previousPartId } = req.body;
  const writerUserId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ message: 'Part title and content are required' });
  }

  try {
    // Create a new part
    const [newPart] = await db('parts')
      .insert({ story_id: storyId, title, content, writer_user_id: writerUserId })
      .returning(['id', 'story_id', 'title', 'content', 'writer_user_id']);

    // Link the new part to the previous part if specified
    if (previousPartId) {
      await db('part_branches').insert({
        part_id: previousPartId,
        next_part_id: newPart.id,
      });
    }

    res.status(201).json(newPart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding part' });
  }
});
router.get('/:storyId', async (req, res) => {
  const { storyId } = req.params;

  try {
    const story = await db('content').where({ id: storyId }).first();
    if (!story) {
      return res.status(404).json({ message: 'Story not fetched correctly.' });
    }

    res.json({ story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching story details' });
  }
});

// View a specific part and its details
router.get('/part/:partId', async (req, res) => {
  const { partId } = req.params;

  try {
    const part = await db('parts').where({ id: partId }).first();
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    // Get the previous and next parts
    const previousPart = await db('part_branches').where({ next_part_id: partId }).first();
    const nextParts = await db('part_branches')
      .where({ part_id: partId })
      .join('parts', 'parts.id', '=', 'part_branches.next_part_id')
      .select('parts.id', 'parts.title', 'parts.writer_user_id');

    res.json({ part, previousPart, nextParts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching part details' });
  }
});

router.get('/view', async (req, res) => {
  try {
    const stories = await db('stories').select('*');
    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stories in story.js' });
  }
});

module.exports = router;
