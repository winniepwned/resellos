import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/endpoints";

export function useUserData() {
  return useQuery({
    queryKey: ["userData"],
    queryFn: api.getUserData,
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: api.exportUserData,
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useSearchProducts(query: string, page = 1) {
  return useQuery({
    queryKey: ["products", query, page],
    queryFn: () => api.searchProducts(query, page),
    enabled: query.length > 0,
  });
}
