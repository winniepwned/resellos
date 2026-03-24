import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock supabase before importing the store
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({}),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

import { useAuthStore } from "@/stores/auth.store";

describe("auth.store", () => {
  beforeEach(() => {
    useAuthStore.setState({ session: null, loading: true });
  });

  it("has no session in initial state", () => {
    const state = useAuthStore.getState();
    expect(state.session).toBeNull();
  });

  it("signOut clears session", async () => {
    // Simulate a logged-in session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useAuthStore.setState({ session: { user: { id: "123" } } as any, loading: false });
    expect(useAuthStore.getState().session).not.toBeNull();

    await useAuthStore.getState().signOut();

    expect(useAuthStore.getState().session).toBeNull();
  });
});
