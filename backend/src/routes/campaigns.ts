import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all campaigns
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { status, partner_id, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT c.*, p.organization_name as partner_name FROM campaigns c LEFT JOIN partners p ON c.partner_id = p.id WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      sql += ` AND c.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (partner_id) {
      sql += ` AND c.partner_id = $${paramCount}`;
      params.push(partner_id);
      paramCount++;
    }

    sql += ` ORDER BY c.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get campaign by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT c.*, p.organization_name as partner_name 
       FROM campaigns c 
       LEFT JOIN partners p ON c.partner_id = p.id 
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new campaign
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      partner_id,
      title,
      description,
      campaign_type,
      target_audience,
      start_date,
      end_date,
      platforms,
      budget,
      goals,
      kpis,
      keywords,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const result = await query(
      `INSERT INTO campaigns (partner_id, title, description, campaign_type, target_audience, start_date, end_date, platforms, budget, goals, kpis, keywords, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        partner_id || null,
        title,
        description,
        campaign_type || null,
        target_audience || null,
        start_date || null,
        end_date || null,
        platforms || [],
        budget || null,
        goals || null,
        kpis || [],
        keywords || [],
        'draft',
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update campaign
router.put('/:id', optionalAuth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      campaign_type,
      target_audience,
      start_date,
      end_date,
      platforms,
      budget,
      goals,
      kpis,
      keywords,
      status,
    } = req.body;

    const result = await query(
      `UPDATE campaigns
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           campaign_type = COALESCE($3, campaign_type),
           target_audience = COALESCE($4, target_audience),
           start_date = COALESCE($5, start_date),
           end_date = COALESCE($6, end_date),
           platforms = COALESCE($7, platforms),
           budget = COALESCE($8, budget),
           goals = COALESCE($9, goals),
           kpis = COALESCE($10, kpis),
           keywords = COALESCE($11, keywords),
           status = COALESCE($12, status)
       WHERE id = $13
       RETURNING *`,
      [
        title,
        description,
        campaign_type,
        target_audience,
        start_date,
        end_date,
        platforms,
        budget,
        goals,
        kpis,
        keywords,
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete campaign
router.delete('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('DELETE FROM campaigns WHERE id = $1 RETURNING *', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

