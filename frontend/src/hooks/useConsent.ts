import { useConsentStore } from "@/stores/consent.store";
import { api } from "@/api/endpoints";

export function useConsent() {
  const { consents, toggleConsent, setConsent, revokeAll, hasShownBanner, setHasShownBanner } =
    useConsentStore();

  const syncConsent = async (purpose: string, granted: boolean) => {
    try {
      if (granted) {
        await api.grantConsent(purpose);
      } else {
        await api.revokeConsent(purpose);
      }
    } catch {
      // Revert on failure
      setConsent(purpose as keyof typeof consents, !granted);
    }
  };

  return {
    consents,
    hasShownBanner,
    toggleConsent,
    setConsent,
    revokeAll,
    setHasShownBanner,
    syncConsent,
  };
}
