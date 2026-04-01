import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initialize: () => void;
}

const getSystemTheme = (): Theme => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (localStorage.getItem("resellos_theme") as Theme) || getSystemTheme(),

  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("resellos_theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = current === "dark" ? "light" : "dark";
    get().setTheme(next);
  },

  initialize: () => {
    const theme = get().theme;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  },
}));
