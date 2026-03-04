"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import { SearchBar } from "@/components/video/SearchBar";

const navLinks = [
    { label: "Videos", hasDropdown: true },
    { label: "Categories", hasDropdown: true },
    { label: "Live cams", hasDropdown: true },
    { label: "AI chat", hasDropdown: true },
    { label: "Our network", hasDropdown: false },
];

export function Navbar() {
    const { searchQuery, setSearchQuery } = useSearch();

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backgroundColor: '#0D0D0D',
            borderBottom: '1px solid #1C1C1C',
            fontFamily: 'sans-serif'
        }}>
            {/* ── Row 1: Logo · Search ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '0 24px',
                height: '56px',
                maxWidth: '1800px',
                margin: '0 auto'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    flexShrink: 0
                }}>
                    <div style={{
                        display: 'flex',
                        height: '32px',
                        width: '32px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF3B3B, #FF7A00)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(255,59,59,0.3)'
                    }}>
                        V
                    </div>
                    <span style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        letterSpacing: '-0.5px',
                        color: 'white'
                    }}>
                        Videx
                    </span>
                    <span style={{ color: '#FF3B3B', fontSize: '18px', marginLeft: '-2px' }}>●</span>
                </Link>

                {/* Search bar */}
                <div style={{
                    display: 'flex',
                    flex: 1,
                    maxWidth: '672px',
                    margin: '0 auto'
                }}>
                    <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search videos, channels…" />
                </div>
            </div>

            {/* ── Row 2: Sub-nav links ── */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0 24px',
                height: '40px',
                borderTop: '1px solid #1C1C1C',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                maxWidth: '1800px',
                margin: '0 auto'
            }}>
                {navLinks.map((link) => (
                    <button
                        key={link.label}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1C1C1C')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            fontSize: '14px',
                            color: '#CCCCCC',
                            background: 'none',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {link.label}
                        {link.hasDropdown && <ChevronDown size={13} style={{ opacity: 0.6 }} />}
                    </button>
                ))}
            </div>
        </header>
    );
}
