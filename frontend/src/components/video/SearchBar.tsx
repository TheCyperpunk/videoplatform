"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void; // New prop for search trigger
    placeholder?: string;
}

export function SearchBar({
    value,
    onChange,
    onSearch,
    placeholder = "Search videos, channels…",
}: SearchBarProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="relative flex w-full items-center rounded-sm border border-[#2A2A2A] bg-[#161616] h-10">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white border-none outline-none placeholder-[#555]"
                aria-label="Search videos"
            />
            {/* Clear */}
            {value && (
                <button
                    onClick={() => onChange("")}
                    aria-label="Clear search"
                    className="flex items-center justify-center h-full px-2 text-[#666] bg-transparent border-none cursor-pointer hover:text-white transition-colors"
                >
                    ✕
                </button>
            )}
            {/* Search button */}
            <button
                onClick={onSearch}
                aria-label="Submit search"
                className="flex items-center justify-center h-full px-4 border-l border-[#2A2A2A] bg-transparent text-[#888] cursor-pointer hover:text-white transition-colors"
            >
                <Search size={16} />
            </button>
        </div>
    );
}
