import { Button } from "@/components/ui/button";
import { useConsentStore } from "@/stores/consent.store";

export function ConsentBanner() {
  const hasShownBanner = useConsentStore((s) => s.hasShownBanner);
  const setConsent = useConsentStore((s) => s.setConsent);
  const setHasShownBanner = useConsentStore((s) => s.setHasShownBanner);

  if (hasShownBanner) return null;

  const handleAcceptAll = () => {
    setConsent("analytics", true);
    setConsent("marketing", true);
    setHasShownBanner(true);
  };

  const handleRejectAll = () => {
    // GDPR-7-DEFAULT: No consent granted by default
    setHasShownBanner(true);
  };

  const handleCustomize = () => {
    setHasShownBanner(true);
    // Navigate to settings for detailed consent management
    window.location.href = "/settings";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">Datenschutz-Einstellungen</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Wir verwenden Cookies und aehnliche Technologien.{" "}
            <a href="/privacy" className="underline">Datenschutzerklaerung</a>
          </p>
        </div>
        <div className="flex gap-2">
          {/* GDPR-7-REJECT: Reject equally prominent */}
          <Button variant="outline" size="sm" onClick={handleRejectAll}>
            Ablehnen
          </Button>
          <Button variant="outline" size="sm" onClick={handleCustomize}>
            Anpassen
          </Button>
          <Button size="sm" onClick={handleAcceptAll}>
            Akzeptieren
          </Button>
        </div>
      </div>
    </div>
  );
}
