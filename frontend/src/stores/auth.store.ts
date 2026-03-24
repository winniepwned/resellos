import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session, loading: false }),

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, loading: false });
    });
  },
}));
