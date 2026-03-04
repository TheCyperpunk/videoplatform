"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search videos, channels…",
}: SearchBarProps) {
    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            borderRadius: '2px',
            border: '1px solid #2A2A2A',
            backgroundColor: '#161616',
            height: '40px'
        }}>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: 'white',
                    border: 'none',
                    outline: 'none'
                }}
                aria-label="Search videos"
            />
            {/* Clear */}
            {value && (
                <button
                    onClick={() => onChange("")}
                    aria-label="Clear search"
                    style={{
                        padding: '0 8px',
                        color: '#666',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                    }}
                >
                    ✕
                </button>
            )}
            {/* Search button */}
            <button
                aria-label="Submit search"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '0 16px',
                    borderLeft: '1px solid #2A2A2A',
                    borderTop: 'none',
                    borderBottom: 'none',
                    borderRight: 'none',
                    backgroundColor: 'transparent',
                    color: '#888',
                    cursor: 'pointer'
                }}
            >
                <Search size={16} />
            </button>
        </div>
    );
}
