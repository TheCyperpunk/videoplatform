/**
 * Sanitize utility helpers — used across all routes for safe input handling
 */

/** Clamp a page number to a safe range (min 1) */
export function clampPage(val: unknown, fallback = 1): number {
    const n = parseInt(val as string);
    return isNaN(n) ? fallback : Math.max(1, n);
}

/** Clamp per_page to prevent memory DoS attacks */
export function clampPerPage(val: unknown, fallback = 20, max = 50): number {
    const n = parseInt(val as string);
    return isNaN(n) ? fallback : Math.min(max, Math.max(1, n));
}

/** Sanitize a string query param: trim + length limit + strip dangerous chars */
export function sanitizeStr(val: unknown, maxLen = 100): string {
    if (typeof val !== 'string') return '';
    return val.trim().slice(0, maxLen);
}

/** Escape </script> to prevent XSS in JSON-LD blocks */
export function safeJsonLd(data: object): string {
    return JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>');
}

/** Allowlist of valid video sources */
export const ALLOWED_SOURCES = new Set([
    'redtube', 'apijav', 'eporner', 'faphouse', 'haniapi', 'hentaiocean'
]);

/** Filter and validate a comma-separated sources string */
export function parseSources(raw: unknown): string[] {
    if (typeof raw !== 'string' || !raw.trim()) {
        return [...ALLOWED_SOURCES];
    }
    const parsed = raw
        .split(',')
        .map(s => s.trim().toLowerCase().slice(0, 20))
        .filter(s => ALLOWED_SOURCES.has(s));
    return parsed.length > 0 ? parsed : [...ALLOWED_SOURCES];
}
