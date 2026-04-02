"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ADS_300x250, ADS_315x300 } from "./SquareAdsRow";

// Combined pool: all square ads from both sizes
const ALL_SQUARE_ADS = [...ADS_300x250, ...ADS_315x300];

const getRandomSquareAd = () =>
    ALL_SQUARE_ADS[Math.floor(Math.random() * ALL_SQUARE_ADS.length)];

// Advertisement URLs from AdRedirectHandler
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

export function PopupAd() {
    const [isVisible, setIsVisible] = useState(false);
    const [closeAttempts, setCloseAttempts] = useState(0);
    const [currentAd, setCurrentAd] = useState(getRandomSquareAd);
    const pathname = usePathname();

    useEffect(() => {
        // Don't show popup on policy pages
        const policyPages = ["/terms", "/contact", "/privacy", "/dmca"];
        const isPolicyPage = policyPages.includes(pathname);
        
        if (isPolicyPage) {
            setIsVisible(false);
            return;
        }

        // Show popup every 4 minutes
        const interval = setInterval(() => {
            if (!policyPages.includes(pathname)) {
                setCurrentAd(getRandomSquareAd()); // fresh random ad each time
                setIsVisible(true);
                setCloseAttempts(0); // Reset close attempts for new popup
            }
        }, 240000); // 4 minutes

        // Show first popup after 4 minutes
        const initialTimeout = setTimeout(() => {
            if (!policyPages.includes(pathname)) {
                setCurrentAd(getRandomSquareAd());
                setIsVisible(true);
                setCloseAttempts(0);
            }
        }, 240000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimeout);
        };
    }, [pathname]);

    const handleClose = () => {
        if (closeAttempts === 0) {
            // First close attempt - redirect to random ad
            const randomIndex = Math.floor(Math.random() * AD_URLS.length);
            const adUrl = AD_URLS[randomIndex];
            window.open(adUrl, '_blank');
            setCloseAttempts(1);
        } else {
            // Second close attempt - actually close the popup
            setIsVisible(false);
            setCloseAttempts(0);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
            <div className="relative bg-black rounded-lg shadow-2xl overflow-hidden" style={{ width: currentAd.w, maxWidth: '92vw' }}>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors"
                    aria-label="Close ad"
                >
                    <X size={14} className="sm:w-4 sm:h-4" />
                </button>

                {/* Ad preview — responsive iframe using aspect-ratio trick */}
                <div
                    style={{
                        width: '100%',
                        paddingBottom: `${(currentAd.h / currentAd.w) * 100}%`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <iframe
                        key={currentAd.id}   /* remount when ad changes */
                        name={currentAd.id}
                        src={currentAd.src}
                        title="Ad"
                        width={currentAd.w}
                        height={currentAd.h}
                        scrolling="no"
                        frameBorder={0}
                        marginHeight={0}
                        marginWidth={0}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            backgroundColor: 'transparent',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}