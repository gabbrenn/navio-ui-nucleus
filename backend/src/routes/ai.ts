import { Router } from 'express';
import { query } from '../db/connection.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Get all AI analyses (optionally filtered by user)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { user_id, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM ai_analyses WHERE 1=1';
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

// Get AI analysis by ID
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM ai_analyses WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'AI analysis not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Analyze text and save result
router.post('/analyze', optionalAuth, async (req, res, next) => {
  try {
    const { user_id, input_text } = req.body;

    if (!input_text) {
      return res.status(400).json({ error: 'Input text is required' });
    }

    // Simple analysis logic (in production, integrate with actual AI service)
    const analysisResult = analyzeText(input_text);
    const riskLevel = determineRiskLevel(analysisResult);
    const confidenceScore = calculateConfidence(input_text, analysisResult);

    const result = await query(
      `INSERT INTO ai_analyses (user_id, input_text, analysis_result, risk_level, confidence_score)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user_id || null,
        input_text,
        analysisResult,
        riskLevel,
        confidenceScore,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Simple text analysis function (replace with actual AI service)
function analyzeText(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /meet|meeting|location|address/i, risk: 'medium' },
    { pattern: /personal.*info|password|account/i, risk: 'high' },
    { pattern: /urgent|immediately|asap/i, risk: 'medium' },
    { pattern: /money|payment|transfer/i, risk: 'high' },
    { pattern: /secret|don.*tell|confidential/i, risk: 'high' },
  ];

  const foundPatterns = suspiciousPatterns.filter(p => p.pattern.test(text));
  
  if (foundPatterns.length === 0) {
    return 'This message appears safe. No obvious red flags detected.';
  }

  const highRiskCount = foundPatterns.filter(p => p.risk === 'high').length;
  
  if (highRiskCount > 0) {
    return 'This message looks unsafe. Multiple red flags detected including requests for personal information or money.';
  }
  
  return 'This message may be suspicious. Exercise caution and verify the sender.';
}

function determineRiskLevel(analysisResult: string): string {
  if (analysisResult.includes('unsafe') || analysisResult.includes('red flags')) {
    return 'high';
  }
  if (analysisResult.includes('suspicious') || analysisResult.includes('caution')) {
    return 'medium';
  }
  return 'low';
}

function calculateConfidence(text: string, analysisResult: string): number {
  // Simple confidence calculation based on text length and analysis
  let confidence = 50;
  
  if (text.length > 100) confidence += 10;
  if (text.length > 500) confidence += 10;
  
  if (analysisResult.includes('red flags')) confidence += 20;
  if (analysisResult.includes('multiple')) confidence += 10;
  
  return Math.min(95, Math.max(30, confidence));
}

export default router;

