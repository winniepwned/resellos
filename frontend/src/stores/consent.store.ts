import { create } from "zustand";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "consent-storage" });

interface Consents {
  analytics: boolean;
  marketing: boolean;
  thirdParty: boolean;
}

interface ConsentState {
  consents: Consents;
  hasShownBanner: boolean;
  toggleConsent: (key: keyof Consents) => void;
  setConsent: (key: keyof Consents, value: boolean) => void;
  setHasShownBanner: (value: boolean) => void;
  revokeAll: () => void;
}

const DEFAULT_CONSENTS: Consents = {
  analytics: false,
  marketing: false,
  thirdParty: false,
};

function loadConsents(): Consents {
  const stored = storage.getString("consents");
  if (stored) {
    return JSON.parse(stored) as Consents;
  }
  return { ...DEFAULT_CONSENTS };
}

function persistConsents(consents: Consents): void {
  storage.set("consents", JSON.stringify(consents));
}

export const useConsentStore = create<ConsentState>((set, get) => ({
  consents: loadConsents(),
  hasShownBanner: storage.getBoolean("hasShownBanner") ?? false,

  toggleConsent: (key) => {
    const current = get().consents;
    const updated = { ...current, [key]: !current[key] };
    persistConsents(updated);
    set({ consents: updated });
  },

  setConsent: (key, value) => {
    const current = get().consents;
    const updated = { ...current, [key]: value };
    persistConsents(updated);
    set({ consents: updated });
  },

  setHasShownBanner: (value) => {
    storage.set("hasShownBanner", value);
    set({ hasShownBanner: value });
  },

  revokeAll: () => {
    persistConsents({ ...DEFAULT_CONSENTS });
    set({ consents: { ...DEFAULT_CONSENTS } });
  },
}));
