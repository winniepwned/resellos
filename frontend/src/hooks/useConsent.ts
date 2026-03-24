import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useConsentStore } from "@/stores/consent.store";

export function useConsent() {
  const store = useConsentStore();

  const grantMutation = useMutation({
    mutationFn: (purpose: string) =>
      apiClient("/consent", { method: "POST", body: { purpose } }),
  });

  const revokeMutation = useMutation({
    mutationFn: (purpose: string) =>
      apiClient(`/consent/${purpose}`, { method: "DELETE" }),
  });

  const grant = async (purpose: "analytics" | "marketing" | "thirdParty") => {
    const apiPurpose = purpose === "thirdParty" ? "third_party" : purpose;
    store.setConsent(purpose, true);
    await grantMutation.mutateAsync(apiPurpose);
  };

  const revoke = async (purpose: "analytics" | "marketing" | "thirdParty") => {
    const apiPurpose = purpose === "thirdParty" ? "third_party" : purpose;
    store.setConsent(purpose, false);
    await revokeMutation.mutateAsync(apiPurpose);
  };

  return { ...store, grant, revoke };
}
