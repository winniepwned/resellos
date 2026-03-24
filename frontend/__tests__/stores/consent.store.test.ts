import { describe, it, expect, beforeEach, vi } from "vitest";
import { useConsentStore } from "@/stores/consent.store";

describe("consent.store", () => {
  beforeEach(() => {
    // Mock localStorage for jsdom
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    });

    // Reset store to defaults before each test
    useConsentStore.setState({
      analytics: false,
      marketing: false,
      thirdParty: false,
      hasShownBanner: false,
    });
  });

  it("defaults all consents to false (GDPR requirement)", () => {
    const state = useConsentStore.getState();
    expect(state.analytics).toBe(false);
    expect(state.marketing).toBe(false);
    expect(state.thirdParty).toBe(false);
  });

  it("toggles analytics consent", () => {
    useConsentStore.getState().setConsent("analytics", true);
    expect(useConsentStore.getState().analytics).toBe(true);

    useConsentStore.getState().setConsent("analytics", false);
    expect(useConsentStore.getState().analytics).toBe(false);
  });

  it("toggles marketing consent", () => {
    useConsentStore.getState().setConsent("marketing", true);
    expect(useConsentStore.getState().marketing).toBe(true);

    useConsentStore.getState().setConsent("marketing", false);
    expect(useConsentStore.getState().marketing).toBe(false);
  });

  it("revokeAll sets all consents to false", () => {
    const { setConsent } = useConsentStore.getState();
    setConsent("analytics", true);
    setConsent("marketing", true);
    setConsent("thirdParty", true);

    useConsentStore.getState().revokeAll();

    const state = useConsentStore.getState();
    expect(state.analytics).toBe(false);
    expect(state.marketing).toBe(false);
    expect(state.thirdParty).toBe(false);
  });
});
