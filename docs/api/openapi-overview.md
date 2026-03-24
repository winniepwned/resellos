# ResellOS API Overview

Base URL: `/api/v1`

The full interactive OpenAPI specification is auto-generated and available at `/docs` (Swagger UI) and `/redoc` (ReDoc) when the backend server is running.

## Authentication

All endpoints (except health checks) require a valid Supabase JWT in the `Authorization: Bearer <token>` header. Tokens are issued by Supabase Auth and validated on every request.

## Endpoint Groups

### Items

CRUD operations for inventory management.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/items` | List items (cursor-based pagination, filters by status/brand/category) |
| POST | `/items` | Create a new item |
| GET | `/items/{id}` | Get item details |
| PATCH | `/items/{id}` | Update an item |
| DELETE | `/items/{id}` | Soft-delete an item |
| POST | `/items/{id}/mark-listed` | Mark item as listed on a platform |
| POST | `/items/{id}/mark-sold` | Mark item as sold (records sale price and date) |

### Sourcing Pipeline

AI-powered purchase decision support.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sourcing/evaluate` | Start a sourcing evaluation (keyword + optional category) |
| GET | `/sourcing/evaluate/{task_id}` | Poll pipeline status and result |
| GET | `/sourcing/history` | List past sourcing evaluations |

The sourcing pipeline returns a **Resell-Score (1-100)**, profit estimate, market analysis, and a buy/pass recommendation.

### Analytics / Dashboard

Financial and inventory metrics.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/overview` | Financial summary (revenue, profit, ROI) |
| GET | `/analytics/inventory` | Inventory health (stock levels, age distribution) |
| GET | `/analytics/brands` | Brand performance breakdown |
| GET | `/analytics/sell-through` | Sell-through rate over time |

### Notifications

Action Center for alerts and updates.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications (paginated, filterable by type) |
| PATCH | `/notifications/{id}/read` | Mark a notification as read |
| POST | `/notifications/read-all` | Mark all notifications as read |
| DELETE | `/notifications/{id}` | Dismiss a notification |

Notification types: `dead_stock`, `pipeline_complete`, `price_change`, `system`.

### Consent Management

GDPR consent tracking (Art. 7).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/consents` | List current consent status for all categories |
| POST | `/consents` | Grant consent for a category |
| DELETE | `/consents/{type}` | Withdraw consent for a category |

Consent categories: `ai_processing`, `analytics`, `marketing`.

### User / GDPR

Data subject rights (Art. 15-20).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get current user profile |
| PATCH | `/me` | Update profile (Art. 16 -- rectification) |
| DELETE | `/me` | Delete account and all data (Art. 17 -- erasure) |
| GET | `/me/export` | Export all personal data as JSON (Art. 20 -- portability) |
| POST | `/me/restrict` | Restrict processing (Art. 18) |
| GET | `/me/data` | Access all stored personal data (Art. 15 -- access) |
| GET | `/me/consents` | Audit trail of all consent actions |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Liveness probe (process is running) |
| GET | `/ready` | Readiness probe (database, Redis, Perplexity API connectivity) |

## Common Patterns

- **Pagination**: Cursor-based using `?cursor=<opaque_token>&limit=20`. Response includes `next_cursor` field.
- **Error responses**: RFC 7807 Problem Details format (`application/problem+json`).
- **Rate limiting**: Token-bucket via Redis. Limits are returned in `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.
- **Async pipelines**: POST returns `202 Accepted` with a `task_id`. Poll the corresponding GET endpoint for status and results.
