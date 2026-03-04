import type { SortOption, QualityFilter } from "@/types/filters";

export const NAV_ITEMS = [
    { label: "Home", icon: "Home", path: "/" },
    { label: "Browse", icon: "Grid3X3", path: "/browse" },
    { label: "Trending", icon: "TrendingUp", path: "/trending" },
    { label: "Search", icon: "Search", path: "/search" },
    { label: "Profile", icon: "User", path: "/profile" },
];

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: "Most Viewed", value: "views" },
    { label: "Newest", value: "date" },
    { label: "Most Liked", value: "likes" },
    { label: "Duration", value: "duration" },
];

export const QUALITY_OPTIONS: { label: string; value: QualityFilter }[] = [
    { label: "All", value: "all" },
    { label: "720p", value: "720p" },
    { label: "1080p", value: "1080p" },
    { label: "4K", value: "4K" },
];

export const CATEGORY_COLORS: Record<string, string> = {
    technology: "#00D4FF",
    travel: "#00C49A",
    food: "#FF7A00",
    music: "#A855F7",
    fitness: "#EF4444",
    science: "#3B82F6",
    business: "#F59E0B",
    lifestyle: "#22C55E",
    history: "#D97706",
    gaming: "#8B5CF6",
    art: "#EC4899",
    sports: "#F97316",
    all: "#FF3B3B",
};

export const DEFAULT_PAGINATION = {
    page: 1,
    limit: 12,
};
