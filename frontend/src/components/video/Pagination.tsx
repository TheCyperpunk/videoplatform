"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Build page number array with ellipsis logic
    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const pages: (number | "...")[] = [1];
        if (currentPage > 3) pages.push("...");
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    const pages = getPages();

    return (
        <>
            <style>{`
                .pagination-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 28px 16px 80px;
                    flex-wrap: wrap;
                }
                .pg-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 36px;
                    height: 36px;
                    padding: 0 10px;
                    border-radius: 8px;
                    border: 1px solid #2a2a2a;
                    background: #1a1a1a;
                    color: #aaa;
                    font-size: 13px;
                    font-family: sans-serif;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.15s, color 0.15s, border-color 0.15s;
                    user-select: none;
                }
                .pg-btn:hover:not(:disabled) {
                    background: #252525;
                    color: #fff;
                    border-color: #444;
                }
                .pg-btn.active {
                    background: #e53935;
                    color: #fff;
                    border-color: #e53935;
                    font-weight: 700;
                }
                .pg-btn:disabled {
                    opacity: 0.35;
                    cursor: not-allowed;
                }
                .pg-ellipsis {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 36px;
                    height: 36px;
                    color: #555;
                    font-size: 14px;
                    font-family: sans-serif;
                    pointer-events: none;
                }
                @media (max-width: 400px) {
                    .pg-btn { min-width: 30px; height: 30px; font-size: 12px; padding: 0 7px; }
                }
            `}</style>

            <nav className="pagination-wrapper" aria-label="Pagination">
                {/* Prev */}
                <button
                    className="pg-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                >
                    ‹
                </button>

                {/* Page numbers */}
                {pages.map((p, idx) =>
                    p === "..." ? (
                        <span key={`ellipsis-${idx}`} className="pg-ellipsis">…</span>
                    ) : (
                        <button
                            key={p}
                            className={`pg-btn${p === currentPage ? " active" : ""}`}
                            onClick={() => onPageChange(p as number)}
                            aria-label={`Page ${p}`}
                            aria-current={p === currentPage ? "page" : undefined}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    className="pg-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                >
                    ›
                </button>
            </nav>
        </>
    );
}
