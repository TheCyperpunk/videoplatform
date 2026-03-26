"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";
import { formatViewsShort, timeAgo, truncate } from "@/lib/utils";

const FALLBACK_THUMBNAILS = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe1ZhO9p87ST2NHlrKc8J9Opng6scFoz4IkHv9bTfq&s",
    "https://i.ibb.co/NdLg2LrB/Divya%20Mitra%20Naked%20Boobs%20Shoot%20Of%20Premium%20Porn%20Video%2022.jpg",
    "https://m3.imgdf.shop/mm/Tania.Nude.Shower.Frontal.Boobs.Pussy.Ass_Show.jpg",
    "https://i.ibb.co/T8DzJtB/Hawas%20an%20Anam%20Khan%20Porn%20Video%202.jpg",
    "https://imggen.eporner.com/14096844/1920/1080/5.jpg",
    "https://imggen.eporner.com/14978187/1920/1080/11.jpg",
    "https://masafun.io.in/wp-content/uploads/2026/03/Mallu-Reshma-Rechu-First-Ever.jpg",
    "https://area51.porn/contents/videos_screenshots/90000/90633/preview.jpg"
];

function getFallback(video: Video): string {
    let seed = 0;
    const str = video.id || video.title || "video";
    for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
    return FALLBACK_THUMBNAILS[seed % FALLBACK_THUMBNAILS.length];
}

interface VideoCardHorizontalProps {
    video: Video;
    className?: string;
}

export function VideoCardHorizontal({ video, className }: VideoCardHorizontalProps) {
    const [imgSrc, setImgSrc] = useState<string>(video.thumbnail || getFallback(video));

    return (
        <a
            href={video.source_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "flex gap-3 p-2 rounded-xl no-underline hover:bg-[#1A1A1A] transition-colors group",
                className
            )}
        >
            {/* Thumbnail */}
            <div className="relative shrink-0 w-36 h-20 rounded-lg overflow-hidden bg-[#111]">
                <Image
                    src={imgSrc}
                    alt={video.title || "Video thumbnail"}
                    fill
                    sizes="144px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => {
                        const fallback = getFallback(video);
                        if (imgSrc !== fallback) {
                            setImgSrc(fallback);
                        }
                    }}
                />
                
                {/* Duration badge */}
                {video.duration && (
                    <Badge
                        variant="secondary"
                        className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-semibold px-1 py-0 rounded border-0 hover:bg-black/80"
                    >
                        {video.duration}
                    </Badge>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center min-w-0">
                <h4 className="text-sm font-semibold text-[#F5F5F5] mb-1 leading-snug line-clamp-2 m-0">
                    {truncate(video.title, 60)}
                </h4>
                <div className="flex items-center gap-1 text-xs text-[#888]">
                    <span>{video.channel.name}</span>
                    {video.channel.verified && (
                        <BadgeCheck className="w-3 h-3 text-[#FF3B3B]" />
                    )}
                </div>
                <p className="text-xs text-[#555] mt-0.5 m-0">
                    {formatViewsShort(video.views)} · {timeAgo(video.publishedAt)}
                </p>
            </div>
        </a>
    );
}
