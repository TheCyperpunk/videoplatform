"use client";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchCategories, type CategoryItem } from "@/lib/api";

// Format a category slug like "web-series" → "Web Series"
function formatLabel(slug: string): string {
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const staticNavLinks = [
    {
        label: "Videos",
        href: "/explore",
        hasDropdown: true,
        dropdownItems: [
            { label: "New videos",       href: "/explore?sort=date" },
            { label: "Popular videos",   href: "/explore?sort=views" },
            { label: "Top rated videos", href: "/explore?sort=likes" },
        ]
    },
    { label: "Live cams",   hasDropdown: true },
    { label: "AI chat",     hasDropdown: true },
    { label: "Our network", hasDropdown: false },
];

export function Navbar() {
    const { searchQuery, setSearchQuery, triggerSearch } = useSearch();
    const [searchFocused, setSearchFocused] = useState(false);
    const [openDropdown,  setOpenDropdown]  = useState<string | null>(null);
    const [categories,    setCategories]    = useState<CategoryItem[]>([]);
    const router   = useRouter();
    const pathname = usePathname();

    // Fetch real categories from DB on mount
    useEffect(() => {
        fetchCategories()
            .then((res) => setCategories(res.data.slice(0, 12))) // top 12
            .catch(() => {});
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    // Hide navbar on /terms, /contact, /privacy, and /dmca pages
    if (pathname === "/terms" || pathname === "/contact" || pathname === "/privacy" || pathname === "/dmca") {
        return null;
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim() !== "") {
            if (pathname !== "/explore") {
                router.push("/explore");
            }
            triggerSearch(); // Trigger the actual search
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // Build nav links injecting real categories + always ensure jav/hentai exist
    const categoriesDropdown = {
        label: "Categories",
        hasDropdown: true,
        dropdownItems: [
            ...categories.map((cat) => ({
                label: formatLabel(cat.value),
                href: `/explore?category=${cat.value}`,
            })),
            ...["jav", "hentai"]
                .filter((c) => !categories.some((cat) => cat.value === c))
                .map((c) => ({
                    label: formatLabel(c),
                    href: `/explore?category=${c}`,
                })),
        ],
    };

    const navLinks = [
        staticNavLinks[0],       // Videos
        categoriesDropdown,      // Categories (dynamic from DB)
        ...staticNavLinks.slice(1), // Live cams, AI chat, Our network
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#1E1E1E] font-[Barlow,sans-serif]">

            {/* ── Row 1: Logo · Search ── */}
            <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 sm:h-[58px] sm:flex-nowrap sm:py-0 max-w-[1800px] mx-auto">

                {/* Logo */}
                <Link href="/" className="flex items-center no-underline shrink-0 min-w-[100px]">
                    <img 
                        src="/large-Photoroom.png" 
                        alt="Desimallu" 
                        className="h-5 sm:h-6 md:h-6.5 lg:h-7 w-auto"
                    />
                </Link>

                {/* Search bar */}
                <div className={`
                    flex items-center w-full sm:flex-1 sm:max-w-[720px] sm:mx-auto h-[38px]
                    rounded border bg-[#181818] overflow-hidden transition-colors
                    ${searchFocused ? 'border-[#555]' : 'border-[#2E2E2E]'}
                `}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        placeholder="Search videos, channels…"
                        className="flex-1 h-full bg-transparent border-none outline-none text-white text-sm px-3.5 placeholder-[#666] font-[Barlow,sans-serif]"
                    />
                    {/* Clear button */}
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="flex items-center justify-center w-[32px] h-full text-[#777] hover:text-white transition-colors shrink-0 text-2xl font-light leading-none focus:outline-none focus-visible:outline-none"
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                    <button 
                        onClick={handleSearchSubmit}
                        className="flex items-center justify-center w-[42px] h-full bg-[#252525] border-l border-[#2E2E2E] cursor-pointer text-[#999] shrink-0 hover:text-white transition-colors focus:outline-none focus-visible:outline-none">
                        <Search size={16} />
                    </button>
                </div>
            </div>

            {/* ── Row 2: Sub-nav links ── */}
            <div className="flex flex-nowrap sm:flex-wrap items-center px-5 min-h-[38px] border-t border-[#1A1A1A] max-w-[1800px] mx-auto gap-0.5 relative z-40 overflow-x-auto sm:overflow-visible no-scrollbar">
                {navLinks.map((link) => {
                    const isOpen = openDropdown === link.label;

                    const content = (
                        <>
                            {link.label}
                            {link.hasDropdown && (
                                <ChevronDown
                                    size={12}
                                    className={`opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                />
                            )}
                        </>
                    );

                    const triggerClassName = `inline-flex items-center gap-1 px-3 py-1.5 text-[15px] font-medium text-white whitespace-nowrap rounded transition-all shrink-0 cursor-pointer border-none bg-transparent no-underline hover:bg-[#252525] ${isOpen ? 'bg-[#252525]' : ''}`;

                    const handleTriggerClick = (e: React.MouseEvent) => {
                        if (link.hasDropdown) {
                            e.stopPropagation();
                            setOpenDropdown(isOpen ? null : link.label);
                        }
                    };

                    const trigger = (link as any).href && !link.hasDropdown ? (
                        <Link href={(link as any).href} className={triggerClassName}>
                            {content}
                        </Link>
                    ) : (
                        <button onClick={handleTriggerClick} className={triggerClassName}>
                            {content}
                        </button>
                    );

                    return (
                        <div key={link.label} className="relative group">
                            {trigger}
                        </div>
                    );
                })}
            </div>

            {/* ── Global Dropdown Portal (escapes overflow clipping!) ── */}
            {openDropdown && (() => {
                const activeLink = (navLinks as any).find((l: any) => l.label === openDropdown);
                if (!activeLink || !activeLink.dropdownItems) return null;
                
                return (
                    <div className="absolute top-[100%] left-5 mt-1 flex flex-col min-w-[200px] bg-[#1A1A1A] border border-[#2E2E2E] rounded-md shadow-2xl py-2 z-50 max-h-[340px] overflow-y-auto">
                        {activeLink.dropdownItems.map((item: { label: string; href: string }) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setOpenDropdown(null)}
                                className="block px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#252525] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                );
            })()}
        </header>
    );
}
