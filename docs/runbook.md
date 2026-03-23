# Operations Runbook

## Service Overview
- **Backend**: FastAPI (Python 3.12) — Port 3000
- **Celery Worker**: Async task processing
- **Redis**: Cache + Message Broker
- **Database**: Supabase PostgreSQL

## Health Checks
- Liveness: `GET /api/v1/health`
- Readiness: `GET /api/v1/ready`

## Startup
```bash
make setup      # First-time setup
make up         # Start infrastructure (Redis)
make dev-backend  # Start backend
make dev-frontend # Start Expo dev server
make celery     # Start Celery worker
```

## Common Operations

### Database Migrations
```bash
make migrate          # Apply pending migrations
make migrate-create msg="description"  # Create new migration
```

### Logs
Structured JSON via structlog. No PII in logs.
```bash
# View backend logs
docker compose logs -f backend
```

### Cache
```bash
# Flush Redis cache
docker compose exec redis redis-cli FLUSHDB
```

## Incident Response

### Severity Levels
- **SEV1**: Service down, data breach → Response within 15min
- **SEV2**: Degraded service → Response within 1h
- **SEV3**: Minor issue → Response within 4h

### Data Breach (DSGVO Art. 33)
1. Identify scope of breach
2. Contain the breach
3. Notify DPO (dpo@example.com) IMMEDIATELY
4. Document in incident log
5. Notify supervisory authority within 72 HOURS
6. Notify affected data subjects if high risk (Art. 34)

### Rollback
```bash
# Backend: revert to previous migration
cd backend && poetry run alembic downgrade -1

# Container: rollback to previous image
kubectl rollout undo deployment/backend
```

## Monitoring
- Health endpoints for uptime monitoring
- Structured logs for error tracking
- Redis metrics for cache hit/miss rates

## Contacts
- DPO: dpo@example.com
- On-Call: oncall@example.com
