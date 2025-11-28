import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get all partners
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM partners ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get partner by ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM partners WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create new partner (requires auth in production)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const {
      organization_name,
      contact_email,
      contact_phone,
      website,
      description,
    } = req.body;

    if (!organization_name || !contact_email) {
      return res.status(400).json({ error: 'Organization name and email are required' });
    }

    const result = await query(
      `INSERT INTO partners (organization_name, contact_email, contact_phone, website, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [organization_name, contact_email, contact_phone || null, website || null, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update partner
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const {
      organization_name,
      contact_email,
      contact_phone,
      website,
      description,
      verification_status,
    } = req.body;

    const result = await query(
      `UPDATE partners
       SET organization_name = COALESCE($1, organization_name),
           contact_email = COALESCE($2, contact_email),
           contact_phone = COALESCE($3, contact_phone),
           website = COALESCE($4, website),
           description = COALESCE($5, description),
           verification_status = COALESCE($6, verification_status)
       WHERE id = $7
       RETURNING *`,
      [
        organization_name,
        contact_email,
        contact_phone,
        website,
        description,
        verification_status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete partner
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM partners WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

