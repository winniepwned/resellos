/**
 * Analytics module — ONLY active after explicit consent (GDPR Art. 7).
 */

import { useConsentStore } from "@/stores/consent.store";

export function trackEvent(name: string, _properties?: Record<string, unknown>): void {
  const hasConsent = useConsentStore.getState().consents.analytics;
  if (!hasConsent) {
    return;
  }
  // TODO: Send to analytics service after consent is given
}
