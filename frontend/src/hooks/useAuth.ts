import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const loading = useAuthStore((s) => s.loading);

  return {
    session,
    loading,
    isAuthenticated: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  };
}
