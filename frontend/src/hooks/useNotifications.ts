import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import type { Notification } from "@/types";

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      apiClient<{ notifications: Notification[]; unread_count: number }>(
        "/notifications"
      ),
    refetchInterval: 30000,
    enabled: isAuthenticated,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<void>(`/notifications/${id}/read`, { method: "PATCH" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
