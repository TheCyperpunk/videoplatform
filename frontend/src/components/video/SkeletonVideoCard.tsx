"use client";

"use client";

import { useEffect, useRef } from "react";

interface SkeletonVideoCardProps {
    className?: string;
}

export function SkeletonVideoCard({ className }: SkeletonVideoCardProps) {
    const shimmerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const shimmerElement = shimmerRef.current;
        if (!shimmerElement) return;

        let animationId: number;
        let startTime: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % 1500) / 1500; // 1.5s cycle
            
            const translateX = (progress * 200) - 100; // -100% to 100%
            shimmerElement.style.transform = `translateX(${translateX}%)`;
            
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return (
        <div className={`block animate-pulse ${className ?? ""}`}>
            {/* Thumbnail Skeleton */}
            <div className="relative w-full aspect-video bg-[#1a1a1a] mb-2 rounded-xl overflow-hidden">
                {/* Shimmer effect */}
                <div 
                    ref={shimmerRef}
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(42, 42, 42, 0.5), transparent)',
                    }}
                />
                
                {/* HD + Duration badge skeleton */}
                <div className="absolute bottom-2 right-2 bg-[#2a2a2a] px-2 py-1 rounded">
                    <div className="w-8 h-3 bg-[#333] rounded"></div>
                </div>
            </div>

            {/* Title Skeleton */}
            <div className="space-y-1">
                <div className="h-4 bg-[#1a1a1a] rounded w-full"></div>
                <div className="h-4 bg-[#1a1a1a] rounded w-3/4"></div>
            </div>
        </div>
    );
}