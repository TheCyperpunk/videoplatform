"use client";

import { RefreshCw } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1A1A1A] border border-[#FF3B3B]/30">
                <RefreshCw size={32} className="text-[#FF3B3B]" />
            </div>
            <div>
                <h1 className="font-syne text-2xl font-800 text-[#F5F5F5]">Something went wrong</h1>
                <p className="text-sm text-[#555555] font-dm mt-2">{error.message || "An unexpected error occurred."}</p>
            </div>
            <button
                onClick={reset}
                className="rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FF7A00] px-6 py-3 text-sm font-600 text-white hover:opacity-90 transition-opacity"
            >
                Try Again
            </button>
        </div>
    );
}
