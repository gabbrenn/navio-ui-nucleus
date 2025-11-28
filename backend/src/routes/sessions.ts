import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all sessions
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { status, partner_id, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT s.*, p.organization_name as partner_name FROM sessions s LEFT JOIN partners p ON s.partner_id = p.id WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      sql += ` AND s.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (partner_id) {
      sql += ` AND s.partner_id = $${paramCount}`;
      params.push(partner_id);
      paramCount++;
    }

    sql += ` ORDER BY s.scheduled_date DESC, s.scheduled_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get session by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT s.*, p.organization_name as partner_name 
       FROM sessions s 
       LEFT JOIN partners p ON s.partner_id = p.id 
       WHERE s.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new session
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      partner_id,
      title,
      description,
      session_type,
      topic,
      max_participants,
      duration,
      scheduled_date,
      scheduled_time,
      facilitator,
      target_audience,
      expected_outcomes,
      engagement_metrics,
      resources,
      tags,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const result = await query(
      `INSERT INTO sessions (partner_id, title, description, session_type, topic, max_participants, duration, scheduled_date, scheduled_time, facilitator, target_audience, expected_outcomes, engagement_metrics, resources, tags, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        partner_id || null,
        title,
        description,
        session_type || null,
        topic || null,
        max_participants || null,
        duration || null,
        scheduled_date || null,
        scheduled_time || null,
        facilitator || null,
        target_audience || null,
        expected_outcomes || null,
        engagement_metrics || [],
        resources || [],
        tags || [],
        'scheduled',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update session
router.put('/:id', optionalAuth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      session_type,
      topic,
      max_participants,
      duration,
      scheduled_date,
      scheduled_time,
      facilitator,
      target_audience,
      expected_outcomes,
      engagement_metrics,
      resources,
      tags,
      status,
    } = req.body;

    const result = await query(
      `UPDATE sessions
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           session_type = COALESCE($3, session_type),
           topic = COALESCE($4, topic),
           max_participants = COALESCE($5, max_participants),
           duration = COALESCE($6, duration),
           scheduled_date = COALESCE($7, scheduled_date),
           scheduled_time = COALESCE($8, scheduled_time),
           facilitator = COALESCE($9, facilitator),
           target_audience = COALESCE($10, target_audience),
           expected_outcomes = COALESCE($11, expected_outcomes),
           engagement_metrics = COALESCE($12, engagement_metrics),
           resources = COALESCE($13, resources),
           tags = COALESCE($14, tags),
           status = COALESCE($15, status)
       WHERE id = $16
       RETURNING *`,
      [
        title,
        description,
        session_type,
        topic,
        max_participants,
        duration,
        scheduled_date,
        scheduled_time,
        facilitator,
        target_audience,
        expected_outcomes,
        engagement_metrics,
        resources,
        tags,
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Join session (increment participant count)
router.post('/:id/join', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      'UPDATE sessions SET participant_count = participant_count + 1 WHERE id = $1 RETURNING participant_count',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ participant_count: result.rows[0].participant_count });
  } catch (error) {
    next(error);
  }
});

// Delete session
router.delete('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('DELETE FROM sessions WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

