# Navio Backend (API Routes Only)

> **⚠️ Important**: This backend folder contains **API routes and database code only**.  
> The actual server is now in the **root `server.ts`** file as part of the unified application.  
> 
> **See [UNIFIED_SETUP.md](../UNIFIED_SETUP.md) for the current setup instructions.**

## 📁 What's in This Folder

This folder contains:
- ✅ API route handlers (`src/routes/`)
- ✅ Database connection and migrations (`src/db/`)
- ✅ Middleware (`src/middleware/`)
- ❌ **NOT** a standalone server (that's in root `server.ts`)

## 🚀 How It Works Now

The root `server.ts` imports routes from this folder:
```typescript
import tipsRouter from './backend/src/routes/tips.js';
import campaignsRouter from './backend/src/routes/campaigns.js';
// etc...
```

Everything runs as **one unified application** on a single server.

## 📝 Available Commands (from root)

All commands are run from the **root directory**:

```bash
# Run migrations
npm run migrate

# Seed database
npm run seed

# Start development (unified server)
npm run dev

# Start production
npm start
```

## 🗄️ Database Schema

The database schema is in `src/db/schema.sql`. Run migrations from root:
```bash
npm run migrate
```

## 📚 API Routes

All routes are in `src/routes/`:
- `partners.ts` - Partner management
- `tips.ts` - Safety tips
- `campaigns.ts` - Campaigns
- `sessions.ts` - Live Q&A sessions
- `questions.ts` - Questions
- `answers.ts` - Answers
- `quiz.ts` - Quiz results
- `risk.ts` - Risk assessments
- `panic.ts` - Panic info
- `ai.ts` - AI analysis

These are imported and used by the root `server.ts`.

---

## 🔄 Migration from Old Setup

If you were using `backend/src/server.ts` before:
- ✅ **Deleted**: `backend/src/server.ts` (no longer needed)
- ✅ **Use**: Root `server.ts` (unified server)
- ✅ **Config**: Root `.env` file (not `backend/.env`)
