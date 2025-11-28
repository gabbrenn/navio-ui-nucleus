import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all questions (optionally filtered by session)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { session_id, status, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM questions WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (session_id) {
      sql += ` AND session_id = $${paramCount}`;
      params.push(session_id);
      paramCount++;
    }

    if (status) {
      sql += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    sql += ` ORDER BY upvotes DESC, created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get question by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT q.*, 
       (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
       FROM questions q 
       WHERE q.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new question
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { session_id, user_id, question_text } = req.body;

    if (!session_id || !question_text) {
      return res.status(400).json({ error: 'Session ID and question text are required' });
    }

    const result = await query(
      `INSERT INTO questions (session_id, user_id, question_text, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [session_id, user_id || null, question_text, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Upvote question
router.post('/:id/upvote', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      'UPDATE questions SET upvotes = upvotes + 1 WHERE id = $1 RETURNING upvotes',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ upvotes: result.rows[0].upvotes });
  } catch (error) {
    next(error);
  }
});

// Update question status
router.patch('/:id/status', optionalAuth, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await query(
      'UPDATE questions SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete question
router.delete('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('DELETE FROM questions WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

