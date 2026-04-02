"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LiveVideoGrid } from "@/components/video/LiveVideoGrid";
import { SkeletonVideoGrid } from "@/components/video/SkeletonVideoGrid";
import { Pagination } from "@/components/video/Pagination";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RotatingLeaderboard } from "@/components/ads/RotatingLeaderboard";
import { fetchNewVideos, fetchPopularVideos, fetchTopRatedVideos } from "@/lib/api";
import type { Video } from "@/types/video";

export function HomeClient() {
    const router = useRouter();
    const [newVideos, setNewVideos] = useState<Video[]>([]);
    const [popularVideos, setPopularVideos] = useState<Video[]>([]);
    const [topRatedVideos, setTopRatedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    
    // Total counts for pagination
    const [newTotal, setNewTotal] = useState(0);
    const [popularTotal, setPopularTotal] = useState(0);
    const [topRatedTotal, setTopRatedTotal] = useState(0);
    
    // Individual loading states for progressive loading
    const [newLoading, setNewLoading] = useState(true);
    const [popularLoading, setPopularLoading] = useState(true);
    const [topRatedLoading, setTopRatedLoading] = useState(true);

    const VIDEOS_PER_PAGE = 20;

    useEffect(() => {
        async function loadCategorySections() {
            const errorList: string[] = [];
            
            try {
                console.log("Loading category sections...");
                
                // Load each section individually for progressive loading
                try {
                    console.log("Fetching new videos...");
                    const newRes = await fetchNewVideos({ page: 1, limit: VIDEOS_PER_PAGE });
                    console.log("New videos success:", newRes.data.length, "videos");
                    setNewVideos(newRes.data);
                    setNewTotal(newRes.total);
                    setNewLoading(false);
                } catch (error) {
                    console.error("New videos failed:", error);
                    errorList.push(`New videos: ${error}`);
                    setNewLoading(false);
                }

                try {
                    console.log("Fetching popular videos...");
                    const popularRes = await fetchPopularVideos({ page: 1, limit: VIDEOS_PER_PAGE });
                    console.log("Popular videos success:", popularRes.data.length, "videos");
                    setPopularVideos(popularRes.data);
                    setPopularTotal(popularRes.total);
                    setPopularLoading(false);
                } catch (error) {
                    console.error("Popular videos failed:", error);
                    errorList.push(`Popular videos: ${error}`);
                    setPopularLoading(false);
                }

                try {
                    console.log("Fetching top rated videos...");
                    const topRatedRes = await fetchTopRatedVideos({ page: 1, limit: VIDEOS_PER_PAGE });
                    console.log("Top rated videos success:", topRatedRes.data.length, "videos");
                    setTopRatedVideos(topRatedRes.data);
                    setTopRatedTotal(topRatedRes.total);
                    setTopRatedLoading(false);
                } catch (error) {
                    console.error("Top rated videos failed:", error);
                    errorList.push(`Top rated videos: ${error}`);
                    setTopRatedLoading(false);
                }

                setErrors(errorList);
            } catch (error) {
                console.error("Failed to load category sections", error);
                setErrors([`General error: ${error}`]);
            } finally {
                setLoading(false);
            }
        }
        loadCategorySections();
    }, []);

    // Calculate total pages based on the largest section
    const totalPages = Math.max(
        Math.ceil(newTotal / VIDEOS_PER_PAGE),
        Math.ceil(popularTotal / VIDEOS_PER_PAGE),
        Math.ceil(topRatedTotal / VIDEOS_PER_PAGE)
    );

    // Single pagination handler that redirects to explore with mixed content
    const handlePageChange = (page: number) => {
        router.push(`/explore?sort=date&page=${page}`);
        // Scroll to top when navigating
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] pb-12">
                <div className="max-w-[1800px] mx-auto pt-8 px-4 sm:px-6 space-y-12">
                    
                    {/* New Videos Skeleton */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 px-2">New videos</h2>
                        <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
                    </section>

                    {/* Popular Videos Skeleton */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 px-2">Popular videos</h2>
                        <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
                    </section>

                    {/* Top Rated Videos Skeleton */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 px-2">Top rated videos</h2>
                        <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] pb-12">
            
            {/* ── Progress Bar ── */}
            <ProgressBar isLoading={newLoading || popularLoading || topRatedLoading} />
            
            <div className="max-w-[1800px] mx-auto pt-8 px-4 sm:px-6 space-y-12">

                {/* New Videos Section */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 px-2">New videos</h2>
                    {newLoading ? (
                        <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
                    ) : newVideos.length > 0 ? (
                        <LiveVideoGrid videos={newVideos} />
                    ) : (
                        <p className="text-[#555] text-center py-8">No new videos available.</p>
                    )}
                </section>

                {/* Popular Videos Section */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 px-2">Popular videos</h2>
                    {popularLoading ? (
                        <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
                    ) : popularVideos.length > 0 ? (
                        <LiveVideoGrid videos={popularVideos} />
                    ) : (
                        <p className="text-[#555] text-center py-8">No popular videos available.</p>
                    )}
                </section>

                {/* Top Rated Videos Section */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-6 px-2">Top rated videos</h2>
                    {topRatedLoading ? (
                        <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
                    ) : topRatedVideos.length > 0 ? (
                        <LiveVideoGrid videos={topRatedVideos} />
                    ) : (
                        <p className="text-[#555] text-center py-8">No top rated videos available.</p>
                    )}
                </section>
            </div>

            {/* Bottom Leaderboard Ads - Outside container for full width */}
            {!loading && !newLoading && !popularLoading && !topRatedLoading && (
                <RotatingLeaderboard position="bottom" />
            )}

            {/* Single Pagination at Bottom */}
            {!loading && !newLoading && !popularLoading && !topRatedLoading && totalPages > 1 && (
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
                    <Pagination
                        currentPage={1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        disabled={false}
                    />
                </div>
            )}

            {/* Slim Banner Below Pagination */}
            {!loading && !newLoading && !popularLoading && !topRatedLoading && (
                <RotatingLeaderboard position="slim" />
            )}
        </div>
    );
}
