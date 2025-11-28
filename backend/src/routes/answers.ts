import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all answers (optionally filtered by question or session)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { question_id, session_id, limit = 50, offset = 0 } = req.query;
    
    let sql = `SELECT a.*, p.organization_name as partner_name 
               FROM answers a 
               LEFT JOIN partners p ON a.partner_id = p.id 
               WHERE 1=1`;
    const params: any[] = [];
    let paramCount = 1;

    if (question_id) {
      sql += ` AND a.question_id = $${paramCount}`;
      params.push(question_id);
      paramCount++;
    }

    if (session_id) {
      sql += ` AND a.session_id = $${paramCount}`;
      params.push(session_id);
      paramCount++;
    }

    sql += ` ORDER BY a.is_verified DESC, a.helpful_count DESC, a.created_at ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get answer by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT a.*, p.organization_name as partner_name 
       FROM answers a 
       LEFT JOIN partners p ON a.partner_id = p.id 
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new answer
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { question_id, session_id, partner_id, answer_text } = req.body;

    if (!question_id || !answer_text) {
      return res.status(400).json({ error: 'Question ID and answer text are required' });
    }

    // Get session_id from question if not provided
    let finalSessionId = session_id;
    if (!finalSessionId) {
      const questionResult = await query('SELECT session_id FROM questions WHERE id = $1', [question_id]);
      if (questionResult.rows.length === 0) {
        return res.status(404).json({ error: 'Question not found' });
      }
      finalSessionId = questionResult.rows[0].session_id;
    }

    const result = await query(
      `INSERT INTO answers (question_id, session_id, partner_id, answer_text, is_verified)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [question_id, finalSessionId, partner_id || null, answer_text, false]
    );

    // Update question status to answered
    await query('UPDATE questions SET status = $1 WHERE id = $2', ['answered', question_id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Mark answer as helpful
router.post('/:id/helpful', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      'UPDATE answers SET helpful_count = helpful_count + 1 WHERE id = $1 RETURNING helpful_count',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.json({ helpful_count: result.rows[0].helpful_count });
  } catch (error) {
    next(error);
  }
});

// Verify answer (admin/partner only)
router.patch('/:id/verify', optionalAuth, async (req, res, next) => {
  try {
    const { is_verified } = req.body;

    const result = await query(
      'UPDATE answers SET is_verified = $1 WHERE id = $2 RETURNING *',
      [is_verified !== false, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update answer
router.put('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { answer_text } = req.body;

    const result = await query(
      'UPDATE answers SET answer_text = $1 WHERE id = $2 RETURNING *',
      [answer_text, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete answer
router.delete('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('DELETE FROM answers WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

