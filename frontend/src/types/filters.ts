export type SortOption = "views" | "date" | "likes" | "duration";
export type QualityFilter = "all" | "720p" | "1080p" | "4K";
export type ViewMode = "grid" | "list";

export interface FilterState {
    category: string;
    sort: SortOption;
    quality: QualityFilter;
    viewMode: ViewMode;
    searchQuery: string;
}
