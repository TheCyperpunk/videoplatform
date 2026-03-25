"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
    isLoading: boolean;
    className?: string;
}

export function ProgressBar({ isLoading, className }: ProgressBarProps) {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setVisible(true);
            setProgress(0);
            
            // Simulate progress with realistic timing
            const intervals = [
                { delay: 100, progress: 20 },
                { delay: 300, progress: 40 },
                { delay: 600, progress: 60 },
                { delay: 900, progress: 80 },
                { delay: 1200, progress: 95 },
            ];

            const timeouts = intervals.map(({ delay, progress: targetProgress }) =>
                setTimeout(() => {
                    if (isLoading) {
                        setProgress(targetProgress);
                    }
                }, delay)
            );

            return () => {
                timeouts.forEach(clearTimeout);
            };
        } else {
            // Complete the progress bar
            setProgress(100);
            
            // Hide after completion animation
            const hideTimeout = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 200);

            return () => clearTimeout(hideTimeout);
        }
    }, [isLoading]);

    if (!visible) return null;

    const progressBarStyle = {
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #F5A200, #FF7A00)',
        boxShadow: progress > 0 ? '0 0 10px rgba(245, 162, 0, 0.5)' : 'none',
        transition: 'all 300ms ease-out',
    };

    return (
        <>
            <div className={`fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent ${className ?? ""}`}>
                <div 
                    className="h-full"
                    style={progressBarStyle}
                />
            </div>
        </>
    );
}