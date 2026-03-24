# Changelog

## [1.0.0] - 2026-03-24

### Added
- **Sourcing Pipeline**: AI-powered purchase decision support (keyword -> Resell-Score + profit estimate)
- **Item Creation Pipeline**: Full listing preparation (market prices, SEO text, hashtags via Perplexity Sonar API)
- **Resell-Score (1-100)**: Premium metric combining hype, demand, and competition data
- **Inventory Management (WaWi)**: Full CRUD with table/grid views, status tracking, filters
- **Analytics Dashboard**: Financial overview, inventory health, brand performance, sell-through rate
- **Dead-Stock Detection**: Automated daily detection + AI-generated tips for stagnating items
- **Command Palette (Cmd+K)**: Global navigation and search
- **Notifications / Action Center**: Dead-stock alerts, pipeline completions, price changes
- **Dark Mode First UI**: Premium OS-look with shadcn/ui + Tailwind CSS
- **GDPR Compliance**: Consent management (Art. 7), data export (Art. 20), data deletion (Art. 17), retention policies (Art. 5)
- **Perplexity Search API Integration**: Market research with domain-filtered, multi-query search ($5/1K requests)
- **Perplexity Sonar API Integration**: SEO-optimized listing text generation (model: sonar)

### Changed
- **BREAKING**: Frontend migrated from Expo/React Native to Vite + React (Web SPA)
- Backend restructured to full DDD Clean Architecture (Domain -> Application -> Infrastructure -> Interfaces)
- Project renamed from template to ResellOS

### Technical
- FastAPI + async SQLAlchemy 2.0 + Pydantic v2
- Celery + Redis for async pipeline tasks
- APScheduler for cron jobs (retention cleanup, dead-stock detection)
- Supabase Auth (JWT) + PostgreSQL with RLS + Storage
- Cursor-based pagination, RFC 7807 error responses
- Token-bucket rate limiting via Redis
- Compliance: DSGVO(16) ISO-27001(27) BSI(21) -- 64 rules
