# ADR-001: Frontend-Migration von Expo/React Native zu Vite + React (Web SPA)

## Status
Accepted

## Date
2026-03-23

## Context
ResellOS ist eine Web-App fuer Reseller die primaer am Desktop/Laptop arbeiten. Das bestehende Template nutzt React Native/Expo (Mobile-First), was fuer den Use-Case suboptimal ist. Reseller benoetigen:
- Schnellen Zugriff auf Inventar-Tabellen mit vielen Spalten
- Copy-Paste von generierten Listing-Texten
- Keyboard-Shortcuts (Cmd+K Command Palette)
- Side-by-Side Ansichten (Detail-Panel + Liste)

## Decision
Migration zu **Vite + React + Tailwind CSS + shadcn/ui** als Web SPA:
- **Vite**: Schnellster Build-Tooling, HMR, optimierte Production Builds
- **React**: Gleiche Komponentenlogik, minimaler Migrationsaufwand
- **Tailwind CSS**: Utility-First CSS, Dark Mode First
- **shadcn/ui**: Hochwertige, thematisierbare Komponenten (nicht als Dependency, sondern als kopierte Source)
- **Zustand**: State Management (bleibt gleich)
- **TanStack Query**: Server State (bleibt gleich)
- **React Router v6**: File-based Routing ersetzt Expo Router

## Compliance-Mapping
Alle bestehenden DSGVO-UI-Regeln muessen 1:1 im Web-Frontend erhalten bleiben:
- GDPR-7-DEFAULT: Consent-Checkboxen nie vorausgefuellt
- GDPR-7-REJECT: Ablehnen gleichwertig sichtbar
- GDPR-15-ACCESS: Daten-Export Button in Settings
- GDPR-17-ERASURE: Loesch-Button in Settings
- GDPR-20-PORTABILITY: JSON-Export

## Consequences
- **Positiv**: Bessere Desktop-UX, schnellere Entwicklung, groesseres Oekosystem
- **Negativ**: Kein nativer Mobile-Support (akzeptabel fuer v1.0.0)
- **Migration**: Zustand Stores und API-Hooks koennen weitgehend uebernommen werden
