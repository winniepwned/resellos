import { apiClient } from "./client";

export const api = {
  health: () => apiClient<{ status: string }>("/health"),

  // GDPR endpoints
  getUserData: () => apiClient<{ data: Record<string, unknown> }>("/me/data"),
  exportUserData: () => apiClient<{ export: Record<string, unknown> }>("/me/export"),
  deleteAccount: () => apiClient<{ message: string }>("/me", { method: "DELETE" }),
  updateProfile: (data: Record<string, unknown>) =>
    apiClient<{ message: string }>("/me", { method: "PATCH", body: data }),

  // Consent
  getConsents: () => apiClient<Record<string, boolean>>("/consent"),
  grantConsent: (purpose: string) =>
    apiClient<{ message: string }>("/consent", { method: "POST", body: { purpose } }),
  revokeConsent: (purpose: string) =>
    apiClient<{ message: string }>(`/consent/${purpose}`, { method: "DELETE" }),

  // Products
  getProduct: (barcode: string) => apiClient<{ product: unknown }>(`/products/${barcode}`),
  searchProducts: (query: string, page = 1) =>
    apiClient<{ results: unknown[] }>(`/products?q=${encodeURIComponent(query)}&page=${page}`),
};
