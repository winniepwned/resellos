import { create } from "zustand";
import { Session } from "@supabase/supabase-js";
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

  setSession: (session) => set({ session }),

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ session: data.session });
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    set({ session: data.session });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },

  initialize: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },
}));
