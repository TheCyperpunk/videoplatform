/**
 * Centralized ad URL registry — single source of truth.
 * Import this in both AdRedirectHandler.tsx and PopupAd.tsx
 * so keys only need to be updated in one place.
 *
 * NOTE: These URLs are client-visible in the JS bundle.
 * If you need true secrecy, proxy through /api/ad-redirect instead.
 */
export const AD_REDIRECT_URLS: string[] = [
    "https://glamournakedemployee.com/bwxr0sb0f?key=35b9e3e9ab1e3b7165f95922fa87c612",
    "https://glamournakedemployee.com/rrbem7g21j?key=6a6f589c48978346e5b670ef0e472b65",
    "https://glamournakedemployee.com/jwfufwksw?key=65946053b497b51d44294a36c841b302",
    "https://glamournakedemployee.com/aupsead1b?key=2f6e98f46e3234ac365b19e8bff99f36",
    "https://glamournakedemployee.com/fhjn8qnh1?key=96f291155918e367dda68ed66097d60b",
    "https://glamournakedemployee.com/zp1767u8?key=1b17903febce387a6b5aa0630cfaeb87",
    "https://glamournakedemployee.com/c8d2i7t4v0?key=569af3711c742b8e987d42c6bb7b9bae",
    "https://glamournakedemployee.com/wj2y1peag?key=f3ad2c0dcb55e1c0977cd8b029c83e2a",
    "https://glamournakedemployee.com/h5dxswbqg?key=2d3a12389e5084f36aff9f70dfeb12cb",
];

/** Returns a random ad redirect URL */
export function getRandomAdUrl(): string {
    return AD_REDIRECT_URLS[Math.floor(Math.random() * AD_REDIRECT_URLS.length)];
}

/**
 * Safely opens a URL in a new tab.
 * - Validates protocol (http/https only — blocks javascript: and data: URIs)
 * - Always adds noopener,noreferrer to prevent tab hijacking
 */
export function safeOpen(url: string): void {
    try {
        const parsed = new URL(url);
        if (['http:', 'https:'].includes(parsed.protocol)) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    } catch {
        // Invalid URL — silently ignore
    }
}
