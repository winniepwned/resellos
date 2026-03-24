import { useConsent } from "@/hooks/useConsent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConsentSettings() {
  const { analytics, marketing, thirdParty, grant, revoke, revokeAll } = useConsent();

  const toggle = async (purpose: "analytics" | "marketing" | "thirdParty", current: boolean) => {
    if (current) await revoke(purpose);
    else await grant(purpose);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Datenschutz & Einwilligungen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GDPR-7-DEFAULT: defaultChecked={false} */}
        <label className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Analytics</p>
            <p className="text-xs text-muted-foreground">Nutzungsstatistiken zur Verbesserung der App</p>
          </div>
          <input type="checkbox" checked={analytics} onChange={() => toggle("analytics", analytics)} className="h-4 w-4 rounded" />
        </label>
        <label className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Marketing</p>
            <p className="text-xs text-muted-foreground">Personalisierte Empfehlungen</p>
          </div>
          <input type="checkbox" checked={marketing} onChange={() => toggle("marketing", marketing)} className="h-4 w-4 rounded" />
        </label>
        <label className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Drittanbieter</p>
            <p className="text-xs text-muted-foreground">Datenverarbeitung durch Dritte</p>
          </div>
          <input type="checkbox" checked={thirdParty} onChange={() => toggle("thirdParty", thirdParty)} className="h-4 w-4 rounded" />
        </label>
        <Button variant="destructive" size="sm" onClick={revokeAll}>Alle widerrufen</Button>
        <p className="text-xs text-muted-foreground">
          <a href="/privacy" className="underline">Datenschutzerklaerung lesen</a>
        </p>
      </CardContent>
    </Card>
  );
}
