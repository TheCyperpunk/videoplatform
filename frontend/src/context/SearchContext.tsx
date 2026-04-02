"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
    searchQuery: string;
    activeQuery: string; // The query that triggers actual search
    setSearchQuery: (query: string) => void;
    triggerSearch: () => void; // Manual search trigger
    clearSearch: () => void; // Clear both search query and active query
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeQuery, setActiveQuery] = useState(""); // Only updates when search is triggered

    const triggerSearch = () => {
        setActiveQuery(searchQuery); // Set active query to current input
    };

    const clearSearch = () => {
        setSearchQuery("");
        setActiveQuery("");
    };

    return (
        <SearchContext.Provider value={{ 
            searchQuery, 
            activeQuery, 
            setSearchQuery, 
            triggerSearch,
            clearSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
