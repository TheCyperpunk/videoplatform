"use client";

import { useState, useEffect } from "react";
import { LiveVideoGrid } from "@/components/video/LiveVideoGrid";
import { SkeletonVideoGrid } from "@/components/video/SkeletonVideoGrid";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { fetchNewVideos, fetchPopularVideos, fetchTopRatedVideos } from "@/lib/api";
import type { Video } from "@/types/video";

export function HomeClient() {
    const [newVideos, setNewVideos] = useState<Video[]>([]);
    const [popularVideos, setPopularVideos] = useState<Video[]>([]);
    const [topRatedVideos, setTopRatedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);
    
    // Individual loading states for progressive loading
    const [newLoading, setNewLoading] = useState(true);
    const [popularLoading, setPopularLoading] = useState(true);
    const [topRatedLoading, setTopRatedLoading] = useState(true);

    useEffect(() => {
        async function loadCategorySections() {
            const errorList: string[] = [];
            
            try {
                console.log("Loading category sections...");
                
                // Load each section individually for progressive loading
                try {
                    console.log("Fetching new videos...");
                    const newRes = await fetchNewVideos({ page: 1, limit: 20 });
                    console.log("New videos success:", newRes.data.length, "videos");
                    setNewVideos(newRes.data);
                    setNewLoading(false);
                } catch (error) {
                    console.error("New videos failed:", error);
                    errorList.push(`New videos: ${error}`);
                    setNewLoading(false);
                }

                try {
                    console.log("Fetching popular videos...");
                    const popularRes = await fetchPopularVideos({ page: 1, limit: 20 });
                    console.log("Popular videos success:", popularRes.data.length, "videos");
                    setPopularVideos(popularRes.data);
                    setPopularLoading(false);
                } catch (error) {
                    console.error("Popular videos failed:", error);
                    errorList.push(`Popular videos: ${error}`);
                    setPopularLoading(false);
                }

                try {
                    console.log("Fetching top rated videos...");
                    const topRatedRes = await fetchTopRatedVideos({ page: 1, limit: 20 });
                    console.log("Top rated videos success:", topRatedRes.data.length, "videos");
                    setTopRatedVideos(topRatedRes.data);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D0D0D] pb-12">
                <div className="max-w-[1800px] mx-auto pt-8 px-4 sm:px-6 space-y-12">
                    
                    {/* New Videos Skeleton */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 px-2">New videos</h2>
                        <SkeletonVideoGrid count={20} />
                    </section>

                    {/* Popular Videos Skeleton */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 px-2">Popular videos</h2>
                        <SkeletonVideoGrid count={20} />
                    </section>

                    {/* Top Rated Videos Skeleton */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 px-2">Top rated videos</h2>
                        <SkeletonVideoGrid count={20} />
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
                        <SkeletonVideoGrid count={20} />
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
                        <SkeletonVideoGrid count={20} />
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
                        <SkeletonVideoGrid count={20} />
                    ) : topRatedVideos.length > 0 ? (
                        <LiveVideoGrid videos={topRatedVideos} />
                    ) : (
                        <p className="text-[#555] text-center py-8">No top rated videos available.</p>
                    )}
                </section>
            </div>
        </div>
    );
}
