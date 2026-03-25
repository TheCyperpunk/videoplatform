"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LiveVideoGrid } from "@/components/video/LiveVideoGrid";
import { SkeletonVideoGrid } from "@/components/video/SkeletonVideoGrid";
import { Pagination } from "@/components/video/Pagination";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useSearch } from "@/context/SearchContext";
import { fetchVideos, searchCombined, fetchCategories } from "@/lib/api";
import type { Video } from "@/types/video";

const VIDEOS_PER_PAGE = 120;

function ExploreContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const pathname      = usePathname();
  const { activeQuery } = useSearch();

  // Read URL state - now including sort param
  const pageParam     = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const sortParam     = searchParams.get("sort") || "date";

  const [videos,      setVideos]      = useState<Video[]>([]);
  const [total,       setTotal]       = useState(0);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [currentSort, setCurrentSort] = useState(sortParam);
  const [loading,     setLoading]     = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  // ── helpers ────────────────────────────────────────────────────────────────
  const updateUrl = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  const loadVideos = useCallback(async (
    page: number,
    query: string,
    sort: string,
    isPagination: boolean = false
  ) => {
    if (isPagination) {
      setPaginationLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      if (query.trim()) {
        // Use combined search when there's a query - includes external APIs
        const res = await searchCombined(query, undefined, sort, page, VIDEOS_PER_PAGE);
        
        // Results are already shuffled and combined in localVideos
        setVideos(res.localVideos);
        setTotal(res.totalCount);
        
        if (res.error) {
          setError(res.error);
        }
      } else {
        // Use local search only when browsing without query, with sorting
        const res = await fetchVideos({ page, limit: VIDEOS_PER_PAGE, sort });
        setVideos(res.data);
        setTotal(res.total);
      }
    } catch (err) {
      setError("Failed to load videos. Is the backend running on port 5002?");
      console.error(err);
      setVideos([]);
    } finally {
      if (isPagination) {
        setPaginationLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Sync URL → state when the URL params change (back/forward nav)
  useEffect(() => { setCurrentPage(pageParam); }, [pageParam]);
  useEffect(() => { setCurrentSort(sortParam); }, [sortParam]);

  // Reset to page 1 when query or sort changes
  useEffect(() => {
    setCurrentPage(1);
    updateUrl({ page: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery, currentSort]);

  // Reload data whenever page / query / sort changes
  useEffect(() => {
    const isPagination = currentPage !== 1 && videos.length > 0;
    loadVideos(currentPage, activeQuery, currentSort, isPagination);
  }, [currentPage, activeQuery, currentSort, loadVideos]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(total / VIDEOS_PER_PAGE);
  const isSearching = activeQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D] relative">
      
      {/* ── Progress Bar ── */}
      <ProgressBar isLoading={loading || paginationLoading} />

      {/* ── Search result banner ── */}
      {isSearching && !loading && !paginationLoading && (
        <div className="px-4 pt-4 pb-1">
          <p className="text-[#888] text-sm">
            {total > 0 ? (
              <>
                <span className="text-white font-semibold">{total}</span> result{total !== 1 ? "s" : ""} for{" "}
                <span className="text-[#F5A200]">"{activeQuery}"</span>
              </>
            ) : (
              <>No results for <span className="text-[#F5A200]">"{activeQuery}"</span></>
            )}
          </p>
        </div>
      )}

      {/* ── Error banner ── */}
      {error && !loading && !paginationLoading && (
        <div className="px-4 pt-2">
          <p className="text-yellow-500 text-sm bg-yellow-500/10 px-3 py-2 rounded border border-yellow-500/20">
            ⚠ {error}
          </p>
        </div>
      )}

      {/* ── Loading state (initial load) ── */}
      {loading && (
        <div className="px-2 py-3">
          <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
        </div>
      )}

      {/* ── Pagination Loading state (next page) ── */}
      {paginationLoading && (
        <div className="px-2 py-3">
          <SkeletonVideoGrid count={VIDEOS_PER_PAGE} />
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !paginationLoading && videos.length === 0 && (
        <p className="text-[#555] text-center py-16">
          No videos found{activeQuery ? ` for "${activeQuery}"` : ""}.
        </p>
      )}

      {/* ── Video Grid ── */}
      {!loading && !paginationLoading && videos.length > 0 && (
        <div className="px-2 py-3">
          <LiveVideoGrid videos={videos} />
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && !paginationLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={false}
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
