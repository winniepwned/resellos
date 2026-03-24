import { useAuthStore } from "@/stores/auth.store";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
