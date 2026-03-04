import type { Video } from "@/types/video";
import { LiveVideoCard } from "./LiveVideoCard";

interface LiveVideoGridProps {
    videos: Video[];
    className?: string;
}

export function LiveVideoGrid({ videos, className }: LiveVideoGridProps) {
    return (
        <>
            <style>{`
                .live-video-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px 8px;
                }
                .live-video-grid > * {
                    box-sizing: border-box;
                    min-width: 0;
                    font-size: 12px;
                }
                @media (min-width: 640px) {
                    .live-video-grid {
                        grid-template-columns: repeat(6, 1fr);
                        gap: 20px 16px;
                    }
                    .live-video-grid > * {
                        font-size: 14px;
                    }
                }
            `}</style>
            <div className={`live-video-grid${className ? ` ${className}` : ""}`}>
                {videos.map((video) => (
                    <LiveVideoCard key={video.id} video={video} />
                ))}
            </div>
        </>
    );
}
