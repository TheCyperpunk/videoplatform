import { SkeletonVideoGrid } from "@/components/video/SkeletonVideoGrid";

export default function HomeLoading() {
    return (
        <div className="min-h-screen bg-[#0D0D0D] pb-12">
            <div className="max-w-[1800px] mx-auto pt-8 px-4 sm:px-6 space-y-12">
                
                {/* New Videos Skeleton */}
                <section>
                    <div className="h-8 bg-[#1a1a1a] rounded w-48 mb-6 px-2 animate-pulse"></div>
                    <SkeletonVideoGrid count={20} />
                </section>

                {/* Popular Videos Skeleton */}
                <section>
                    <div className="h-8 bg-[#1a1a1a] rounded w-56 mb-6 px-2 animate-pulse"></div>
                    <SkeletonVideoGrid count={20} />
                </section>

                {/* Top Rated Videos Skeleton */}
                <section>
                    <div className="h-8 bg-[#1a1a1a] rounded w-64 mb-6 px-2 animate-pulse"></div>
                    <SkeletonVideoGrid count={20} />
                </section>
            </div>
        </div>
    );
}
