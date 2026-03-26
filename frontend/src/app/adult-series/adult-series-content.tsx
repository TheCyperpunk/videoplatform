"use client";

import { useState, useEffect, useCallback } from "react";
import { LiveVideoGrid } from "@/components/video/LiveVideoGrid";
import { Pagination } from "@/components/video/Pagination";
import { useSearch } from "@/context/SearchContext";
import { fetchVideos, searchVideos } from "@/lib/api";
import type { Video } from "@/types/video";

const VIDEOS_PER_PAGE = 120;
const CATEGORY_FILTER = "webseries"; // Hardcoded to only show Web Series

export default function AdultSeriesContent() {
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
        const res = await searchVideos(query, CATEGORY_FILTER);
        setVideos(res.data);
        setTotal(res.total);
        setCurrentPage(1);
      } else {
        const res = await fetchVideos({ page, limit: VIDEOS_PER_PAGE, category: CATEGORY_FILTER });
        setVideos(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      setError("Failed to load web series videos.");
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
      {/* ── Header ── */}
      <h1 className="text-2xl font-bold text-white px-6 py-4 border-b border-[#222]">Adult Web Series</h1>

      {/* ── Loading state ── */}
      {loading && (
        <p className="text-[#555] text-center py-16">
          Loading videos…
        </p>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <p className="text-[#e53935] text-center py-16">
          {error}
        </p>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && videos.length === 0 && (
        <p className="text-[#555] text-center py-16">
          No web series found{searchQuery ? ` for "${searchQuery}"` : ""}.
        </p>
      )}

      {/* ── Video Grid ── */}
      {!loading && !error && videos.length > 0 && (
        <div className="px-2 py-3">
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
