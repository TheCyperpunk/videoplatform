"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAssoass = normalizeAssoass;
exports.buildVideoDoc = buildVideoDoc;
const uuid_1 = require("uuid");
/**
 * Normalizer for assoass.json
 *
 * Field positions (from "fields" array):
 *  0: "item-link href"  → source_url
 *  1: "item-image src"  → thumbnail
 *  2: "item-score"      → likes (e.g. "47%")
 *  3: "inline-block"    → preview duration (e.g. "1:01") - skip
 *  4: "font-bold"       → quality (e.g. "HD", "4K", "")
 *  5: "font-[100]"      → full duration (e.g. "5:22", "")
 *  6: "menu-item href"  → report url - skip
 *  7: "has-[body 2"     → title
 *  8: "item-source"     → channel name
 *  9: "item-source href"→ channel site  - skip
 * 10: "item-source 2"   → publishedAt (e.g. "1 year ago")
 */
function normalizeAssoass(row) {
    const source_url = (row[0] || "").trim();
    const thumbnail = (row[1] || "").trim();
    const likesPct = (row[2] || "").trim();
    // row[3] = preview clip duration — not useful
    const qualityRaw = (row[4] || "").trim();
    const duration = (row[5] || row[3] || "0:00").trim();
    // row[6] = report URL — skip
    const title = (row[7] || "Untitled Video").trim();
    const channelName = (row[8] || "Unknown").trim();
    // row[9] = channel href — skip
    const publishedAt = (row[10] || "").trim();
    const quality = parseQuality(qualityRaw);
    const likes = parseInt(likesPct.replace("%", ""), 10) || 0;
    return buildVideoDoc({ source_url, thumbnail, title, channelName, publishedAt, duration, quality, likes, source: "assoass.com" });
}
function parseQuality(raw) {
    if (raw === "4K")
        return "4K";
    if (raw === "HD")
        return "1080p";
    return "720p";
}
function buildVideoDoc(fields) {
    const { source_url, thumbnail, title, channelName, publishedAt, duration, quality, likes, source, tags, category, description } = fields;
    const cat = category || "adult";
    return {
        id: (0, uuid_1.v4)(),
        title: title || "Untitled Video",
        thumbnail,
        duration: duration || "0:00",
        views: 0,
        likes,
        publishedAt,
        channel: {
            name: channelName || "Unknown",
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channelName || source)}`,
            subscribers: 0,
            verified: false,
        },
        category: cat,
        tags: tags || [cat],
        description: description || `Watch ${title || "this video"} on Videx!`,
        quality,
        trending_rank: null,
        source_url,
        scraped_at: new Date().toISOString(),
    };
}
