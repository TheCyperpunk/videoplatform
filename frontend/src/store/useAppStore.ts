"use client";

import { create } from "zustand";
import type { FilterState } from "@/types/filters";

interface AppState extends FilterState {
    sidebarOpen: boolean;
    setCategory: (category: string) => void;
    setSearchQuery: (query: string) => void;
    setSort: (sort: FilterState["sort"]) => void;
    setQuality: (quality: FilterState["quality"]) => void;
    setViewMode: (viewMode: FilterState["viewMode"]) => void;
    toggleSidebar: () => void;
    resetFilters: () => void;
}

const defaultFilters: FilterState = {
    category: "all",
    sort: "date",
    quality: "all",
    viewMode: "grid",
    searchQuery: "",
};

export const useAppStore = create<AppState>((set) => ({
    ...defaultFilters,
    sidebarOpen: false,
    setCategory: (category) => set({ category }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSort: (sort) => set({ sort }),
    setQuality: (quality) => set({ quality }),
    setViewMode: (viewMode) => set({ viewMode }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    resetFilters: () => set(defaultFilters),
}));
