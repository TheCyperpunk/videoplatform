/**
 * Convert 152-42-253-112-2026-03-24-2.csv → normalized_152ip.json
 *
 * CSV columns (row delimited weirdly because of embedded newlines in cells):
 *   web_scraper_order, web_scraper_start_url, pagination,
 *   title, data (views), data2 (duration), rating, data3 (quality/HD),
 *   image (thumbnail), item_page_title, item_page_link (source_url),
 *   post_format, post_type, data_1, duration_1, related_video_1_duration,
 *   image_1, image_2
 *
 * Usage:
 *   npx ts-node -e "require('./src/scripts/csvToJson-152ip')"
 *   OR
 *   npx tsx src/scripts/csvToJson-152ip.ts
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { v4 as uuidv4 } from "uuid";

const CSV_FILE = path.resolve(
    __dirname,
    "../../../152-42-253-112-2026-03-24-2.csv"
);
const OUT_FILE = path.resolve(
    __dirname,
    "../../../normalized_152ip.json"
);

// ── helpers ──────────────────────────────────────────────────────────────────

/** Parse messy views like "828K", "1M", "957K" → number */
function parseViews(raw: string): number {
    if (!raw) return 0;
    const s = raw.trim().toUpperCase();
    if (s.endsWith("M")) return Math.round(parseFloat(s) * 1_000_000);
    if (s.endsWith("K")) return Math.round(parseFloat(s) * 1_000);
    const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
}

/** Return "HD", "FHD" etc or default to "HD" */
function parseQuality(raw: string): string {
    const q = (raw || "").trim();
    return q === "HD" ? "720p" : q || "720p";
}

/** Derive a simple publishedAt estimate from the URL upload date if visible,
 *  otherwise fall back to a generic label */
function guessPublishedAt(): string {
    // The CSV doesn't expose upload dates per row in a clean field.
    return "Recently";
}

/** Derive category from the start URL path segment */
function categoryFromUrl(url: string): string {
    if (!url) return "adult";
    const m = url.match(/152\.42\.253\.112\/([^/?]+)/);
    if (!m) return "adult";
    const slug = m[1].toLowerCase();
    // Mapping known slugs
    if (slug.includes("jilbab") || slug.includes("hijab")) return "desi-mms";
    if (slug.includes("indo") || slug.includes("indonesia")) return "desi-mms";
    if (slug.includes("malaysia") || slug.includes("melayu")) return "desi-mms";
    if (slug.includes("bokep")) return "desi-mms";
    return "adult";
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
    const records: unknown[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(CSV_FILE)
            .pipe(
                parse({
                    columns: true,       // use first row as keys
                    skip_empty_lines: true,
                    relax_quotes: true,
                    relax_column_count: true,
                    trim: true,
                })
            )
            .on("data", (row: Record<string, string>) => {
                const rawTitle = (row["title"] || "").trim();
                if (!rawTitle) return; // skip empty

                const thumbnail = (row["image"] || "").trim().split("\n")[0]; // first URL only
                const duration  = (row["data2"] || "").trim();
                const views     = parseViews(row["data"] || "");
                const quality   = parseQuality(row["data3"] || "HD");
                const sourceUrl = (row["item_page_link"] || "").trim();
                const category  = categoryFromUrl(row["web_scraper_start_url"] || "");

                const channelSlug = "152ip";
                const doc = {
                    id:          uuidv4(),
                    title:       rawTitle,
                    thumbnail:   thumbnail || "",
                    duration:    duration || "00:00",
                    views,
                    likes:       0,
                    publishedAt: guessPublishedAt(),
                    channel: {
                        name:   "IndoBoost",
                        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${channelSlug}`,
                    },
                    category,
                    tags:       [category],
                    quality,
                    source_url: sourceUrl,
                };

                records.push(doc);
            })
            .on("end", () => resolve())
            .on("error", reject);
    });

    fs.writeFileSync(OUT_FILE, JSON.stringify(records, null, 2), "utf-8");
    console.log(`✅  Wrote ${records.length} records → ${OUT_FILE}`);
}

main().catch((err) => {
    console.error("❌  Error:", err);
    process.exit(1);
});
