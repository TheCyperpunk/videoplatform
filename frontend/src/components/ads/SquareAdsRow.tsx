"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// ─── Ad inventory ─────────────────────────────────────────────────────────────

export const ADS_300x250 = [
  { id: "sq300_1",  src: "https://a.adtng.com/get/10001807?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_2",  src: "https://a.adtng.com/get/10002808?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_3",  src: "https://a.adtng.com/get/10001808?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_4",  src: "https://a.adtng.com/get/10001813?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_5",  src: "https://a.adtng.com/get/10002808?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_6",  src: "https://a.adtng.com/get/10006955?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_7",  src: "https://a.adtng.com/get/10005507?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_8",  src: "https://a.adtng.com/get/10007972?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_9",  src: "https://a.adtng.com/get/10008039?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_10", src: "https://a.adtng.com/get/10002799?ata=Malludesi", w: 300, h: 250 },
  { id: "sq300_11", src: "https://a.adtng.com/get/10001807?ata=Malludesi", w: 300, h: 250 },
];

export const ADS_315x300 = [
  { id: "sq315_1",  src: "https://a.adtng.com/get/10001816?ata=Malludesi", w: 315, h: 300 },
  { id: "sq315_2",  src: "https://a.adtng.com/get/10002488?ata=Malludesi", w: 315, h: 300 },
  { id: "sq315_3",  src: "https://a.adtng.com/get/10002798?ata=Malludesi", w: 315, h: 300 },
  { id: "sq315_4",  src: "https://a.adtng.com/get/10005511?ata=Malludesi", w: 315, h: 300 },
  { id: "sq315_5",  src: "https://a.adtng.com/get/10005508?ata=Malludesi", w: 315, h: 300 },
  { id: "sq315_6",  src: "https://a.adtng.com/get/10008041?ata=Malludesi", w: 315, h: 300 },
  { id: "sq315_7",  src: "https://a.adtng.com/get/10002484?ata=Malludesi", w: 315, h: 300 },
  { id: "sq315_8",  src: "https://a.adtng.com/get/10002486?ata=Malludesi", w: 315, h: 300 },
];

// ─── Responsive iframe cell ───────────────────────────────────────────────────
// Uses padding-bottom aspect-ratio trick: height = 0, padBottom = (h/w)*100%
// The iframe is absolutely positioned to fill that container perfectly.
interface AdCellProps {
  id: string;
  src: string;
  w: number;
  h: number;
  title?: string;
}

const AdCell: React.FC<AdCellProps> = ({ id, src, w, h, title }) => (
  <div
    style={{
      width: '100%',
      paddingBottom: `${(h / w) * 100}%`,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <iframe
      name={id}
      src={src}
      title={title ?? id}
      width={w}
      height={h}
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
        outline: 'none',
        backgroundColor: 'transparent',
      }}
    />
  </div>
);

// ─── SquareAdsRow ─────────────────────────────────────────────────────────────
// variant  : '300x250' | '315x300'  → which ad pool to draw from
// startIndex: which ad in the pool to start from (0-based)
//
// Layout:
//   Desktop (≥ sm): 4 ads in a single row   → grid-cols-4
//   Mobile  (< sm): 2×2 grid               → grid-cols-2
//
// Every cell in the row uses the same ad dimensions so aspect ratios are uniform.

export type SquareAdVariant = '300x250' | '315x300';

interface SquareAdsRowProps {
  variant?: SquareAdVariant;
  /** 0-based index into the chosen ad pool (wraps around). Default 0. */
  startIndex?: number;
  className?: string;
}

export const SquareAdsRow: React.FC<SquareAdsRowProps> = ({
  variant = '300x250',
  startIndex = 0,
  className = '',
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentStartIndex, setCurrentStartIndex] = useState(startIndex);
  const [shuffledPool, setShuffledPool] = useState<typeof ADS_300x250>([]);
  
  // Don't show on policy pages
  const policyPages = ["/terms", "/contact", "/privacy", "/dmca"];
  const isPolicyPage = policyPages.includes(pathname);
  
  if (isPolicyPage) return null;
  
  const pool = variant === '315x300' ? ADS_315x300 : ADS_300x250;

  // Shuffle ads array
  const shuffleArray = (array: typeof ADS_300x250 | typeof ADS_315x300) => {
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
    
    const shuffled = shuffleArray(pool);
    setShuffledPool(shuffled as typeof ADS_300x250);
    setCurrentStartIndex(0);
  }, [pathname, searchParams, isPolicyPage, variant]);

  // Auto-rotate ads every 30 seconds
  useEffect(() => {
    if (isPolicyPage || shuffledPool.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStartIndex((prevIndex) => {
        // Move to next set of 4 ads, wrapping around
        const nextIndex = (prevIndex + 4) % shuffledPool.length;
        return nextIndex;
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isPolicyPage, shuffledPool.length]);

  // Don't render if no shuffled ads
  if (shuffledPool.length === 0) return null;

  // Pick 4 ads starting from currentStartIndex, wrapping around the shuffled pool
  const ads = Array.from({ length: 4 }, (_, i) => shuffledPool[(currentStartIndex + i) % shuffledPool.length]);

  return (
    <div
      className={`w-full grid grid-cols-2 sm:grid-cols-4 gap-0 ${className}`}
      aria-label={`Ad row — ${variant}`}
    >
      {ads.map((ad) => (
        <AdCell
          key={ad.id}
          id={ad.id}
          src={ad.src}
          w={ad.w}
          h={ad.h}
          title={`${variant} ad`}
        />
      ))}
    </div>
  );
};

// ─── Convenience presets ──────────────────────────────────────────────────────
// Ready-to-use ad row instances for each insertion point.
//
// Desktop placement  (6-column grid, ~20 rows):
//   <SquareAdsRow300_D1 />  → after content row 4
//   <SquareAdsRow315_D2 />  → after content row 12
//
// Mobile placement   (2-column grid, ~60 rows):
//   <SquareAdsRow300_M1 />  → after content row 6
//   <SquareAdsRow300_M2 />  → after content row 16
//   <SquareAdsRow315_M3 />  → after content row 30
//   <SquareAdsRow315_M4 />  → after content row 48

/** Desktop row 1 — 300×250, ads #1-4 */
export const SquareAdsRow300_D1 = () => <SquareAdsRow variant="300x250" startIndex={0} />;

/** Desktop row 2 — 315×300, ads #1-4 */
export const SquareAdsRow315_D2 = () => <SquareAdsRow variant="315x300" startIndex={0} />;

/** Mobile row 1 — 300×250, ads #1-4 */
export const SquareAdsRow300_M1 = () => <SquareAdsRow variant="300x250" startIndex={0} />;

/** Mobile row 2 — 300×250, ads #5-8 */
export const SquareAdsRow300_M2 = () => <SquareAdsRow variant="300x250" startIndex={4} />;

/** Mobile row 3 — 315×300, ads #1-4 */
export const SquareAdsRow315_M3 = () => <SquareAdsRow variant="315x300" startIndex={0} />;

/** Mobile row 4 — 315×300, ads #5-8 */
export const SquareAdsRow315_M4 = () => <SquareAdsRow variant="315x300" startIndex={4} />;
