import { Router } from 'express';
import { query } from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Get panic info for authenticated user
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const user_id = req.user?.id;
    
    const result = await query(
      'SELECT * FROM panic_info WHERE user_id = $1 AND is_active = true',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Panic info not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create or update panic info (upsert)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const user_id = req.user?.id;
    const {
      full_name,
      id_number,
      blood_type,
      medical_conditions,
      emergency_hotline,
      trusted_friend,
      legal_support,
      digital_violence_helpline,
      emergency_contact_name,
      emergency_contact_relation,
      emergency_contact_phone,
    } = req.body;

    // Use INSERT ... ON CONFLICT to upsert
    const result = await query(
      `INSERT INTO panic_info (
        user_id, full_name, id_number, blood_type, medical_conditions,
        emergency_hotline, trusted_friend, legal_support, digital_violence_helpline,
        emergency_contact_name, emergency_contact_relation, emergency_contact_phone, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        full_name = EXCLUDED.full_name,
        id_number = EXCLUDED.id_number,
        blood_type = EXCLUDED.blood_type,
        medical_conditions = EXCLUDED.medical_conditions,
        emergency_hotline = EXCLUDED.emergency_hotline,
        trusted_friend = EXCLUDED.trusted_friend,
        legal_support = EXCLUDED.legal_support,
        digital_violence_helpline = EXCLUDED.digital_violence_helpline,
        emergency_contact_name = EXCLUDED.emergency_contact_name,
        emergency_contact_relation = EXCLUDED.emergency_contact_relation,
        emergency_contact_phone = EXCLUDED.emergency_contact_phone,
        is_active = EXCLUDED.is_active,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        user_id,
        full_name || null,
        id_number || null,
        blood_type || null,
        medical_conditions || null,
        emergency_hotline || null,
        trusted_friend || null,
        legal_support || null,
        digital_violence_helpline || null,
        emergency_contact_name || null,
        emergency_contact_relation || null,
        emergency_contact_phone || null,
        true,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update panic info
router.put('/', requireAuth, async (req, res, next) => {
  try {
    const user_id = req.user?.id;
    const {
      full_name,
      id_number,
      blood_type,
      medical_conditions,
      emergency_hotline,
      trusted_friend,
      legal_support,
      digital_violence_helpline,
      emergency_contact_name,
      emergency_contact_relation,
      emergency_contact_phone,
    } = req.body;

    const result = await query(
      `UPDATE panic_info
       SET full_name = COALESCE($1, full_name),
           id_number = COALESCE($2, id_number),
           blood_type = COALESCE($3, blood_type),
           medical_conditions = COALESCE($4, medical_conditions),
           emergency_hotline = COALESCE($5, emergency_hotline),
           trusted_friend = COALESCE($6, trusted_friend),
           legal_support = COALESCE($7, legal_support),
           digital_violence_helpline = COALESCE($8, digital_violence_helpline),
           emergency_contact_name = COALESCE($9, emergency_contact_name),
           emergency_contact_relation = COALESCE($10, emergency_contact_relation),
           emergency_contact_phone = COALESCE($11, emergency_contact_phone)
       WHERE user_id = $12
       RETURNING *`,
      [
        full_name,
        id_number,
        blood_type,
        medical_conditions,
        emergency_hotline,
        trusted_friend,
        legal_support,
        digital_violence_helpline,
        emergency_contact_name,
        emergency_contact_relation,
        emergency_contact_phone,
        user_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Panic info not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Deactivate panic info
router.delete('/', requireAuth, async (req, res, next) => {
  try {
    const user_id = req.user?.id;

    const result = await query(
      'UPDATE panic_info SET is_active = false WHERE user_id = $1 RETURNING *',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Panic info not found' });
    }

    res.json({ message: 'Panic info deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;

