import { cn } from "@/lib/utils";
import type { Video } from "@/types/video";
import { LiveVideoCard } from "./LiveVideoCard";
import { SquareAdsRow300_D1, SquareAdsRow315_D2, SquareAdsRow300_M1, SquareAdsRow300_M2, SquareAdsRow315_M3, SquareAdsRow315_M4 } from "@/components/ads/SquareAdsRow";

interface LiveVideoGridProps {
    videos: Video[];
    className?: string;
}

export function LiveVideoGrid({ videos, className }: LiveVideoGridProps) {
    const renderVideoWithAds = (): React.ReactNode[] => {
        const items: React.ReactNode[] = [];
        
        videos.forEach((video, index) => {
            // Add video card
            items.push(
                <LiveVideoCard key={video.id || (video as any)._id || index} video={video} />
            );
            
            // Desktop ad placement (6-column grid)
            // After Row 4 (24 videos: 4 rows × 6 columns)
            if (index + 1 === 24) {
                items.push(
                    <div key={`desktop-ad-1-${index}`} className="hidden sm:block col-span-6">
                        <SquareAdsRow300_D1 />
                    </div>
                );
            }
            // After Row 12 (72 videos: 12 rows × 6 columns)
            else if (index + 1 === 72) {
                items.push(
                    <div key={`desktop-ad-2-${index}`} className="hidden sm:block col-span-6">
                        <SquareAdsRow315_D2 />
                    </div>
                );
            }
            
            // Mobile ad placement (2-column grid)
            // After Row 6 (12 videos: 6 rows × 2 columns)
            if (index + 1 === 12) {
                items.push(
                    <div key={`mobile-ad-1-${index}`} className="sm:hidden col-span-2">
                        <SquareAdsRow300_M1 />
                    </div>
                );
            }
            // After Row 16 (32 videos: 16 rows × 2 columns)
            else if (index + 1 === 32) {
                items.push(
                    <div key={`mobile-ad-2-${index}`} className="sm:hidden col-span-2">
                        <SquareAdsRow300_M2 />
                    </div>
                );
            }
            // After Row 30 (60 videos: 30 rows × 2 columns)
            else if (index + 1 === 60) {
                items.push(
                    <div key={`mobile-ad-3-${index}`} className="sm:hidden col-span-2">
                        <SquareAdsRow315_M3 />
                    </div>
                );
            }
            // After Row 48 (96 videos: 48 rows × 2 columns)
            else if (index + 1 === 96) {
                items.push(
                    <div key={`mobile-ad-4-${index}`} className="sm:hidden col-span-2">
                        <SquareAdsRow315_M4 />
                    </div>
                );
            }
        });
        
        return items;
    };

    return (
        <div className={cn("grid grid-cols-2 sm:grid-cols-6 gap-1.5 sm:gap-x-2.5 sm:gap-y-3", className)}>
            {renderVideoWithAds()}
        </div>
    );
}
