import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import type { Item, ItemListResponse } from "@/types";

export function useItems(status?: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["items", status],
    queryFn: () =>
      apiClient<ItemListResponse>(
        `/items${status ? `?status=${status}` : ""}`
      ),
    enabled: isAuthenticated,
  });
}

export function useItem(id: string) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["items", id],
    queryFn: () => apiClient<Item>(`/items/${id}`),
    enabled: !!id && isAuthenticated,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient<Item>("/items", { method: "POST", body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Record<string, unknown>) =>
      apiClient<Item>(`/items/${id}`, { method: "PATCH", body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<void>(`/items/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
}

export function useMarkSold() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      sold_price,
    }: {
      id: string;
      sold_price: number;
    }) =>
      apiClient<Item>(`/items/${id}/mark-sold`, {
        method: "POST",
        body: { sold_price },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
}

export function useMarkListed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, platform }: { id: string; platform: string }) =>
      apiClient<Item>(`/items/${id}/mark-listed`, {
        method: "POST",
        body: { platform },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["items"] }),
  });
}
