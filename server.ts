import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import backend routes
import { errorHandler } from './backend/src/middleware/errorHandler.js';
import partnersRouter from './backend/src/routes/partners.js';
import tipsRouter from './backend/src/routes/tips.js';
import campaignsRouter from './backend/src/routes/campaigns.js';
import sessionsRouter from './backend/src/routes/sessions.js';
import questionsRouter from './backend/src/routes/questions.js';
import answersRouter from './backend/src/routes/answers.js';
import quizRouter from './backend/src/routes/quiz.js';
import riskRouter from './backend/src/routes/risk.js';
import panicRouter from './backend/src/routes/panic.js';
import aiRouter from './backend/src/routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create API app function for use in Vite middleware
export function createApiApp() {
  const apiApp = express();

  // Middleware
  apiApp.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  }));
  apiApp.use(express.json());
  apiApp.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  apiApp.get('/health', (req: express.Request, res: express.Response) => {
    res.json({ status: 'ok', message: 'Navio Application is running' });
  });

  // API Routes
  apiApp.use('/partners', partnersRouter);
  apiApp.use('/tips', tipsRouter);
  apiApp.use('/campaigns', campaignsRouter);
  apiApp.use('/sessions', sessionsRouter);
  apiApp.use('/questions', questionsRouter);
  apiApp.use('/answers', answersRouter);
  apiApp.use('/quiz', quizRouter);
  apiApp.use('/risk', riskRouter);
  apiApp.use('/panic', panicRouter);
  apiApp.use('/ai', aiRouter);

  // API root endpoint
  apiApp.get('/', (req: express.Request, res: express.Response) => {
    res.json({
      message: 'Navio Safety Platform API',
      version: '1.0.0',
      endpoints: {
        partners: '/api/partners',
        tips: '/api/tips',
        campaigns: '/api/campaigns',
        sessions: '/api/sessions',
        questions: '/api/questions',
        answers: '/api/answers',
        quiz: '/api/quiz',
        risk: '/api/risk',
        panic: '/api/panic',
        ai: '/api/ai',
      },
    });
  });

  // Error handling
  apiApp.use(errorHandler);

  return apiApp;
}

// Standalone server for production
const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Use API routes
const apiApp = createApiApp();
app.use('/api', apiApp);

// Serve static files in production
if (isProduction) {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  
  // SPA fallback
  app.get('*', (req: express.Request, res: express.Response) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Only start standalone server if not in Vite dev mode
if (isProduction || process.argv.includes('--standalone')) {
  app.listen(PORT, () => {
    console.log(`🚀 Navio Application running on http://localhost:${PORT}`);
    console.log(`📚 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    if (isProduction) {
      console.log(`📦 Serving static files from: ${path.resolve(__dirname, 'dist')}`);
    }
  });
}

export default app;
