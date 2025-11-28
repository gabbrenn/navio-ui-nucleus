import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all tips (with optional filters)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, status, partner_id, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT t.*, p.organization_name as partner_name FROM tips t LEFT JOIN partners p ON t.partner_id = p.id WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (category) {
      sql += ` AND t.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (status) {
      sql += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (partner_id) {
      sql += ` AND t.partner_id = $${paramCount}`;
      params.push(partner_id);
      paramCount++;
    }

    sql += ` ORDER BY t.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get tip by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT t.*, p.organization_name as partner_name 
       FROM tips t 
       LEFT JOIN partners p ON t.partner_id = p.id 
       WHERE t.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    // Increment views
    await query('UPDATE tips SET views_count = views_count + 1 WHERE id = $1', [req.params.id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new tip
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      partner_id,
      title,
      category,
      content,
      target_audience,
      priority,
      estimated_impact,
      tags,
    } = req.body;

    if (!title || !category || !content) {
      return res.status(400).json({ error: 'Title, category, and content are required' });
    }

    const result = await query(
      `INSERT INTO tips (partner_id, title, category, content, target_audience, priority, estimated_impact, tags, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        partner_id || null,
        title,
        category,
        content,
        target_audience || null,
        priority || null,
        estimated_impact || null,
        tags || [],
        'draft',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update tip
router.put('/:id', optionalAuth, async (req, res, next) => {
  try {
    const {
      title,
      category,
      content,
      target_audience,
      priority,
      estimated_impact,
      tags,
      status,
    } = req.body;

    const result = await query(
      `UPDATE tips
       SET title = COALESCE($1, title),
           category = COALESCE($2, category),
           content = COALESCE($3, content),
           target_audience = COALESCE($4, target_audience),
           priority = COALESCE($5, priority),
           estimated_impact = COALESCE($6, estimated_impact),
           tags = COALESCE($7, tags),
           status = COALESCE($8, status)
       WHERE id = $9
       RETURNING *`,
      [
        title,
        category,
        content,
        target_audience,
        priority,
        estimated_impact,
        tags,
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Like a tip
router.post('/:id/like', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      'UPDATE tips SET likes_count = likes_count + 1 WHERE id = $1 RETURNING likes_count',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({ likes_count: result.rows[0].likes_count });
  } catch (error) {
    next(error);
  }
});

// Delete tip
router.delete('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('DELETE FROM tips WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({ message: 'Tip deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

