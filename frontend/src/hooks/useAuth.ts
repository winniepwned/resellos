import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const { session, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    session,
    loading,
    isAuthenticated: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  };
}
