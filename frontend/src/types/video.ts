export interface Channel {
    name: string;
    avatar: string;
    subscribers: number;
    verified: boolean;
}

export interface Video {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: number;
    likes: number;
    publishedAt: string;
    channel: Channel;
    category: string;
    tags: string[];
    description: string;
    quality: "720p" | "1080p" | "4K";
    trending_rank: number | null;
    source_url: string;
    scraped_at: string;
    source?: string; // Optional field to track video source (local, redtube, apijav, etc.)
}

export interface WatchPageData {
    video: Video;
    related: Video[];
}

export interface RelatedVideo extends Video { }

export interface VideoCardProps {
    video: Video;
    showRank?: boolean;
    rank?: number;
    className?: string;
}
