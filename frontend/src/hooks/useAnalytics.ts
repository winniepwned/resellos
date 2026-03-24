import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import type { AnalyticsOverview, InventoryHealth } from "@/types";

export function useAnalyticsOverview() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => apiClient<AnalyticsOverview>("/analytics/overview"),
    enabled: isAuthenticated,
  });
}

export function useInventoryHealth() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["analytics", "inventory"],
    queryFn: () => apiClient<InventoryHealth>("/analytics/inventory"),
    enabled: isAuthenticated,
  });
}

export function useBrandPerformance() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["analytics", "brands"],
    queryFn: () => apiClient<{ brands: unknown[] }>("/analytics/brands"),
    enabled: isAuthenticated,
  });
}

export function useSellThroughRate() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["analytics", "sell-through"],
    queryFn: () => apiClient<{ rate_percent: number; items_sold: number; items_listed: number }>("/analytics/sell-through"),
    enabled: isAuthenticated,
  });
}

export function useDeadStock() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["analytics", "dead-stock"],
    queryFn: () =>
      apiClient<{ items: unknown[]; total_capital_locked: number }>(
        "/analytics/dead-stock"
      ),
    enabled: isAuthenticated,
  });
}
