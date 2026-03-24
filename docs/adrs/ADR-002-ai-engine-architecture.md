# ADR-002: AI-Engine-Architektur (Perplexity Search API + Sonar API)

## Status
Accepted

## Date
2026-03-23

## Context
ResellOS benoetigt KI-gestuetzte Marktanalyse, Resell-Score-Berechnung und SEO-Listing-Generierung. Dafuer brauchen wir Echtzeit-Web-Daten ueber aktuelle Marktpreise, Listings und Hype auf Plattformen wie Vinted, eBay Kleinanzeigen etc.

## Decision

### Perplexity Search API (Marktrecherche)
- **Endpoint**: `POST https://api.perplexity.ai/search`
- **Zweck**: Gerankte, strukturierte Web-Ergebnisse OHNE LLM-Synthese
- **Pricing**: $5 pro 1.000 Requests (flat, keine Token-Kosten)
- **Features**: Multi-Query, Domain-Filter, Recency-Filter, Country-Filter
- **Verarbeitung**: Eigener Scoring-Algorithmus im Domain Layer (ResellScoreCalculator)

### Perplexity Sonar API (Listing-Text-Generierung)
- **Endpoint**: `POST https://api.perplexity.ai/chat/completions`
- **Modell**: `sonar` ($1/$1 pro 1M Input/Output Tokens)
- **Zweck**: SEO-optimierte Listing-Texte (Titel, Beschreibung, Hashtags)
- **Format**: OpenAI-kompatibles Chat Completions Format

### SDK
- Offizielles Python SDK `perplexityai` mit async Support (`AsyncPerplexity`)
- Alternativ: direkter `httpx` async Client

## Compliance-Mapping
- **GDPR-5.1B**: Zweckbindung der KI-Analyse (nur Artikeldaten)
- **GDPR-5.1C**: Datenminimierung — nur Artikeldaten an Perplexity, KEINE User-PII
- **GDPR-25-DESIGN**: Privacy by Design — Pseudonymisierung der Anfragen

## Consequences
- **Positiv**: Kosteneffizient ($5/1K Searches), Echtzeit-Marktdaten, keine LLM-Halluzinationen bei Preisdaten
- **Negativ**: Abhaengigkeit von Drittanbieter-API, Rate-Limits beachten
- **Mitigation**: Redis Rate-Limiting, Graceful Degradation bei API-Ausfall
