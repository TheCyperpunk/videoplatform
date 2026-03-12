import Image from "next/image";
import type { Video } from "@/types/video";

function getThumbnail(video: Video): string {
    if (video.thumbnail) return video.thumbnail;
    let seed = 0;
    const str = video.title || "video";
    for (let i = 0; i < str.length; i++) seed += str.charCodeAt(i);
    return `https://picsum.photos/seed/${seed % 1000}/400/225`;
}

interface LiveVideoCardProps {
    video: Video;
    className?: string;
}

export function LiveVideoCard({ video, className }: LiveVideoCardProps) {
    const durationStr = video.duration || null;

    return (
        <a
            href={video.source_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`block no-underline group ${className ?? ""}`}
            aria-label={`Watch ${video.title}`}
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-[#111] mb-2 rounded-xl overflow-hidden">
                <Image
                    src={getThumbnail(video)}
                    alt={video.title || "Video thumbnail"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                />

                {/* HD + Duration badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/80 px-1.5 py-0.5 rounded text-white text-[11px] font-semibold">
                    <span className="font-extrabold italic tracking-widest">HD</span>
                    {durationStr && durationStr !== "0:00" && <span>{durationStr}</span>}
                </div>
            </div>

            {/* Title */}
            <h3 className="text-white text-base font-medium m-0 p-0 truncate leading-snug">
                {video.title}
            </h3>
        </a>
    );
}
