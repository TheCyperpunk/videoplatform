import { buildVideoDoc } from "./normalizeAssoass";

/**
 * Normalizer for dinotube (2).json
 *
 * Field positions (from "fields" array):
 *  0: "item-link href"  → source_url
 *  1: "item-image src"  → thumbnail
 *  2: "item-score"      → likes (e.g. "55%")
 *  3: "inline-block"    → duration (e.g. "3:15")
 *  4: "menu-item href"  → report url - skip
 *  5: "has-[body 2"     → title
 *  6: "item-source"     → channel name
 *  7: "item-source href"→ channel site - skip
 *  8: "item-source 2"   → publishedAt (e.g. "7 years ago")
 *  9: "font-bold"       → quality (e.g. "HD", "4K", "")
 * 10: "font-[100]"      → full duration (alternative) - skip
 *
 * NOTE: dinotube differs from assoass in that quality (font-bold) is at index 9
 * and the full duration (font-[100]) is at index 10.
 */
export function normalizeDinotube(row: string[]): object {
    const source_url  = (row[0] || "").trim();
    const thumbnail   = (row[1] || "").trim();
    const likesPct    = (row[2] || "").trim();
    const duration    = (row[3] || "0:00").trim();
    // row[4] = report URL — skip
    const title       = (row[5] || "Untitled Video").trim();
    const channelName = (row[6] || "Unknown").trim();
    // row[7] = channel href — skip
    const publishedAt = (row[8] || "").trim();
    const qualityRaw  = (row[9] || "").trim();

    const quality = parseQuality(qualityRaw);
    const likes   = parseInt(likesPct.replace("%", ""), 10) || 0;

    return buildVideoDoc({ source_url, thumbnail, title, channelName, publishedAt, duration, quality, likes, source: "dinotube.com" });
}

function parseQuality(raw: string): "720p" | "1080p" | "4K" {
    if (raw === "4K") return "4K";
    if (raw === "HD") return "1080p";
    return "720p";
}
