"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// ─── Responsive Scaled Ad ────────────────────────────────────────────────────
// Scales a fixed-width iframe to fill its container on any screen size
const ResponsiveAd = ({
  width,
  height,
  ...rest
}: React.IframeHTMLAttributes<HTMLIFrameElement> & { width: number; height: number }) => {
  return (
    <div
      style={{
        width: '100%',
        height: 0,
        paddingBottom: `${(height / width) * 100}%`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <iframe
        width={width}
        height={height}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          transform: 'none',
        }}
        {...rest}
      />
    </div>
  );
};

// ─── Leaderboard Ad Data ─────────────────────────────────────────────────────
const LEADERBOARD_ADS = [
  { id: "spot_id_10001811", src: "https://a.adtng.com/get/10001811?ata=Malludesi", title: "Leaderboard 1" },
  { id: "spot_id_10002801", src: "https://a.adtng.com/get/10002801?ata=Malludesi", title: "Leaderboard 2" },
  { id: "spot_id_10008054", src: "https://a.adtng.com/get/10008054?ata=Malludesi", title: "Leaderboard 3" },
  { id: "spot_id_10008050", src: "https://a.adtng.com/get/10008050?ata=Malludesi", title: "Leaderboard 4" },
  { id: "spot_id_10008045", src: "https://a.adtng.com/get/10008045?ata=Malludesi", title: "Leaderboard 5" },
  { id: "spot_id_10002481", src: "https://a.adtng.com/get/10002481?ata=Malludesi", title: "Leaderboard 6" },
];

// ─── Slim Banner Ad Data ─────────────────────────────────────────────────────
const SLIM_BANNER_ADS = [
  { id: "spot_id_10001817", src: "https://a.adtng.com/get/10001817?ata=Malludesi", title: "Slim 1" },
  { id: "spot_id_10001814", src: "https://a.adtng.com/get/10001814?ata=Malludesi", title: "Slim 2" },
  { id: "spot_id_10002802", src: "https://a.adtng.com/get/10002802?ata=Malludesi", title: "Slim 3" },
  { id: "spot_id_10008611", src: "https://a.adtng.com/get/10008611?ata=Malludesi", title: "Slim 4" },
  { id: "spot_id_10002483", src: "https://a.adtng.com/get/10002483?ata=Malludesi", title: "Slim 5" },
  { id: "spot_id_10002480", src: "https://a.adtng.com/get/10002480?ata=Malludesi", title: "Slim 6" },
  { id: "spot_id_10007345", src: "https://a.adtng.com/get/10007345?ata=Malludesi", title: "Slim 7" },
];

interface RotatingLeaderboardProps {
  position?: 'top' | 'bottom' | 'slim';
  className?: string;
}

export const RotatingLeaderboard: React.FC<RotatingLeaderboardProps> = ({ 
  position = 'top',
  className = ''
}) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [shuffledAds, setShuffledAds] = useState<typeof LEADERBOARD_ADS>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Don't show on policy pages
  const policyPages = ["/terms", "/contact", "/privacy", "/dmca"];
  const isPolicyPage = policyPages.includes(pathname);

  // Select appropriate ad set based on position
  const adSet = position === 'slim' ? SLIM_BANNER_ADS : LEADERBOARD_ADS;

  // Shuffle ads array
  const shuffleArray = (array: typeof LEADERBOARD_ADS | typeof SLIM_BANNER_ADS) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize shuffled ads on mount and route changes
  useEffect(() => {
    if (isPolicyPage) return;
    
    const shuffled = shuffleArray(adSet);
    setShuffledAds(shuffled as typeof LEADERBOARD_ADS);
    setCurrentAdIndex(0);
  }, [pathname, searchParams, isPolicyPage, adSet]);

  // Auto-rotate ads with different timing based on position
  useEffect(() => {
    if (isPolicyPage || shuffledAds.length === 0) return;

    const rotationTime = 30000; // 30s for all ad positions
    const increment = position === 'slim' ? 1 : 2; // 1 ad for slim, 2 ads for leaderboard

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => {
        const nextIndex = (prevIndex + increment) % shuffledAds.length;
        return nextIndex;
      });
    }, rotationTime);

    return () => clearInterval(interval);
  }, [isPolicyPage, shuffledAds.length, position]);

  // Don't render on policy pages or if no shuffled ads
  if (isPolicyPage || shuffledAds.length === 0) return null;

  const currentAd = shuffledAds[currentAdIndex];
  // Get next ad for desktop (wrap around if at end)
  const nextAd = shuffledAds[(currentAdIndex + 1) % shuffledAds.length];

  // Default spacing based on position
  const defaultSpacing = position === 'top' ? '' : position === 'bottom' ? 'mt-6 mb-4' : 'py-6';

  // Slim banner layout
  if (position === 'slim') {
    return (
      <div className={`w-full overflow-hidden ${className} ${defaultSpacing}`}>
        {/* Mobile (< sm): 1 ad, full width */}
        <div className="sm:hidden w-full">
          <ResponsiveAd
            width={300}
            height={100}
            name={currentAd.id}
            src={currentAd.src}
            title={currentAd.title}
          />
        </div>

        {/* Desktop (≥ sm): 2 ads side by side */}
        <div className="hidden sm:flex w-full">
          <div className="w-1/2">
            <ResponsiveAd
              width={300}
              height={100}
              name={currentAd.id}
              src={currentAd.src}
              title={currentAd.title}
            />
          </div>
          <div className="w-1/2">
            <ResponsiveAd
              width={300}
              height={100}
              name={nextAd.id}
              src={nextAd.src}
              title={nextAd.title}
            />
          </div>
        </div>
      </div>
    );
  }

  // Leaderboard layout — fully responsive, no gaps, full width
  return (
    <div className={`w-full overflow-hidden ${className} ${defaultSpacing}`}>
      {/* Mobile (< sm): 1 slim ad, full width */}
      <div className="sm:hidden w-full">
        <ResponsiveAd
          width={300}
          height={100}
          name={SLIM_BANNER_ADS[currentAdIndex % SLIM_BANNER_ADS.length].id}
          src={SLIM_BANNER_ADS[currentAdIndex % SLIM_BANNER_ADS.length].src}
          title={SLIM_BANNER_ADS[currentAdIndex % SLIM_BANNER_ADS.length].title}
        />
      </div>

      {/* Tablet (sm → lg): Two stacked ads, each full width, no gaps */}
      <div className="hidden sm:flex lg:hidden w-full flex-col">
        <div className="w-full">
          <ResponsiveAd
            width={728}
            height={90}
            name={currentAd.id}
            src={currentAd.src}
            title={currentAd.title}
          />
        </div>
        <div className="w-full">
          <ResponsiveAd
            width={728}
            height={90}
            name={nextAd.id}
            src={nextAd.src}
            title={nextAd.title}
          />
        </div>
      </div>

      {/* Desktop (≥ lg): Two ads side-by-side, each taking half width, no gaps */}
      <div className="hidden lg:flex w-full">
        <div className="w-1/2">
          <ResponsiveAd
            width={728}
            height={90}
            name={currentAd.id}
            src={currentAd.src}
            title={currentAd.title}
          />
        </div>
        <div className="w-1/2">
          <ResponsiveAd
            width={728}
            height={90}
            name={nextAd.id}
            src={nextAd.src}
            title={nextAd.title}
          />
        </div>
      </div>
    </div>
  );
};