# ResellOS

**KI-gestuetztes Warenwirtschaftssystem fuer Reseller**

ResellOS is an AI-powered inventory management system designed for resellers. It combines market intelligence from the Perplexity API with a premium dark-mode UI to streamline sourcing decisions, listing preparation, and inventory tracking.

---

## Features

- **Sourcing Pipeline** -- AI-powered purchase decisions with Resell-Score (1-100) and profit estimates
- **Item Creation Pipeline** -- Market prices, SEO text, and hashtags via Perplexity Sonar API
- **Inventory Management (WaWi)** -- Full CRUD, table/grid views, status tracking, filters
- **Analytics Dashboard** -- Financial overview, inventory health, brand performance, sell-through rate
- **Dead-Stock Detection** -- Automated daily detection with AI-generated recovery tips
- **Command Palette (Cmd+K)** -- Global navigation and search
- **Notifications / Action Center** -- Dead-stock alerts, pipeline completions, price changes
- **GDPR Compliance** -- Consent management, data export, data deletion, retention policies

## Tech Stack

### Backend

| Component | Technology |
|-----------|------------|
| Framework | FastAPI 0.115+ |
| ORM | SQLAlchemy 2.0 (async) + asyncpg |
| Validation | Pydantic v2 |
| Task Queue | Celery 5.4 + Redis |
| Scheduler | APScheduler |
| Auth | Supabase Auth (JWT) |
| Database | PostgreSQL (Supabase) with RLS |
| AI/Search | Perplexity Search API + Sonar API |
| Logging | structlog (structured JSON) |
| Migrations | Alembic |

### Frontend

| Component | Technology |
|-----------|------------|
| Build Tool | Vite 5 |
| Framework | React 18 + TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 + shadcn/ui (Radix) |
| State | Zustand 5 |
| Data Fetching | TanStack Query 5 |
| Routing | React Router 6 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Command Palette | cmdk |

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- Docker & Docker Compose
- Supabase account (or local PostgreSQL)
- Perplexity API key

### Backend Setup

```bash
cd backend
poetry install
cp .env.example .env
# Configure .env with your Supabase and Perplexity API credentials
poetry run uvicorn src.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Configure .env with your Supabase public URL and anon key
npm run dev
```

### Docker (Redis)

```bash
docker compose up
```

This starts Redis (required for Celery task queue and rate limiting). PostgreSQL is provided by Supabase; uncomment the postgres service in `docker-compose.yaml` for local development without Supabase.

## Project Structure

```
resellos/
├── backend/
│   └── src/
│       ├── domain/            # Entities, value objects, repository interfaces
│       ├── application/       # Use cases, DTOs, service interfaces
│       ├── infrastructure/    # Database repos, external APIs, Celery tasks
│       ├── interfaces/        # FastAPI routers, middleware, schemas
│       ├── config.py          # Settings (pydantic-settings)
│       └── main.py            # Application entry point
├── frontend/
│   └── src/
│       ├── components/        # UI components (shadcn/ui based)
│       ├── pages/             # Route pages
│       ├── hooks/             # Custom React hooks
│       ├── stores/            # Zustand state stores
│       ├── lib/               # Utilities, API client
│       └── types/             # TypeScript type definitions
├── docs/                      # Documentation
├── docker-compose.yaml        # Redis (+ optional PostgreSQL)
├── data_processing_manifest.yaml  # GDPR processing activities
└── CHANGELOG.md
```

## Architecture

ResellOS follows **Domain-Driven Design (DDD)** with Clean Architecture:

```
┌─────────────────────────────────────────────┐
│                 Interfaces                   │
│         (FastAPI Routers, Middleware)         │
├─────────────────────────────────────────────┤
│                Application                   │
│          (Use Cases, DTOs, Services)         │
├─────────────────────────────────────────────┤
│                  Domain                      │
│    (Entities, Value Objects, Repo Interfaces)│
├─────────────────────────────────────────────┤
│               Infrastructure                 │
│  (DB Repos, Perplexity API, Celery, Redis)   │
└─────────────────────────────────────────────┘
```

Dependencies point inward: Infrastructure and Interfaces depend on Application and Domain, but Domain has no external dependencies.

## Compliance

ResellOS implements a comprehensive compliance framework:

- **DSGVO (GDPR)** -- 16 rules covering consent (Art. 7), data export (Art. 20), erasure (Art. 17), retention (Art. 5), and processing records
- **ISO 27001** -- 27 controls for information security management
- **BSI IT-Grundschutz** -- 21 measures for baseline security

Total: **64 compliance rules** enforced across the stack. See `data_processing_manifest.yaml` for the full GDPR processing activity register.

## License

All rights reserved. License TBD.
