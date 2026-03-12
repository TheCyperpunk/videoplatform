"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUncutmazaSimple = normalizeUncutmazaSimple;
const normalizeAssoass_1 = require("./normalizeAssoass");
/**
 * Normalizer for uncutmaza.json (simple format, NO thumbnail!)
 *
 * Field positions (from "fields" array):
 *  0: "video href" → source_url
 *  1: "time"       → duration (e.g. "18:00")
 *  2: "ago"        → publishedAt (e.g. "2 Hr Ago")
 *  3: "vtitle"     → title
 *
 * Since there is no thumbnail, we use a placeholder.
 */
function normalizeUncutmazaSimple(row) {
    const source_url = (row[0] || "").trim();
    const duration = (row[1] || "0:00").trim();
    const publishedAt = (row[2] || "").trim();
    const title = (row[3] || "Untitled Episode").trim();
    return (0, normalizeAssoass_1.buildVideoDoc)({
        source_url,
        thumbnail: "", // No thumbnail in this format
        title,
        channelName: "Uncutmaza",
        publishedAt,
        duration,
        quality: "1080p",
        likes: 0,
        source: "uncutmaza.com.co",
        tags: ["webseries", "hindi", "uncutmaza"],
        category: "webseries",
        description: `Watch ${title} on Videx!`,
    });
}
