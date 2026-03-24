import { create } from "zustand";

interface ItemsState {
  viewMode: "grid" | "table";
  statusFilter: string | null;
  brandFilter: string | null;
  searchQuery: string;
  setViewMode: (mode: "grid" | "table") => void;
  setStatusFilter: (status: string | null) => void;
  setBrandFilter: (brand: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useItemsStore = create<ItemsState>((set) => ({
  viewMode: "table",
  statusFilter: null,
  brandFilter: null,
  searchQuery: "",

  setViewMode: (mode) => set({ viewMode: mode }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setBrandFilter: (brand) => set({ brandFilter: brand }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  resetFilters: () =>
    set({ statusFilter: null, brandFilter: null, searchQuery: "" }),
}));
