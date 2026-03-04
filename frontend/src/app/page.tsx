"use client";

import { useState, useEffect, useCallback } from "react";
import { LiveVideoGrid } from "@/components/video/LiveVideoGrid";
import { Pagination } from "@/components/video/Pagination";
import { useSearch } from "@/context/SearchContext";
import { fetchVideos, searchVideos } from "@/lib/api";
import type { Video } from "@/types/video";

const VIDEOS_PER_PAGE = 120;

export default function HomePage() {
  const { searchQuery } = useSearch();
  const [videos, setVideos] = useState<Video[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = useCallback(async (page: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      if (query.trim()) {
        const res = await searchVideos(query);
        setVideos(res.data);
        setTotal(res.total);
        setCurrentPage(1);
      } else {
        const res = await fetchVideos({ page, limit: VIDEOS_PER_PAGE });
        setVideos(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      setError("Failed to load videos. Is the backend running on port 5000?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload when page or search changes
  useEffect(() => {
    loadVideos(currentPage, searchQuery);
  }, [currentPage, searchQuery, loadVideos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / VIDEOS_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* ── Loading state ── */}
      {loading && (
        <p style={{ color: "#555", textAlign: "center", padding: "60px 0", fontFamily: "sans-serif" }}>
          Loading videos…
        </p>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <p style={{ color: "#e53935", textAlign: "center", padding: "60px 0", fontFamily: "sans-serif" }}>
          {error}
        </p>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && videos.length === 0 && (
        <p style={{ color: "#555", textAlign: "center", padding: "60px 0", fontFamily: "sans-serif" }}>
          No videos found{searchQuery ? ` for "${searchQuery}"` : ""}.
        </p>
      )}

      {/* ── Video Grid ── */}
      {!loading && !error && videos.length > 0 && (
        <div className="px-4 sm:px-6 py-5">
          <LiveVideoGrid videos={videos} />
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
