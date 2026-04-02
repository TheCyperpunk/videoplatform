"use client";

import { useState, useEffect } from "react";

// Advertisement URLs
const AD_URLS = [
    "https://glamournakedemployee.com/bwxr0sb0f?key=35b9e3e9ab1e3b7165f95922fa87c612",
    "https://glamournakedemployee.com/rrbem7g21j?key=6a6f589c48978346e5b670ef0e472b65",
    "https://glamournakedemployee.com/jwfufwksw?key=65946053b497b51d44294a36c841b302",
    "https://glamournakedemployee.com/aupsead1b?key=2f6e98f46e3234ac365b19e8bff99f36",
    "https://glamournakedemployee.com/fhjn8qnh1?key=96f291155918e367dda68ed66097d60b",
    "https://glamournakedemployee.com/zp1767u8?key=1b17903febce387a6b5aa0630cfaeb87",
    "https://glamournakedemployee.com/c8d2i7t4v0?key=569af3711c742b8e987d42c6bb7b9bae",
    "https://glamournakedemployee.com/wj2y1peag?key=f3ad2c0dcb55e1c0977cd8b029c83e2a",
    "https://glamournakedemployee.com/h5dxswbqg?key=2d3a12389e5084f36aff9f70dfeb12cb"
];

interface AdRedirectHandlerProps {
    videoId: string;
    originalUrl: string;
    onRedirect: () => void;
}

export function AdRedirectHandler({ videoId, originalUrl, onRedirect }: AdRedirectHandlerProps) {
    const getClickCount = (videoId: string): number => {
        try {
            const stored = sessionStorage.getItem(`video_clicks_${videoId}`);
            return stored ? parseInt(stored, 10) : 0;
        } catch {
            return 0;
        }
    };

    const setClickCount = (videoId: string, count: number): void => {
        try {
            sessionStorage.setItem(`video_clicks_${videoId}`, count.toString());
        } catch {
            // Ignore sessionStorage errors
        }
    };

    const getRandomAdUrl = (): string => {
        const randomIndex = Math.floor(Math.random() * AD_URLS.length);
        return AD_URLS[randomIndex];
    };

    const handleClick = () => {
        const currentClicks = getClickCount(videoId);
        
        if (currentClicks < 3) {
            // Redirect to random ad URL for first 3 clicks
            const adUrl = getRandomAdUrl();
            setClickCount(videoId, currentClicks + 1);
            window.open(adUrl, '_blank');
            onRedirect();
        } else {
            // After 3 clicks, allow access to original URL
            window.open(originalUrl, '_blank');
            onRedirect();
        }
    };

    return { handleClick };
}

// Hook for using the ad redirect system
export function useAdRedirect(videoId: string, originalUrl: string) {
    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        const getClickCount = (videoId: string): number => {
            try {
                const stored = sessionStorage.getItem(`video_clicks_${videoId}`);
                return stored ? parseInt(stored, 10) : 0;
            } catch {
                return 0;
            }
        };

        setClickCount(getClickCount(videoId));
    }, [videoId]);

    const handleVideoClick = () => {
        const currentClicks = clickCount;
        
        if (currentClicks < 3) {
            // Redirect to random ad URL for first 3 clicks
            const randomIndex = Math.floor(Math.random() * AD_URLS.length);
            const adUrl = AD_URLS[randomIndex];
            
            try {
                sessionStorage.setItem(`video_clicks_${videoId}`, (currentClicks + 1).toString());
            } catch {
                // Ignore sessionStorage errors
            }
            
            setClickCount(currentClicks + 1);
            window.open(adUrl, '_blank');
        } else {
            // After 3 clicks, allow access to original URL
            window.open(originalUrl, '_blank');
        }
    };

    return {
        handleVideoClick,
        clickCount,
        isAdPhase: clickCount < 3
    };
}