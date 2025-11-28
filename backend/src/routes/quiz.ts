import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all quiz results (optionally filtered by user or quiz)
router.get('/results', optionalAuth, async (req, res, next) => {
  try {
    const { user_id, quiz_id, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM quiz_results WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (user_id) {
      sql += ` AND user_id = $${paramCount}`;
      params.push(user_id);
      paramCount++;
    }

    if (quiz_id) {
      sql += ` AND quiz_id = $${paramCount}`;
      params.push(quiz_id);
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

// Get quiz result by ID
router.get('/results/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM quiz_results WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz result not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Submit quiz result
router.post('/results', optionalAuth, async (req, res, next) => {
  try {
    const {
      user_id,
      quiz_id,
      quiz_title,
      score,
      total_points,
      correct_answers,
      total_questions,
      completion_time,
      answers,
    } = req.body;

    if (!quiz_id || score === undefined || total_points === undefined) {
      return res.status(400).json({ error: 'Quiz ID, score, and total points are required' });
    }

    const result = await query(
      `INSERT INTO quiz_results (user_id, quiz_id, quiz_title, score, total_points, correct_answers, total_questions, completion_time, answers)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user_id || null,
        quiz_id,
        quiz_title || null,
        score,
        total_points,
        correct_answers || 0,
        total_questions || 0,
        completion_time || null,
        answers ? JSON.stringify(answers) : null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get('/stats/:user_id', optionalAuth, async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const statsResult = await query(
      `SELECT 
        COUNT(*) as total_quizzes,
        SUM(score) as total_points,
        SUM(correct_answers) as total_correct,
        SUM(total_questions) as total_questions,
        AVG(score::float / NULLIF(total_points, 0) * 100) as average_score_percentage
       FROM quiz_results
       WHERE user_id = $1`,
      [user_id]
    );

    const quizBreakdown = await query(
      `SELECT 
        quiz_id,
        quiz_title,
        COUNT(*) as attempts,
        MAX(score) as best_score,
        MAX(total_points) as max_points,
        AVG(score::float / NULLIF(total_points, 0) * 100) as average_percentage
       FROM quiz_results
       WHERE user_id = $1
       GROUP BY quiz_id, quiz_title`,
      [user_id]
    );

    res.json({
      overall: statsResult.rows[0],
      by_quiz: quizBreakdown.rows,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

