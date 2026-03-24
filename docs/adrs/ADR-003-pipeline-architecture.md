# ADR-003: Pipeline-Architektur (Sourcing + Item Creation)

## Status
Accepted

## Date
2026-03-23

## Context
Zwei Haupt-Workflows die asynchron laufen und Echtzeit-Feedback an die UI liefern muessen:
1. **Sourcing Pipeline**: Schnelle Kaufentscheidung (Keyword -> Score + Recommendation)
2. **Item Creation Pipeline**: Vollstaendige Listing-Vorbereitung (Preise + SEO-Text + Hashtags)

## Decision
- **Celery Tasks** fuer Pipeline-Steps (async, reliable, retryable)
- **Redis** fuer Zwischen-States und Pipeline-Status Cache
- **Polling** fuer Echtzeit-UI-Updates (GET /status Endpoint)
- Jeder Pipeline-Step aktualisiert den Redis-Cache mit aktuellem Status
- Bei Fehler: Status "failed" + Error-Reason (ohne Stack-Trace)

### Sourcing Pipeline (3 Steps)
1. Marken-Identifikation via Perplexity Search
2. Markt-Scan & Konkurrenz-Analyse via Perplexity Search
3. Score-Berechnung & Profitabilitaet (Domain Service, keine API)

### Item Creation Pipeline (4 Steps)
1. Bild- & Markenanalyse via Perplexity Search
2. Marktpreise & Konkurrenz via Perplexity Search
3. Finaler Resell-Score & Profit-Szenarien (Domain Service)
4. SEO-Listing-Generierung via Perplexity Sonar

## Compliance-Mapping
- **BSI-OPS-LOGGING**: Structured Logging pro Pipeline-Step
- **GDPR-5.1C**: Keine PII in Pipeline-Logs oder API-Requests

## Consequences
- **Positiv**: Reliable async processing, Status-Tracking, Retry-Faehigkeit
- **Negativ**: Celery + Redis Infrastruktur-Overhead
- **Mitigation**: Redis bereits vorhanden, Celery bereits konfiguriert
