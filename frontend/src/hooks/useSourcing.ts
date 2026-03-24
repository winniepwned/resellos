import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { SourcingResult } from "@/types";

export function useStartSourcing() {
  return useMutation({
    mutationFn: (data: { keyword: string; image_url?: string }) =>
      apiClient<{ task_id: string; status: string }>("/sourcing/analyze", {
        method: "POST",
        body: data,
      }),
  });
}

export function useSourcingStatus(taskId: string | null) {
  return useQuery({
    queryKey: ["sourcing", taskId, "status"],
    queryFn: () =>
      apiClient<{ task_id: string; status: string; pipeline_steps: unknown }>(
        `/sourcing/${taskId}/status`
      ),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "completed" || status === "failed") return false;
      return 2000;
    },
  });
}

export function useSourcingResult(taskId: string | null) {
  return useQuery({
    queryKey: ["sourcing", taskId, "result"],
    queryFn: () => apiClient<SourcingResult>(`/sourcing/${taskId}/result`),
    enabled: !!taskId,
  });
}
