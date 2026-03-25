"use client";

import { SkeletonVideoCard } from "./SkeletonVideoCard";

interface SkeletonVideoGridProps {
    count?: number;
    className?: string;
}

export function SkeletonVideoGrid({ count = 24, className }: SkeletonVideoGridProps) {
    return (
        <div className={`grid grid-cols-2 sm:grid-cols-6 gap-1.5 sm:gap-x-2.5 sm:gap-y-3 ${className ?? ""}`}>
            {Array.from({ length: count }, (_, index) => (
                <SkeletonVideoCard key={index} />
            ))}
        </div>
    );
}