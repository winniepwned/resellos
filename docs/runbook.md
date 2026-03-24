# ResellOS Operational Runbook

## Health Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/health` | GET | Liveness check -- returns `200 OK` if the process is running |
| `/api/v1/ready` | GET | Readiness check -- verifies database, Redis, and external API connectivity |

**Expected response (healthy):**

```json
{
  "status": "ok",
  "version": "1.0.0",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "perplexity_api": "ok"
  }
}
```

## Monitoring

### Structured Logging

ResellOS uses **structlog** for structured JSON logging. All log entries include:

- `timestamp` (ISO 8601)
- `level` (info, warning, error)
- `event` (log message)
- `request_id` (correlation ID per request)
- `user_id` (if authenticated, pseudonymized in non-debug mode)

Logs intentionally exclude PII to comply with GDPR requirements.

### Key Metrics to Monitor

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| API response time (p95) | structlog / APM | > 2s |
| Error rate (5xx) | structlog | > 1% of requests |
| Redis memory usage | Redis INFO | > 200 MB (of 256 MB limit) |
| Celery task queue depth | Celery Flower | > 50 pending tasks |
| Celery task failure rate | Celery Flower | > 5% |
| Database connection pool | SQLAlchemy pool stats | > 80% utilization |

## Perplexity API

### Health Check

The `/api/v1/ready` endpoint includes a Perplexity API connectivity check. Monitor:

- **Rate limits**: Perplexity enforces per-minute and per-day rate limits. The backend uses token-bucket rate limiting via Redis to stay within bounds.
- **Budget**: Pricing is approximately **$5 per 1,000 requests**. Track monthly spend via Perplexity dashboard.
- **Latency**: Typical response time is 2-5 seconds for search queries, 3-8 seconds for Sonar text generation.

### Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `429 Too Many Requests` | Rate limit exceeded | Automatic retry with exponential backoff (max 3 retries). If persistent, reduce pipeline concurrency. |
| `401 Unauthorized` | Invalid or expired API key | Rotate the `PERPLEXITY_API_KEY` in environment variables. |
| `500/503` | Perplexity service issue | Pipeline tasks are retried via Celery. Check Perplexity status page. |
| Timeout (> 30s) | Slow response | httpx client timeout triggers retry. If frequent, check network or reduce query complexity. |

## Pipeline Monitoring

### Redis Status Cache

Pipeline progress is cached in Redis with keys:

- `pipeline:sourcing:{task_id}` -- Sourcing pipeline status
- `pipeline:item_creation:{task_id}` -- Item creation pipeline status

Values: `pending`, `processing`, `completed`, `failed`

TTL: 24 hours after completion.

### Celery Flower

Celery Flower provides a web UI for monitoring task queues:

```bash
celery -A src.infrastructure.celery_app flower --port=5555
```

Access at `http://localhost:5555`. Monitor:

- Active / reserved / completed task counts
- Task execution time distribution
- Worker status and heartbeat
- Failed task details and tracebacks

## Scheduled Jobs

All scheduled jobs run via **APScheduler** within the backend process.

| Job | Schedule | Purpose |
|-----|----------|---------|
| `retention_cleanup` | Daily at **03:00 UTC** | Deletes expired data per GDPR retention policies defined in `data_processing_manifest.yaml`. Covers soft-deleted items (90 days), deleted accounts (30 days), financial records (365 days). |
| `dead_stock_check` | Daily at **06:00 UTC** | Identifies items with no status change in 30+ days. Generates AI tips via Perplexity Sonar and creates notifications in the Action Center. |
| `sourcing_cleanup` | Daily at **04:00 UTC** | Purges expired sourcing pipeline results (> 7 days old) from Redis and database. |

### Verifying Job Execution

Check structlog output for:

```
{"event": "scheduled_job_started", "job": "retention_cleanup", "timestamp": "..."}
{"event": "scheduled_job_completed", "job": "retention_cleanup", "records_deleted": 12, "timestamp": "..."}
```

If a job fails, it logs with level `error` and includes the traceback. Jobs do not retry automatically -- investigate and re-trigger manually if needed.

## Common Issues and Resolutions

### Backend fails to start

| Symptom | Cause | Resolution |
|---------|-------|------------|
| `ConnectionRefusedError` on port 6379 | Redis not running | Run `docker compose up redis` |
| `asyncpg.InvalidPasswordError` | Wrong database credentials | Verify `DATABASE_URL` in `.env` matches Supabase connection string |
| `ModuleNotFoundError` | Dependencies not installed | Run `poetry install` in `backend/` |

### Pipeline tasks stuck in "pending"

1. Check Celery workers are running: `celery -A src.infrastructure.celery_app status`
2. Check Redis connectivity: `redis-cli ping` (expect `PONG`)
3. Check Flower for error details at `http://localhost:5555`
4. If a worker crashed, restart: `celery -A src.infrastructure.celery_app worker --loglevel=info`

### High memory usage on Redis

Redis is configured with a 256 MB limit and `allkeys-lru` eviction policy. If memory usage is consistently high:

1. Check for leaked pipeline status keys: `redis-cli DBSIZE`
2. Trigger manual cleanup: the `sourcing_cleanup` job can be invoked directly
3. Consider increasing the `maxmemory` setting in `docker-compose.yaml`

### Frontend build failures

| Symptom | Resolution |
|---------|------------|
| TypeScript errors | Run `npx tsc --noEmit` to identify type issues |
| Missing dependencies | Run `npm install` in `frontend/` |
| Vite port conflict | Change port in `vite.config.ts` or kill the conflicting process |

## GDPR Operations

### Data Export (Art. 20 -- Portability)

A user can request their data export through the UI or directly via the API:

```bash
curl -H "Authorization: Bearer <token>" \
  "https://<host>/api/v1/me/export?format=json"
```

Returns a JSON file containing all personal data: profile, items, consent records, and analytics. The export is generated on-demand and streamed.

### Data Deletion (Art. 17 -- Erasure)

```bash
curl -X DELETE -H "Authorization: Bearer <token>" \
  "https://<host>/api/v1/me"
```

This triggers:

1. Immediate soft-delete of the user account
2. Anonymization of all associated items and analytics
3. Revocation of all active sessions via Supabase Auth
4. Hard deletion by the `retention_cleanup` job after the retention period (30 days)

### Consent Audit

All consent records are stored with timestamps and version references. To audit:

```bash
curl -H "Authorization: Bearer <token>" \
  "https://<host>/api/v1/me/consents"
```

Returns a list of all consent grants and withdrawals with:

- `consent_type` (e.g., `ai_processing`, `analytics`)
- `granted_at` / `withdrawn_at` timestamps
- `consent_version` (policy version the user agreed to)

Consent records are retained for **3 years after withdrawal** per legal requirements, then purged by the `retention_cleanup` job.

## Incident Response

### Severity Levels

- **SEV1**: Service down, data breach -- Response within 15 minutes
- **SEV2**: Degraded service -- Response within 1 hour
- **SEV3**: Minor issue -- Response within 4 hours

### Data Breach (DSGVO Art. 33)

1. Identify scope of breach
2. Contain the breach immediately
3. Notify DPO (dpo@example.com) IMMEDIATELY
4. Document in incident log
5. Notify supervisory authority within 72 HOURS
6. Notify affected data subjects if high risk (Art. 34)

## Database Operations

### Migrations

```bash
cd backend && poetry run alembic upgrade head     # Apply pending migrations
cd backend && poetry run alembic revision --autogenerate -m "description"  # Create migration
cd backend && poetry run alembic downgrade -1      # Rollback last migration
```

## Contacts

- DPO: dpo@example.com
- On-Call: oncall@example.com
