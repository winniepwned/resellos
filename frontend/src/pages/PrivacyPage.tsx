export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl py-12 px-4">
      <h1 className="text-2xl font-bold">Datenschutzerklaerung</h1>
      <div className="mt-6 space-y-4 text-sm text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Verantwortlicher</h2>
          <p>FIRMENNAME, Adresse, E-Mail: dpo@example.com</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">2. Erhobene Daten</h2>
          <p>Wir verarbeiten folgende personenbezogene Daten: E-Mail-Adresse, Anzeigename, Artikeldaten (Bilder, Preise), Einwilligungen.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">3. Rechtsgrundlage</h2>
          <p>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfullung), Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung fuer Einwilligungsverwaltung).</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">4. Drittanbieter</h2>
          <p>Fuer die KI-Marktanalyse nutzen wir die Perplexity API. Es werden ausschliesslich Artikeldaten (Marke, Kategorie, Zustand) uebermittelt — keine personenbezogenen Daten.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">5. Ihre Rechte</h2>
          <p>Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Loeschung (Art. 17), Einschraenkung (Art. 18) und Datenuebertragbarkeit (Art. 20). Nutzen Sie dafuer die Einstellungen-Seite oder kontaktieren Sie unseren DPO.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">6. Speicherdauer</h2>
          <p>Kontodaten: Dauer der Nutzung + 30 Tage. Finanzdaten: Dauer der Nutzung + 365 Tage. Einwilligungen: 3 Jahre nach Widerruf. Sourcing-Ergebnisse: 7 Tage.</p>
        </section>
      </div>
    </div>
  );
}
