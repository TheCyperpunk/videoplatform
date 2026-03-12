import type { Video } from "@/types/video";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface VideosResponse {
    data: Video[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    error: string | null;
}

export interface VideoDetailResponse {
    data: {
        video: Video;
        related: Video[];
    } | null;
    error: string | null;
}

export interface SearchResponse {
    data: Video[];
    total: number;
    query: string;
    error: string | null;
}

export interface TrendingResponse {
    data: Video[];
    total: number;
    error: string | null;
}

// ── Fetch paginated videos ──────────────────────────────────────────────
export async function fetchVideos(params?: {
    page?: number;
    limit?: number;
    category?: string;
    sort?: string;
    quality?: string;
}): Promise<VideosResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.quality) query.set("quality", params.quality);

    const res = await fetch(`${BASE_URL}/api/videos?${query.toString()}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch videos: ${res.statusText}`);
    return res.json();
}

// ── Fetch single video + related ────────────────────────────────────────
export async function fetchVideoById(id: string): Promise<VideoDetailResponse> {
    const res = await fetch(`${BASE_URL}/api/videos/${id}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch video ${id}: ${res.statusText}`);
    return res.json();
}

// ── Fetch trending videos ───────────────────────────────────────────────
export async function fetchTrending(): Promise<TrendingResponse> {
    const res = await fetch(`${BASE_URL}/api/videos/trending`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch trending: ${res.statusText}`);
    return res.json();
}

// ── Search videos ───────────────────────────────────────────────────────
export async function searchVideos(
    q: string,
    category?: string,
    sort?: string
): Promise<SearchResponse> {
    const query = new URLSearchParams({ search: q });
    if (category && category !== "all") query.set("category", category);
    if (sort) query.set("sort", sort);

    const res = await fetch(`${BASE_URL}/api/search?${query.toString()}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);
    return res.json();
}

// ── Adult Series types ──────────────────────────────────────────────────
export interface WebSeries {
    _id: string;
    title: string;
    series_slug: string;
    redirect_url: string;
    platform: string;
    source_site: string;
    description: string | null;
    video_count: number;
    episodes: Record<string, { title: string; duration_seconds?: number; uploaded_ago?: string }>;
    released_at: string | null;
    scraped_at: string;
    status: string;
}

export interface AdultSeriesResponse {
    data: WebSeries[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    error: string | null;
}

// ── Fetch adult series ──────────────────────────────────────────────────
export async function fetchAdultSeries(params?: {
    page?: number;
    limit?: number;
    platform?: string;
    search?: string;
}): Promise<AdultSeriesResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.platform) query.set("platform", params.platform);
    if (params?.search) query.set("search", params.search);

    const res = await fetch(`${BASE_URL}/api/uncutmaza.webseries?${query.toString()}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch adult series: ${res.statusText}`);
    return res.json();
}
