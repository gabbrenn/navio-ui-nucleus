import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all risk assessments (optionally filtered by user)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { user_id, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM risk_assessments WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (user_id) {
      sql += ` AND user_id = $${paramCount}`;
      params.push(user_id);
      paramCount++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get risk assessment by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM risk_assessments WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Risk assessment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Submit risk assessment
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      user_id,
      digital_harm,
      platform,
      frequency,
      safety_feeling,
      escalating_risk,
      can_block_report,
    } = req.body;

    // Calculate risk level based on inputs
    let risk_level = 'low';
    if (safety_feeling <= 2 || escalating_risk === 'yes' || !can_block_report) {
      risk_level = 'high';
    } else if (safety_feeling === 3 || frequency === 'daily') {
      risk_level = 'medium';
    }

    const result = await query(
      `INSERT INTO risk_assessments (user_id, digital_harm, platform, frequency, safety_feeling, escalating_risk, can_block_report, risk_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        user_id || null,
        digital_harm || null,
        platform || null,
        frequency || null,
        safety_feeling || null,
        escalating_risk || null,
        can_block_report || false,
        risk_level,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;

