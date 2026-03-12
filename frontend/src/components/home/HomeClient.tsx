"use client";

import { useState, useEffect } from "react";
import { LiveVideoGrid } from "@/components/video/LiveVideoGrid";
import { fetchVideos } from "@/lib/api";
import type { Video } from "@/types/video";

export function HomeClient() {
    const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeatured() {
            try {
                const res = await fetchVideos({ page: 1, limit: 12 });
                setFeaturedVideos(res.data);
            } catch (error) {
                console.error("Failed to load featured videos", error);
            } finally {
                setLoading(false);
            }
        }
        loadFeatured();
    }, []);

    return (
        <div className="min-h-screen bg-[#0D0D0D] pb-12">
            <section className="max-w-[1800px] mx-auto pt-8 px-4 sm:px-6">

                {loading ? (
                    <p className="text-[#555] text-center py-16">Loading trending videos…</p>
                ) : (
                    <LiveVideoGrid videos={featuredVideos} />
                )}
            </section>
        </div>
    );
}
