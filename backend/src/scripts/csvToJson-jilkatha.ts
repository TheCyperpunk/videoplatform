/**
 * Convert jilkatha-com-2026-04-03_partial.csv → normalized_jilkatha.json
 *
 * CSV columns:
 *   web_scraper_order, web_scraper_start_url, pagination,
 *   data (title), data2 (views like "526K"), data3 (rating like "88%"),
 *   data4 (duration like "07:10"), image (thumbnail URL),
 *   item_page_title, item_page_link (source_url),
 *   title (clean title), tags (space-separated tag blob),
 *   views ("0 views"), name_6 (category like "Hidden Camera"),
 *   rating_percentage, dislikes, name, name_7, name_4
 *
 * Usage:
 *   npx tsx src/scripts/csvToJson-jilkatha.ts
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongodb";

const CSV_FILE = path.resolve(
    __dirname,
    "../../../jilkatha-com-2026-04-03_partial.csv"
);
const OUT_FILE = path.resolve(
    __dirname,
    "../../../normalized_jilkatha.json"
);

// ── helpers ──────────────────────────────────────────────────────────────────

/** Parse messy views like "828K", "1M", "526K" → number */
function parseViews(raw: string): number {
    if (!raw) return 0;
    const s = raw.trim().toUpperCase().replace(/\s*VIEWS?\s*/i, "");
    if (s.endsWith("M")) return Math.round(parseFloat(s) * 1_000_000);
    if (s.endsWith("K")) return Math.round(parseFloat(s) * 1_000);
    const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
}

/** Parse rating like "88%" → number of likes (0-100 scale) */
function parseLikes(raw: string): number {
    if (!raw) return 0;
    const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    return isNaN(n) ? 0 : n;
}

/** Extract top N meaningful tags from the massive tag blob */
function extractTags(rawTags: string, title: string, category: string): string[] {
    const tags: string[] = [];

    // Always add the category
    tags.push(category.toLowerCase());

    // Extract category-like tags from the beginning of the tag blob
    // (they appear as capitalized multi-word phrases before the lowercase keyword soup)
    const categoryMatches = rawTags.match(/^([A-Z][a-zA-Z\s]+?)(?=\s[a-z])/);
    if (categoryMatches) {
        const cats = categoryMatches[1]
            .split(/(?=[A-Z][a-z])/)
            .map((s) => s.trim())
            .filter((s) => s.length > 2);
        cats.forEach((c) => {
            if (!tags.includes(c.toLowerCase())) {
                tags.push(c.toLowerCase());
            }
        });
    }

    // Add title words as a tag
    if (title && !tags.includes(title.toLowerCase())) {
        tags.push(title);
    }

    // Limit to reasonable number
    return tags.slice(0, 5);
}

/** Map name_6 category to a normalized category */
function normalizeCategory(raw: string): string {
    if (!raw) return "adult";
    const lower = raw.toLowerCase().trim();
    if (lower.includes("hidden camera")) return "adult";
    if (lower.includes("blowjob")) return "adult";
    if (lower.includes("handjob")) return "adult";
    if (lower.includes("anal")) return "adult";
    if (lower.includes("homemade")) return "adult";
    if (lower.includes("aunty")) return "adult";
    if (lower.includes("teen")) return "adult";
    if (lower.includes("masturbat")) return "adult";
    if (lower.includes("threesome")) return "adult";
    if (lower.includes("video call")) return "adult";
    return "adult";
}

/** Guess quality — this CSV doesn't have quality info, default to 720p */
function guessQuality(): string {
    return "720p";
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
                const rawTitle = (row["title"] || row["data"] || "").trim();
                if (!rawTitle) return; // skip empty

                const thumbnail = (row["image"] || "").trim().split("\n")[0]; // first URL only
                const duration  = (row["data4"] || "").trim();
                const views     = parseViews(row["data2"] || "");
                const likes     = parseLikes(row["data3"] || "");
                const sourceUrl = (row["item_page_link"] || "").trim();
                const rawCategory = (row["name_6"] || "").trim();
                const category  = normalizeCategory(rawCategory);
                const rawTags   = (row["tags"] || "").trim();
                const tags      = extractTags(rawTags, rawTitle, rawCategory || "adult");

                const channelSlug = "jilkatha";
                const doc = {
                    _id:         new ObjectId().toHexString(),
                    id:          uuidv4(),
                    title:       rawTitle,
                    thumbnail:   thumbnail || "",
                    duration:    duration || "00:00",
                    views,
                    likes,
                    publishedAt: "Recently",
                    channel: {
                        name:   "Jilkatha",
                        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${channelSlug}`,
                    },
                    category,
                    tags,
                    quality:     guessQuality(),
                    source_url:  sourceUrl,
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
