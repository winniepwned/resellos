# Feature implementieren (End-to-End mit Gates)

$ARGUMENTS enthält die Feature-Beschreibung.

## Ablauf

### Phase 1: Analyse & Design
1. Anforderung analysieren — Backend, Frontend, oder Fullstack?
2. Wenn neue API-Endpoints: Delegiere an **api-designer**
3. Wenn Architektur-Entscheidung: Delegiere an **architect** → ADR
4. Wenn PII betroffen: `data_processing_manifest.yaml` aktualisieren
5. Wenn Supabase-Config nötig: Delegiere an **supabase-eng**

### Phase 2: Backend-Implementierung
6. Wenn DB-Schema: Delegiere an **database-eng** → Alembic-Migration + RLS
7. Delegiere Backend an **backend-dev**
8. Wenn Celery/APScheduler-Tasks: In infrastructure/tasks/ erstellen
9. `ruff check backend/` und `mypy backend/` muss sauber sein

### Phase 3: Frontend-Implementierung
10. Delegiere an **mobile-dev** → Expo Router Screens, Zustand Stores, API-Hooks
11. NativeWind-Styling, TypeScript strict
12. DSGVO-UIs wenn PII betroffen (Consent, Export, Löschung)

### Phase 4: Testing (ITERATIV bis bestanden)
13. Delegiere an **qa-tester** → Backend: pytest, Frontend: Jest
14. `pytest --cov=src --cov-fail-under=80` muss grün sein
15. Wenn Tests fehlschlagen → Fixen → Re-Run (max 5x)

### Phase 5: Quality Gates (VERPFLICHTEND)
16. **Security Gate:** Delegiere an **security-auditor**
    → PASS: 0 CRITICAL, ≤2 HIGH
    → Bei FAIL: Fix → Re-Run (max 3x)
17. **QA Gate:** Tests + Coverage prüfen
    → Bei FAIL: Tests generieren → Re-Run
18. **Compliance Gate:** Delegiere an **compliance-checker**
    → Bei FAIL: Fix → Re-Run (max 3x)

### Phase 6: Abschluss
19. Delegiere an **doc-writer** → CHANGELOG, API-Docs
20. Generiere Commit-Message (Conventional Commits + Compliance-Tags)

## WICHTIG: Nicht aufhören bis alle Gates PASS sind!
Retry → Reassign (höheres Modell) → Decompose → Human-Eskalation
