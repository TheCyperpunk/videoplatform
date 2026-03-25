"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ProgressBar } from "./ProgressBar";

export function GlobalProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Show progress bar on route/search changes
        setIsLoading(true);
        
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500); // Adjust timing as needed

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return <ProgressBar isLoading={isLoading} />;
}