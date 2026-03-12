import { buildVideoDoc } from "./normalizeAssoass";

/**
 * Normalizer for desihub.json (simplest format - only 3 fields!)
 *
 * Field positions (from "fields" array):
 *  0: "transform href"   → source_url
 *  1: "object-cover src" → thumbnail
 *  2: "text-sm"          → title
 *
 * No duration, no channel, no publishedAt — fill in sensible defaults.
 */
export function normalizeDesihub(row: string[]): object {
    const source_url = (row[0] || "").trim();
    const thumbnail  = (row[1] || "").trim();
    const title      = (row[2] || "Untitled").trim();

    return buildVideoDoc({
        source_url,
        thumbnail,
        title,
        channelName: "DesiHub",
        publishedAt: "",
        duration: "0:00",
        quality: "1080p",
        likes: 0,
        source: "desihub.org",
        tags: ["desi", "desihub", "indian"],
        category: "adult",
        description: `Watch ${title} on Videx!`,
    });
}
