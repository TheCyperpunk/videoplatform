"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LiveVideoGrid } from "@/components/video/LiveVideoGrid";
import { Pagination } from "@/components/video/Pagination";
import { useSearch } from "@/context/SearchContext";
import { fetchVideos, searchVideos } from "@/lib/api";
import type { Video } from "@/types/video";

const VIDEOS_PER_PAGE = 120;


function ExploreContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const pathname      = usePathname();
  const { debouncedQuery } = useSearch();

  // Read URL state
  const pageParam     = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const sortParam     = searchParams.get("sort")     || undefined;
  const categoryParam = searchParams.get("category") || "all";

  const [videos,      setVideos]      = useState<Video[]>([]);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  // ── helpers ────────────────────────────────────────────────────────────────
  const updateUrl = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v && v !== "all") params.set(k, v);
      else params.delete(k);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const loadVideos = useCallback(async (
    page: number,
    query: string,
    sort?: string,
    category?: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const cat = category === "all" ? undefined : category;
      if (query.trim()) {
        const res = await searchVideos(query, cat, sort, page, VIDEOS_PER_PAGE);
        setVideos(res.data);
        setTotal(res.total);
      } else {
        const res = await fetchVideos({ page, limit: VIDEOS_PER_PAGE, sort, category: cat });
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

  // Sync URL → state when the URL page param changes (back/forward nav)
  useEffect(() => { setCurrentPage(pageParam); }, [pageParam]);

  // Reset to page 1 when query or filters change
  useEffect(() => {
    setCurrentPage(1);
    updateUrl({ page: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, sortParam, categoryParam]);

  // Reload data whenever page / query / filters change
  useEffect(() => {
    loadVideos(currentPage, debouncedQuery, sortParam, categoryParam);
  }, [currentPage, debouncedQuery, sortParam, categoryParam, loadVideos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / VIDEOS_PER_PAGE);
  const isSearching = debouncedQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">

      {/* ── Search result banner ── */}
      {isSearching && !loading && (
        <div className="px-4 pt-4 pb-1">
          <p className="text-[#888] text-sm">
            {total > 0
              ? <><span className="text-white font-semibold">{total}</span> result{total !== 1 ? "s" : ""} for <span className="text-[#F5A200]">"{debouncedQuery}"</span></>
              : <>No results for <span className="text-[#F5A200]">"{debouncedQuery}"</span></>
            }
          </p>
        </div>
      )}

      {/* ── Loading state ── */}
      {loading && (
        <p className="text-[#555] text-center py-16">Loading videos…</p>
      )}

      {/* ── Error state ── */}
      {!loading && error && (
        <p className="text-[#e53935] text-center py-16">{error}</p>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && videos.length === 0 && (
        <p className="text-[#555] text-center py-16">
          No videos found{debouncedQuery ? ` for "${debouncedQuery}"` : ""}.
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

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D0D0D] py-16 text-center text-[#555]">Loading exploration…</div>}>
      <ExploreContent />
    </Suspense>
  );
}
