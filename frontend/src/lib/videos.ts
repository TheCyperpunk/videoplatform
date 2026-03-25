import type { Video } from "@/types/video";
import type { Category } from "@/types/category";
import type { QualityFilter } from "@/types/filters";
import videosData from "@/data/videos.json";
import categoriesData from "@/data/categories.json";
import { parseDuration } from "./utils";

const videos = videosData as Video[];
const categories = categoriesData as Category[];

export function getAllVideos(): Video[] {
    return videos;
}

export function getVideoById(id: string): Video | null {
    return videos.find((v) => v.id === id) ?? null;
}

export function getRelatedVideos(video: Video, limit = 10): Video[] {
    return videos
        .filter((v) => v.id !== video.id)
        .sort((a, b) => {
            const sameCategory = Number(b.category === video.category) - Number(a.category === video.category);
            if (sameCategory !== 0) return sameCategory;
            return b.views - a.views;
        })
        .slice(0, limit);
}

export function getTrendingVideos(): Video[] {
    return videos
        .filter((v) => v.trending_rank !== null)
        .sort((a, b) => (a.trending_rank ?? 99) - (b.trending_rank ?? 99));
}

export function getPaginatedVideos(
    page: number = 1,
    limit: number = 12,
    category?: string,
    sort: SortOption = "date",
    quality: QualityFilter = "all"
): { data: Video[]; total: number; hasMore: boolean } {
    let filtered = [...videos];

    if (category && category !== "all") {
        filtered = filtered.filter((v) => v.category === category);
    }
    if (quality && quality !== "all") {
        filtered = filtered.filter((v) => v.quality === quality);
    }

    filtered.sort((a, b) => {
        switch (sort) {
            case "views": return b.views - a.views;
            case "likes": return b.likes - a.likes;
            case "duration": return parseDuration(b.duration) - parseDuration(a.duration);
            case "date":
            default:
                return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
    });

    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);
    return { data, total, hasMore: start + limit < total };
}

export function searchVideos(
    query: string,
    category?: string,
    sort: SortOption = "date"
): Video[] {
    const q = query.toLowerCase();
    let results = videos.filter((v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)) ||
        v.channel.name.toLowerCase().includes(q)
    );

    if (category && category !== "all") {
        results = results.filter((v) => v.category === category);
    }

    results.sort((a, b) => {
        switch (sort) {
            case "views": return b.views - a.views;
            case "likes": return b.likes - a.likes;
            default:
                return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        }
    });

    return results;
}

export function getVideosByCategory(categoryId: string, limit?: number): Video[] {
    const filtered = videos.filter((v) => v.category === categoryId);
    return limit ? filtered.slice(0, limit) : filtered;
}

export function getAllCategories(): Category[] {
    return categories;
}
