# ADR-005: Dead-Stock Detection & AI-Tips

## Status
Accepted

## Date
2026-03-23

## Context
Items die laenger als X Tage im Status "ready" oder "listed" verbleiben, binden Kapital. Reseller brauchen automatische Erkennung und KI-basierte Handlungsempfehlungen (Preissenkung, Plattformwechsel, Bundle-Vorschlaege).

## Decision
- **APScheduler Cron-Job** (taeglich 06:00 UTC): Identifiziert stagnate Items
- **Celery-Task**: Generiert KI-Tipps via Perplexity Sonar fuer flagged Items
- **Notifications**: Erstellt Benachrichtigungen im Action Center
- **Konfigurierbar**: `dead_stock_threshold_days` (Default: 30 Tage)

## Compliance-Mapping
- **GDPR-5.1E**: Retention — alte Items werden nach konfigurierter Zeit archiviert
- **BSI-OPS-LOGGING**: Structured Logging fuer Detection-Runs

## Consequences
- **Positiv**: Proaktive Kapital-Optimierung, automatisierte Handlungsempfehlungen
- **Negativ**: Zusaetzliche API-Kosten fuer Sonar-Tipps
- **Mitigation**: Batch-Processing, max 10 Items pro Run
