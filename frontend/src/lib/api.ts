import type { Video } from "@/types/video";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

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
    page: number;
    limit: number;
    hasMore: boolean;
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
    quality?: string;
    sort?: string;
}): Promise<VideosResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.category) query.set("category", params.category);
    if (params?.quality) query.set("quality", params.quality);
    if (params?.sort) query.set("sort", params.sort);

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

// ── Fetch new videos ─────────────────────────────────────────────────────
export async function fetchNewVideos(params?: {
    page?: number;
    limit?: number;
}): Promise<VideosResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const res = await fetch(`${BASE_URL}/api/videos/new?${query.toString()}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch new videos: ${res.statusText}`);
    return res.json();
}

// ── Fetch popular videos ─────────────────────────────────────────────────
export async function fetchPopularVideos(params?: {
    page?: number;
    limit?: number;
}): Promise<VideosResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const url = `${BASE_URL}/api/videos/popular?${query.toString()}`;
    console.log("Fetching popular videos from:", url);
    
    const res = await fetch(url, {
        cache: "no-store",
    });
    
    if (!res.ok) throw new Error(`Failed to fetch popular videos: ${res.statusText}`);
    
    const data = await res.json();
    console.log("Popular videos response:", data);
    
    return data;
}

// ── Fetch top rated videos ───────────────────────────────────────────────
export async function fetchTopRatedVideos(params?: {
    page?: number;
    limit?: number;
}): Promise<VideosResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));

    const url = `${BASE_URL}/api/videos/top-rated?${query.toString()}`;
    console.log("Fetching top rated videos from:", url);
    
    const res = await fetch(url, {
        cache: "no-store",
    });
    
    if (!res.ok) throw new Error(`Failed to fetch top rated videos: ${res.statusText}`);
    
    const data = await res.json();
    console.log("Top rated videos response:", data);
    
    return data;
}

// ── Search videos ───────────────────────────────────────────────────────
export async function searchVideos(
    q: string,
    category?: string,
    sort?: string,
    page?: number,
    limit?: number
): Promise<SearchResponse> {
    const query = new URLSearchParams({ q });
    if (category && category !== "all") query.set("category", category);
    if (sort) query.set("sort", sort);
    if (page)  query.set("page",  String(page));
    if (limit) query.set("limit", String(limit));

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

// ── Fetch distinct categories ────────────────────────────────────────────────
export interface CategoryItem {
    value: string;
    count: number;
}

export async function fetchCategories(): Promise<{ data: CategoryItem[]; error: string | null }> {
    const res = await fetch(`${BASE_URL}/api/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
    return res.json();
}

// ── Fetch adult category (jav / hentai) from external APIs + local DB ────────
// Sources used for jav: redtube, apijav, eporner, faphouse
// Sources used for hentai: hentaiocean, haniapi
export async function fetchAdultCategory(
    category: "jav" | "hentai",
    page: number = 1,
    limit: number = 120
): Promise<{ data: Video[]; total: number; error: string | null }> {
    const isJav     = category === "jav";
    const keyword   = isJav ? "jav" : "hentai";
    const sources   = isJav
        ? ["redtube", "apijav", "eporner", "faphouse"]
        : ["hentaiocean", "haniapi"];

    try {
        // Run local DB fetch + external API search in parallel
        const [localRes, extRes] = await Promise.allSettled([
            // Local DB — try to find videos tagged as this category
            fetch(
                `${BASE_URL}/api/videos?category=${category}&page=${page}&limit=${limit}`,
                { cache: "no-store" }
            ).then((r) => (r.ok ? r.json() : { data: [], total: 0 })),
            // External APIs — fetch from category endpoint for maximum results
            fetch(
                `${BASE_URL}/api/external/category/${category}?page=${page}`,
                { cache: "no-store" }
            ).then((r) => (r.ok ? r.json() : { data: {}, totalCount: 0 })),
        ]);

        const localVideos: Video[] =
            localRes.status === "fulfilled" ? localRes.value.data ?? [] : [];
        const localTotal: number =
            localRes.status === "fulfilled" ? localRes.value.total ?? 0 : 0;

        let externalVideos: Video[] = [];
        let externalTotal = 0;

        if (extRes.status === "fulfilled") {
            const extData = extRes.value?.data ?? {};
            externalTotal = extRes.value?.totalCount ?? 0;

            for (const [source, videos] of Object.entries(extData)) {
                if (!Array.isArray(videos)) continue;
                for (const v of videos) {
                    const vid = v as any;
                    externalVideos.push({
                        id: `${source}_${vid.id}_${Date.now()}_${Math.random()}`,
                        title: vid.title ?? "Untitled",
                        thumbnail:
                            vid.thumbnail ??
                            `https://via.placeholder.com/640x360/1a1a1a/666666?text=${source.toUpperCase()}`,
                        duration: vid.duration ?? "0:00",
                        views: vid.views ?? 0,
                        likes: 0,
                        publishedAt: new Date().toISOString(),
                        channel: {
                            name:
                                source === "apijav"    ? "APIJAV"       :
                                source === "eporner"   ? "Eporner"      :
                                source === "faphouse"  ? "FapHouse"     :
                                source === "redtube"   ? "RedTube"      :
                                source === "hentaiocean" ? "HentaiOcean" :
                                source === "haniapi"   ? "HaniAPI"      :
                                source.toUpperCase(),
                            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${source}`,
                            subscribers: 0,
                            verified: true,
                        },
                        category,
                        tags: [category],
                        description: `External video from ${source.toUpperCase()}`,
                        quality: "720p",
                        trending_rank: null,
                        source_url: vid.url ?? vid.embedUrl ?? "#",
                        scraped_at: new Date().toISOString(),
                        source,
                    });
                }
            }
        }

        // Merge local first, then external; shuffle the external slice
        const merged = [...localVideos, ...shuffleArray(externalVideos)];

        return {
            data: merged,
            total: localTotal + externalTotal,
            error: null,
        };
    } catch (err) {
        return { data: [], total: 0, error: String(err) };
    }
}

// ── External APIs Integration ────────────────────────────────────────────────
export interface ExternalSearchResponse {
    success: boolean;
    data: {
        redtube: any[];
        apijav: any[];
        eporner: any[];
        faphouse: any[];
        haniapi: any[];
        hentaiocean: any[];
    };
    totalCount: number;
    query: string;
    page: number;
    sources: string[];
}

export interface CombinedSearchResponse {
    localVideos: Video[];
    externalVideos: Video[]; // Transform external videos to Video interface
    localTotal: number;
    externalTotal: number;
    totalCount: number;
    query: string;
    page: number;
    error: string | null;
}

// Transform external API video to match our Video interface
function transformExternalToVideo(externalVideo: any, source: string): Video {
    // Create a more unique ID to avoid duplicates across API calls
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const sourceId = `${source}_${externalVideo.id}_${timestamp}_${random}`;
    
    // Create a mock channel based on source
    const channel = {
        name: source === 'redtube' ? 'RedTube' :
              source === 'apijav' ? 'APIJAV' :
              source === 'eporner' ? 'Eporner' :
              source === 'faphouse' ? 'FapHouse' :
              source === 'haniapi' ? 'HaniAPI' :
              source === 'hentaiocean' ? 'Hentai Ocean' : source.toUpperCase(),
        avatar: `https://via.placeholder.com/40x40/666666/ffffff?text=${source.charAt(0).toUpperCase()}`,
        subscribers: Math.floor(Math.random() * 1000000) + 10000,
        verified: true
    };

    // Transform to Video interface
    return {
        id: sourceId,
        title: externalVideo.title, // Clean title without source prefix
        thumbnail: externalVideo.thumbnail || `https://via.placeholder.com/640x360/1a1a1a/666666?text=${source.toUpperCase()}`,
        duration: externalVideo.duration || '0:00',
        views: externalVideo.views || Math.floor(Math.random() * 100000) + 1000,
        likes: Math.floor(Math.random() * 10000) + 100,
        publishedAt: new Date().toISOString(),
        channel,
        category: externalVideo.category || externalVideo.studio || 'External',
        tags: externalVideo.tags || [],
        description: `External video from ${source.toUpperCase()}. ${externalVideo.title}`,
        quality: externalVideo.quality === '4K' ? '4K' : 
                externalVideo.quality === 'HD' ? '1080p' : '720p',
        trending_rank: null,
        source_url: externalVideo.url || externalVideo.embedUrl || '#',
        scraped_at: new Date().toISOString(),
        source: source // Add source tracking for shuffle verification
    };
}

// ── Search external APIs ────────────────────────────────────────────────────
export async function searchExternalAPIs(
    query: string,
    page: number = 1,
    sources: string[] = ['redtube', 'apijav', 'eporner', 'faphouse', 'haniapi', 'hentaiocean']
): Promise<ExternalSearchResponse> {
    const sourcesParam = sources.join(',');
    const res = await fetch(
        `${BASE_URL}/api/external/search?query=${encodeURIComponent(query)}&page=${page}&sources=${sourcesParam}`,
        { cache: "no-store" }
    );
    
    if (!res.ok) {
        throw new Error(`External API search failed: ${res.statusText}`);
    }
    
    return res.json();
}

// ── Combined search (local DB + external APIs) ──────────────────────────────
export // Utility function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export async function searchCombined(
    query: string,
    category?: string,
    sort?: string,
    page: number = 1,
    limit: number = 120
): Promise<CombinedSearchResponse> {
    try {
        // Add timeout to external API calls (15 seconds max - increased from 5s)
        const externalPromise = Promise.race([
            searchExternalAPIs(query, 1),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('External API timeout')), 15000)
            )
        ]);

        // Search both local and external APIs in parallel
        const [localResponse, externalResponse] = await Promise.allSettled([
            searchVideos(query, category, sort, page, limit),
            externalPromise
        ]);

        const localVideos = localResponse.status === 'fulfilled' ? localResponse.value.data : [];
        const localTotal = localResponse.status === 'fulfilled' ? localResponse.value.total : 0;
        
        let externalVideos: Video[] = [];
        let externalTotal = 0;
        let externalError = '';
        
        if (externalResponse.status === 'fulfilled') {
            try {
                const extData = (externalResponse.value as ExternalSearchResponse).data;
                
                // Transform all external videos to Video interface
                const transformedVideos: Video[] = [];
                
                // Transform RedTube videos
                extData.redtube?.forEach((video: any) => {
                    transformedVideos.push(transformExternalToVideo(video, 'redtube'));
                });
                
                // Transform APIJAV videos
                extData.apijav?.forEach((video: any) => {
                    transformedVideos.push(transformExternalToVideo(video, 'apijav'));
                });
                
                // Transform Eporner videos
                extData.eporner?.forEach((video: any) => {
                    transformedVideos.push(transformExternalToVideo(video, 'eporner'));
                });
                
                // Transform FapHouse videos
                extData.faphouse?.forEach((video: any) => {
                    transformedVideos.push(transformExternalToVideo(video, 'faphouse'));
                });
                
                // Transform HaniAPI videos
                extData.haniapi?.forEach((video: any) => {
                    transformedVideos.push(transformExternalToVideo(video, 'haniapi'));
                });
                
                // Transform Hentai Ocean videos
                extData.hentaiocean?.forEach((video: any) => {
                    transformedVideos.push(transformExternalToVideo(video, 'hentaiocean'));
                });
                
                externalVideos = transformedVideos;
                externalTotal = (externalResponse.value as ExternalSearchResponse).totalCount;
                
                console.log(`✅ External search: ${externalVideos.length} videos found`);
            } catch (transformError) {
                console.error('Error transforming external videos:', transformError);
                externalError = 'Error processing external results';
            }
        } else if (externalResponse.status === 'rejected') {
            console.warn('⚠️ External API failed:', externalResponse.reason);
            externalError = `External APIs unavailable: ${externalResponse.reason?.message || 'Unknown error'}`;
        }

        // Combine and shuffle all videos together for a mixed feed
        const allVideos = [...localVideos, ...externalVideos];
        console.log(`📊 Search results: Local=${localVideos.length}, External=${externalVideos.length}, Total=${allVideos.length}`);
        
        const shuffledVideos = shuffleArray(allVideos);

        return {
            localVideos: shuffledVideos, // Return shuffled combined results in localVideos
            externalVideos: [], // Empty since we combined everything
            localTotal: localTotal + externalTotal, // Combined total
            externalTotal: 0,
            totalCount: localTotal + externalTotal,
            query,
            page,
            error: externalError || null
        };
    } catch (error) {
        console.error('❌ Combined search error:', error);
        
        // Fallback to local search only
        try {
            const localResponse = await searchVideos(query, category, sort, page, limit);
            return {
                localVideos: localResponse.data,
                externalVideos: [],
                localTotal: localResponse.total,
                externalTotal: 0,
                totalCount: localResponse.total,
                query,
                page,
                error: 'External APIs unavailable, showing local results only'
            };
        } catch (localError) {
            return {
                localVideos: [],
                externalVideos: [],
                localTotal: 0,
                externalTotal: 0,
                totalCount: 0,
                query,
                page,
                error: 'Search failed'
            };
        }
    }
}
