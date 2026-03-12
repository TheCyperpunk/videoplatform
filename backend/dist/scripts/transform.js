"use strict";
/**
 * transform.ts
 *
 * Converts the new scraped video JSON (with CSS class-style keys) into
 * the proper Video schema format that the app expects.
 *
 * Usage:
 *   npx ts-node src/scripts/transform.ts <input.json> <output.json>
 *
 * Example:
 *   npx ts-node src/scripts/transform.ts data/scraped_raw.json data/scraped_clean.json
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
// ── Field mapping: scraped key → Video schema key ─────────────────────────
// Adjust these if your scraper uses slightly different class names
const FIELD_MAP = {
    "item-link href": "source_url",
    "item-image src": "thumbnail",
    "inline-block": "duration",
    "has-[body 2": "title", // title text
    "item-source": "channel_name",
    "item-source href": "_channel_site", // internal, used only for context
    "item-source 2": "publishedAt",
    "font-bold": "quality",
    "item-score": "likes_pct", // e.g. "58%" — stored in description
    "menu-item href": "_report_url", // not used in schema, skip
    "font-[100]": "_extra", // not used
};
function formatDuration(raw) {
    // raw is already "3:23" style — pass through; default if empty
    return raw?.trim() || "0:00";
}
function guessCategory(title) {
    const t = (title || "").toLowerCase();
    if (t.includes("arab") || t.includes("egyptian") || t.includes("tunisian"))
        return "adult";
    return "adult"; // default for this scraped source
}
function transformDoc(raw) {
    const title = (raw["has-[body 2"] || "").trim();
    const thumbnail = (raw["item-image src"] || "").trim();
    const source_url = (raw["item-link href"] || "").trim();
    const duration = formatDuration(raw["inline-block"]);
    const publishedAt = (raw["item-source 2"] || "").trim();
    const channelName = (raw["item-source"] || "Unknown").trim();
    const quality = (raw["font-bold"] || "HD").trim() === "HD" ? "1080p" : "720p";
    const likesPct = (raw["item-score"] || "").trim();
    const category = guessCategory(title);
    // Build a synthetic view count from the like percentage string (e.g. "58%")
    const likePctNum = parseInt(likesPct.replace("%", ""), 10) || 0;
    return {
        id: (0, uuid_1.v4)(),
        title: title || "Untitled",
        thumbnail: thumbnail,
        duration: duration,
        views: 0,
        likes: likePctNum,
        publishedAt,
        channel: {
            name: channelName,
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(channelName)}`,
            subscribers: 0,
            verified: false,
        },
        category,
        tags: [category],
        description: `Watch ${title || "this video"} on Videx! (Rating: ${likesPct})`,
        quality,
        trending_rank: null,
        source_url,
        scraped_at: new Date().toISOString(),
    };
}
// ── Main ──────────────────────────────────────────────────────────────────
const [, , inputArg, outputArg] = process.argv;
if (!inputArg || !outputArg) {
    console.error("Usage: npx ts-node src/scripts/transform.ts <input.json> <output.json>");
    process.exit(1);
}
const inputPath = path.resolve(inputArg);
const outputPath = path.resolve(outputArg);
if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
}
console.log(`📂 Reading: ${inputPath}`);
const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
if (!Array.isArray(rawData)) {
    console.error("❌ Input file must be a JSON array.");
    process.exit(1);
}
// Filter out docs that already have the correct schema (have a proper `title` key)
const newFormat = rawData.filter(doc => !doc.title && (doc["has-[body 2"] || doc["item-image src"]));
const oldFormat = rawData.filter(doc => doc.title && doc.thumbnail);
console.log(`ℹ️  Found ${oldFormat.length} already-correct docs and ${newFormat.length} docs needing transform.`);
const transformed = newFormat.map(transformDoc);
const combined = [...oldFormat, ...transformed];
fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2), "utf-8");
console.log(`✅ Done! ${combined.length} total docs written to: ${outputPath}`);
console.log(`   → ${oldFormat.length} kept as-is`);
console.log(`   → ${newFormat.length} transformed from new scraped format`);
