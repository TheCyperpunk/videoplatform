"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, disabled = false }: PaginationProps) {
    // Show a sliding window of 5 pages centred around currentPage
    const getPages = (): number[] => {
        const total = Math.max(1, totalPages);
        const windowSize = 5;
        let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
        let end   = start + windowSize - 1;
        if (end > total) {
            end   = total;
            start = Math.max(1, end - windowSize + 1);
        }
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const pages = getPages();

    const baseBtn =
        "inline-flex items-center justify-center w-[42px] h-[44px] rounded-[10px] font-bold cursor-pointer select-none transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed";

    return (
        <nav
            className="flex items-center justify-center gap-2 py-7 pb-20 flex-wrap"
            aria-label="Pagination"
        >
            {/* Prev */}
            <button
                className={`${baseBtn} bg-[#1a1b1e] text-[#5c5f66] hover:bg-[#25262b] hover:text-[#909296]`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                aria-label="Previous page"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>

            {/* Page numbers */}
            {pages.map((p) =>
                p === currentPage ? (
                    /* Active page – white box, dark text */
                    <button
                        key={p}
                        className={`${baseBtn} bg-[#f8f9fa] text-[#141517] text-[15px] cursor-default shadow-sm`}
                        onClick={() => onPageChange(p)}
                        disabled={disabled}
                        aria-label={`Page ${p}`}
                        aria-current="page"
                    >
                        {p}
                    </button>
                ) : (
                    /* Inactive pages – dark box, gray text */
                    <button
                        key={p}
                        className={`${baseBtn} bg-[#1a1b1e] text-[#909296] text-[15px] hover:bg-[#25262b] hover:text-white`}
                        onClick={() => onPageChange(p)}
                        disabled={disabled}
                        aria-label={`Page ${p}`}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next – gold box, dark text */}
            <button
                className={`${baseBtn} bg-[#f5a524] text-[#141517] hover:bg-[#f5b84c] shadow-sm`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                aria-label="Next page"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
        </nav>
    );
}
