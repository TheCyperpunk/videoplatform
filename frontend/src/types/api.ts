export interface ApiResponse<T> {
    data: T;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    error: string | null;
}

export interface PaginatedResponse<T> {
    data: T;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    error: string | null;
}

export interface SearchResult {
    results: import("./video").Video[];
    total: number;
    query: string;
}

export interface ErrorResponse {
    error: string;
    status: number;
}
