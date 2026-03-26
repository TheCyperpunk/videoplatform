import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";
import { LiveVideoCard } from "./LiveVideoCard";

interface LiveVideoGridProps {
    videos: Video[];
    className?: string;
}

export function LiveVideoGrid({ videos, className }: LiveVideoGridProps) {
    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-6 gap-1.5 sm:gap-x-2.5 sm:gap-y-3", className)}>
            {videos.map((video, index) => (
                <LiveVideoCard key={video.id || (video as any)._id || index} video={video} />
            ))}
        </div>
    );
}
