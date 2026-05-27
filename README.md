# PDF-to-Summary

AI-powered PDF summarization app. Upload a PDF, get a concise AI-generated summary using T5-small.

Built as a monorepo — **Next.js** frontend proxies API calls to a **FastAPI** Python backend. Authentication via **Clerk**, database via **Turso Cloud** (SQLite at the edge), schema managed with **Drizzle Kit**.

## Architecture

```
┌──────────────┐     /api/*       ┌──────────────┐        ┌──────────────┐
│   Browser    │ ───────────────> │  Next.js     │ ────>  │  FastAPI     │
│  (User)      │                  │  (Port 3000) │  proxy  │  (Port 8000) │
│              │ <─────────────── │  Frontend    │ <────   │  Python ML   │
└──────────────┘     HTML/JSON    └──────┬───────┘        └──────┬───────┘
                                         │                       │
                                    Clerk Auth               Turso DB
                                    (JWT tokens)              (Drizzle)
```

- **Single entry point**: `http://localhost:3000`
- **Next.js API routes** (`/api/*`) proxy JSON requests to FastAPI at `localhost:8000`
- **FastAPI** handles PDF processing, ML summarization (T5-small via transformers), file storage
- **Clerk** handles auth UI + JWT issuance on the frontend; backend validates the JWT
- **Turso Cloud** stores users, PDF metadata, and summary history
- **Drizzle Kit** manages schema, migrations, and type-safe queries

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend framework | Next.js 15 (App Router) | React, SSR, API proxy routes |
| Styling | Tailwind CSS 4 + shadcn/ui | Utility-first + accessible components |
| Auth | Clerk | Social login, magic links, JWT management |
| Backend framework | FastAPI (Python) | Async API server, auto OpenAPI docs |
| ML inference | transformers 4.41.2 (T5-small) | PDF summarization |
| PDF parsing | PyMuPDF | Text extraction from PDFs |
| Database | Turso Cloud (libsql) | Edge-distributed SQLite |
| ORM / Schema | Drizzle Kit | Type-safe queries, migrations |
| File storage | Local filesystem (`uploads/`) | Dev; swap to S3/R2 in production |
| Python env | venv (Python 3.12) | Isolated backend dependencies |
| Monorepo | Root Makefile + start.sh | Single-command dev start |

## Directory Structure

```
pdf-to-summary/
├── backend/
│   ├── app.py                  # FastAPI application, all endpoints
│   ├── summarizer.py           # ML summarization (DO NOT MODIFY)
│   ├── models.py               # Pydantic request/response models
│   ├── auth.py                 # Clerk JWT verification middleware
│   ├── db.py                   # Turso/Drizzle connection config
│   ├── schema.py               # Drizzle schema definitions
│   ├── requirements.txt        # Python dependencies (pinned)
│   └── uploads/                # PDF uploads (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout (ClerkProvider)
│   │   │   ├── page.tsx             # Landing + upload
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   ├── sign-up/[[...sign-up]]/page.tsx
│   │   │   ├── dashboard/page.tsx   # Summary history
│   │   │   ├── summary/[id]/page.tsx # Single summary view
│   │   │   └── api/
│   │   │       └── summarize/
│   │   │           ├── upload/route.ts
│   │   │           ├── process/route.ts
│   │   │           ├── history/route.ts
│   │   │           ├── [id]/route.ts
│   │   │           └── download/[filename]/route.ts
│   │   ├── components/
│   │   │   ├── upload-form.tsx
│   │   │   ├── summary-card.tsx
│   │   │   ├── summary-view.tsx
│   │   │   ├── pdf-preview.tsx
│   │   │   └── theme-provider.tsx
│   │   └── lib/
│   │       ├── api.ts             # typed fetch helpers
│   │       ├── db.ts              # Turso client (libsql)
│   │       └── clerk.ts           # Clerk helpers
│   ├── drizzle/
│   │   ├── schema.ts              # Shared Drizzle schema
│   │   └── migrations/            # Auto-generated migrations
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   └── .env.local                 # Frontend env vars
│
├── start.sh                    # Starts both servers
├── Makefile                    # make dev, make install, make db-push
└── README.md                   # This file
```

## API Endpoints (FastAPI)

All endpoints except `/api/health` require a valid Clerk JWT in the `Authorization: Bearer <token>` header.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Health check |
| `POST` | `/api/summarize/upload` | Yes | Upload PDF → returns metadata |
| `POST` | `/api/summarize/process` | Yes | Process uploaded PDF → returns summary |
| `GET` | `/api/summarize/history` | Yes | List user's past summaries |
| `GET` | `/api/summarize/{id}` | Yes | Get a specific summary |
| `DELETE` | `/api/summarize/{id}` | Yes | Delete a summary |
| `GET` | `/api/summarize/download/{filename}` | Yes | Download summary as .txt |

### Request / Response Shapes

**POST /api/summarize/upload**

```
Request:  multipart/form-data { file: <PDF> }
Response: { filename, page_count, file_size }
```

**POST /api/summarize/process**

```
Request:  { filename: string }
Response: {
  summary: string,
  summary_word_count: number,
  original_word_count: number,
  chunks_processed: number,
  page_count: number,
  id: string
}
```

## Database Schema (Drizzle + Turso)

```typescript
// backend/schema.ts

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email"),
  name: text("name"),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});

export const summaries = sqliteTable("summaries", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  originalFilename: text("original_filename").notNull(),
  pageCount: integer("page_count").notNull(),
  originalWordCount: integer("original_word_count").notNull(),
  summaryWordCount: integer("summary_word_count").notNull(),
  chunksProcessed: integer("chunks_processed").notNull(),
  summary: text("summary").notNull(),
  fileSize: integer("file_size").notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
  updatedAt: text("updated_at").default(sql`(current_timestamp)`),
});
```

Migrations managed via:

```bash
npx drizzle-kit push      # dev: push schema to Turso
npx drizzle-kit generate   # prod: generate migration files
npx drizzle-kit migrate    # prod: apply migrations
```

## Auth Flow (Clerk)

1. User visits `/sign-in` — Clerk renders the auth UI
2. Clerk issues a short-lived JWT (`sessionToken`)
3. Frontend attaches `Authorization: Bearer <token>` to every API call
4. Next.js API routes forward the token to FastAPI
5. FastAPI middleware validates the JWT against Clerk's JWKS endpoint
6. `userId` extracted from token → scopes all DB queries to that user

## Data Flow (End-to-End)

```
1. Browser → uploads PDF via form
2. Next.js → POST /api/summarize/upload → FastAPI saves file, extracts metadata
3. Browser → shows preview + "Summarize" button
4. User clicks Summarize
5. Next.js → POST /api/summarize/process → FastAPI:
   a. Reads PDF via PyMuPDF
   b. Chunks text (240 words each)
   c. Runs T5-small pipeline on each chunk
   d. Saves summary to Turso (Drizzle)
   e. Returns summary to frontend
6. Next.js → displays summary with word counts
7. User can view history, download .txt, or delete
```

## Getting Started (Development)

### Prerequisites

- **Python 3.12** (required — TensorFlow does not support 3.13+)
- **Node.js** 20+
- **Turso CLI** (`brew install tursodatabase/tap/turso`)

### One-Time Setup

```bash
# 1. Clone and enter the project
cd pdf-to-summary

# 2. Backend — create virtualenv + install deps
/opt/homebrew/bin/python3.12 -m venv backend/venv
source backend/venv/bin/activate && pip install -r backend/requirements.txt

# 3. Frontend — install npm deps
cd frontend && npm install && cd ..

# 4. Set up Turso database
turso auth login
turso db create pdf-summary
turso db show pdf-summary --url     # copy the URL
turso db tokens create pdf-summary  # copy the token

# 5. Set up environment variables (see section below)

# 6. Push Drizzle schema to Turso
cd frontend && npx drizzle-kit push
```

### Daily Commands

```bash
# Start everything — one command
make dev

# Or manually:
./start.sh
```

Both servers start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000 (internal, proxied via Next.js)

Stop with `Ctrl+C`.

### Resetting Everything

```bash
# If packages get corrupted
make clean && make install && make dev
```

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_live_***` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_live_***` |
| `TURSO_DATABASE_URL` | Turso database URL | `libsql://***.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso database token | `***` |
| `NEXT_PUBLIC_API_URL` | Backend URL (dev) | `http://localhost:8000` |

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_live_***` |
| `CLERK_JWKS_URL` | Clerk JWKS endpoint | `https://***.clerk.accounts.dev/.well-known/jwks.json` |
| `TURSO_DATABASE_URL` | Turso database URL | `libsql://***.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso database token | `***` |
| `UPLOAD_FOLDER` | PDF upload directory | `uploads` |

### Required Credentials at Setup

You will need to provide:

1. **Clerk** — Create an application at https://clerk.com, copy the **Publishable Key** and **Secret Key**
2. **Turso Cloud** — Run `turso auth login`, `turso db create pdf-summary`, then copy the **URL** and generate a **Token**

## Deployment

### Backend → Railway

1. Push `backend/` to a separate Railway service
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Add all env vars from the backend table above

### Frontend → Vercel

1. Push `frontend/` to Vercel
2. Set root directory to `frontend/`
3. Add all env vars from the frontend table above
4. Set `NEXT_PUBLIC_API_URL` to the Railway deployment URL

## Migrating from the Current App

| Current | New |
|---------|-----|
| Flask | FastAPI |
| Static HTML templates | Next.js + Tailwind + shadcn/ui |
| No auth | Clerk (Google, magic links) |
| No database | Turso Cloud + Drizzle Kit |
| No history | Full persistent summary history |
| Broken `start.sh` | Working `make dev` |
| Python 3.14 (broken) | Python 3.12 (verified working) |
| `summarizer.py` | **Unchanged** |

No changes to `summarizer.py` or `requirements.txt`.
