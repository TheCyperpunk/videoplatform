import Image from "next/image";
import { BadgeCheck, Play } from "lucide-react";
import type { Video } from "@/types/video";
import { formatViewsShort, timeAgo, truncate } from "@/lib/utils";

function getThumbnail(video: Video): string {
    if (video.thumbnail) return video.thumbnail;
    let seed = 0;
    const str = video.title || "video";
    for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
    return `https://picsum.photos/seed/${seed % 1000}/144/81`;
}

interface VideoCardHorizontalProps {
    video: Video;
    className?: string;
}

export function VideoCardHorizontal({ video, className }: VideoCardHorizontalProps) {
    return (
        <a
            href={video.source_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex gap-3 p-2 rounded-xl no-underline hover:bg-[#1A1A1A] transition-colors group ${className ?? ""}`}
        >
            {/* Thumbnail */}
            <div className="relative shrink-0 w-36 h-20 rounded-lg overflow-hidden bg-[#111]">
                <Image
                    src={getThumbnail(video)}
                    alt={video.title || "Video thumbnail"}
                    fill
                    sizes="144px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={18} color="white" fill="white" />
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
                    {video.duration}
                </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center min-w-0">
                <h4 className="text-sm font-semibold text-[#F5F5F5] mb-1 leading-snug line-clamp-2 m-0">
                    {truncate(video.title, 60)}
                </h4>
                <div className="flex items-center gap-1 text-xs text-[#888]">
                    <span>{video.channel.name}</span>
                    {video.channel.verified && (
                        <BadgeCheck size={11} color="#FF3B3B" />
                    )}
                </div>
                <p className="text-xs text-[#555] mt-0.5 m-0">
                    {formatViewsShort(video.views)} · {timeAgo(video.publishedAt)}
                </p>
            </div>
        </a>
    );
}
