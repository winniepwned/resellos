import { create } from "zustand";

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
  hasShownBanner: boolean;
  setConsent: (purpose: "analytics" | "marketing" | "thirdParty", value: boolean) => void;
  revokeAll: () => void;
  setHasShownBanner: (shown: boolean) => void;
}

const loadFromStorage = (): Partial<ConsentState> => {
  try {
    const data = localStorage.getItem("resellos_consent");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveToStorage = (state: Partial<ConsentState>) => {
  localStorage.setItem("resellos_consent", JSON.stringify(state));
};

export const useConsentStore = create<ConsentState>((set, get) => {
  const stored = loadFromStorage();
  return {
    analytics: stored.analytics ?? false,
    marketing: stored.marketing ?? false,
    thirdParty: stored.thirdParty ?? false,
    hasShownBanner: stored.hasShownBanner ?? false,

    setConsent: (purpose, value) => {
      set({ [purpose]: value });
      const state = get();
      saveToStorage({
        analytics: state.analytics,
        marketing: state.marketing,
        thirdParty: state.thirdParty,
        hasShownBanner: state.hasShownBanner,
      });
    },

    revokeAll: () => {
      set({ analytics: false, marketing: false, thirdParty: false });
      const state = get();
      saveToStorage({
        analytics: false,
        marketing: false,
        thirdParty: false,
        hasShownBanner: state.hasShownBanner,
      });
    },

    setHasShownBanner: (shown) => {
      set({ hasShownBanner: shown });
      const state = get();
      saveToStorage({
        analytics: state.analytics,
        marketing: state.marketing,
        thirdParty: state.thirdParty,
        hasShownBanner: shown,
      });
    },
  };
});
