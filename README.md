# Full-Stack App Template

Full-Stack Template: FastAPI (Python) + React Native (Expo). Compliance-native: DSGVO, ISO 27001, BSI IT-Grundschutz.

## Tech Stack

### Backend
- Python 3.12+ / FastAPI (async)
- SQLAlchemy 2.0 async + Alembic
- Supabase (Auth, PostgreSQL, Storage)
- Celery + Redis (Task Queue)
- APScheduler (Cron Jobs)

### Frontend
- React Native 0.76+ / Expo SDK 52+
- Expo Router v4 (File-based Routing)
- NativeWind v4 (TailwindCSS)
- Zustand (State Management)
- TanStack Query (Server State)

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- Docker (for Redis)
- Poetry (`pip install poetry`)

### Setup
```bash
make setup
```

### Development
```bash
# Terminal 1: Backend
make dev-backend

# Terminal 2: Frontend
make dev-frontend

# Terminal 3: Celery (optional)
make celery
```

### Testing
```bash
make test           # All tests
make test-backend   # Backend only
make test-frontend  # Frontend only
```

### Linting
```bash
make lint
```

## Architecture

DDD Clean Architecture with dependency rule:
```
domain ←── application ←── infrastructure
                ↑                ↑
            interfaces ─────────┘
```

## Compliance

- **DSGVO**: 16 rules (consent, data rights, retention)
- **ISO 27001**: 27 rules (secure development, access control)
- **BSI IT-Grundschutz**: 21 rules (containers, networking, operations)

See `compliance/rules/` for all 64 rules.

## License

MIT
