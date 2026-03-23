import { create } from "zustand";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
}

interface UserState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
