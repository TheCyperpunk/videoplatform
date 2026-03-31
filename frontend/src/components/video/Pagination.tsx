"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

    const baseBtn = cn(
        "inline-flex items-center justify-center w-[36px] h-[38px] rounded-[8px]",
        "font-bold cursor-pointer select-none transition-all duration-150",
        "disabled:opacity-30 disabled:cursor-not-allowed"
    );

    return (
        <nav
            className="flex items-center justify-center gap-2 py-7 pb-20 flex-wrap"
            aria-label="Pagination"
        >
            {/* Prev */}
            <button
                className={cn(baseBtn, "bg-[#1a1b1e] text-[#5c5f66] hover:bg-[#25262b] hover:text-[#909296]")}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={disabled || currentPage === 1}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* Page numbers */}
            {pages.map((p) => (
                <button
                    key={p}
                    className={cn(
                        baseBtn,
                        "text-[14px]",
                        p === currentPage
                            ? "bg-[#f8f9fa] text-[#141517] cursor-default shadow-sm"
                            : "bg-[#1a1b1e] text-[#909296] hover:bg-[#25262b] hover:text-white"
                    )}
                    onClick={() => onPageChange(p)}
                    disabled={disabled}
                    aria-label={`Page ${p}`}
                    aria-current={p === currentPage ? "page" : undefined}
                >
                    {p}
                </button>
            ))}

            {/* Next – gold */}
            <button
                className={cn(baseBtn, "bg-[#f5a524] text-[#141517] hover:bg-[#f5b84c] shadow-sm")}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={disabled || currentPage === totalPages}
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
        </nav>
    );
}
