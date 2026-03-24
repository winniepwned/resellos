# ADR-004: Resell-Score als Value Object

## Status
Accepted

## Date
2026-03-23

## Context
Der Resell-Score (1-100) ist die zentrale Metrik beider Pipelines. Er muss konsistent validiert, berechnet und dargestellt werden.

## Decision
Domain Value Object `ResellScore` mit:
- Validierung: 1-100 (Integer)
- Farbzuordnung: 70-100 gruen ("Banger"), 40-69 gelb ("Okay"), 1-39 rot ("Ladenhueter")
- Berechnung basierend auf: Marktpreis-Spread, Konkurrenz-Dichte, Nachfrage-Level, Profit-Marge
- Immutable (Value Object Pattern)

## Consequences
- **Positiv**: Konsistente Score-Logik, testbar, wiederverwendbar
- **Negativ**: Keine externe Compliance-Abhaengigkeit
