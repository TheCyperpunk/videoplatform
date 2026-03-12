"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeUncutmazaRich = normalizeUncutmazaRich;
const normalizeAssoass_1 = require("./normalizeAssoass");
/**
 * Normalizer for uncutmaza-com-co-2026-03-07-2.json (rich object format)
 *
 * Each record is an OBJECT with named fields:
 *   title, series, slug, thumbnail, redirect_url, platform,
 *   source_site, source_tag, models, tags, duration_seconds,
 *   uploaded_ago, related_episodes, scraped_at, status
 */
function normalizeUncutmazaRich(doc) {
    const source_url = (doc.redirect_url || "").trim();
    const thumbnail = (doc.thumbnail || "").trim();
    const title = (doc.title || "Untitled Episode").trim();
    const channelName = (doc.platform || "Uncutmaza").trim();
    const publishedAt = (doc.uploaded_ago || "").trim();
    const duration = formatSeconds(doc.duration_seconds);
    const tags = Array.isArray(doc.tags) ? doc.tags : ["webseries"];
    const modelsList = Array.isArray(doc.models) ? doc.models : [];
    const description = modelsList.length > 0
        ? `Watch ${title} featuring ${modelsList.join(", ")} on Videx!`
        : `Watch ${title} on Videx!`;
    return (0, normalizeAssoass_1.buildVideoDoc)({
        source_url,
        thumbnail,
        title,
        channelName,
        publishedAt,
        duration,
        quality: "1080p",
        likes: 0,
        source: "uncutmaza.com.co",
        tags: [...tags, "webseries"],
        category: "webseries",
        description,
    });
}
function formatSeconds(seconds) {
    if (!seconds || typeof seconds !== "number")
        return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
}
