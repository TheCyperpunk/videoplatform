"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";

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

interface LiveVideoCardProps {
    video: Video;
    className?: string;
}

export function LiveVideoCard({ video, className }: LiveVideoCardProps) {
    const durationStr = video.duration || null;
    const quality = video.quality || "HD";
    
    // Use the video's original thumbnail initially, or fallback if it's totally missing
    const [imgSrc, setImgSrc] = useState<string>(video.thumbnail || getFallback(video));

    return (
        <a
            href={video.source_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("block no-underline group", className)}
            aria-label={`Watch ${video.title}`}
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-[#111] mb-2 rounded-xl overflow-hidden">
                <Image
                    src={imgSrc}
                    alt={video.title || "Video thumbnail"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                    onError={() => {
                        const fallback = getFallback(video);
                        if (imgSrc !== fallback) {
                            setImgSrc(fallback);
                        }
                    }}
                />

                {/* Quality + Duration badges */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <Badge
                        variant="secondary"
                        className="bg-black/80 text-white text-[10px] font-extrabold italic tracking-widest px-1.5 py-0 rounded border-0 hover:bg-black/80"
                    >
                        {quality}
                    </Badge>
                    {durationStr && durationStr !== "0:00" && (
                        <Badge
                            variant="secondary"
                            className="bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0 rounded border-0 hover:bg-black/80"
                        >
                            {durationStr}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-white text-base font-medium m-0 p-0 truncate leading-snug">
                {video.title}
            </h3>
        </a>
    );
}
