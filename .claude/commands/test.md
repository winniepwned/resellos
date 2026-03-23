# Tests generieren und ausführen

$ARGUMENTS enthält: Scope ("backend", "frontend", "all", oder spezifische Datei)

Delegiere an **qa-tester**:
1. Backend: Unit + Integration + Security + DSGVO Tests
2. Frontend: Component + Store + Screen Tests
3. Ausführen und Coverage prüfen
4. WIEDERHOLE bis Coverage erreicht (Unit ≥80%, Integration ≥60%)
5. Max 5 Iterationen, dann Eskalation
