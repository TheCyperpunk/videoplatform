/**
 * csvToJson-auntymaza.ts
 *
 * Converts auntymaza-forum CSV → JSON in the Videx Video format.
 *
 * CSV columns (0-indexed):
 *   0  web_scraper_order
 *   1  web_scraper_start_url
 *   2  pagination
 *   3  title
 *   4  data           (huge multiline HTML - used to extract publishedAt)
 *   5  image          → thumbnail
 *   6  item_page_title
 *   7  item_page_link → source_url
 *   8  keywords_1     → tags
 *   9  title_2
 *  10  name
 *  11  articleSection_2 → category
 *  12  keywords_2
 *  13  title_1
 *  14  width
 *
 * Usage:
 *   npx ts-node --transpile-only src/scripts/csvToJson-auntymaza.ts
 *
 * Output:
 *   backend/normalized_auntymaza.json
 */

import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { v4 as uuidv4 } from "uuid";

// ── Config ────────────────────────────────────────────────────────────────────
const INPUT_CSV  = path.resolve(__dirname, "../../auntymaza-forum-2026-03-12-2_partial (2).csv");
const OUTPUT_JSON = path.resolve(__dirname, "../../normalized_auntymaza.json");

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map articleSection_2 raw strings → clean category slugs */
function mapCategory(raw: string): string {
    if (!raw) return "adult";
    const r = raw.toLowerCase().trim();
    if (r.includes("web series") || r.includes("webseries")) return "web-series";
    if (r.includes("short film"))  return "short-film";
    if (r.includes("live show"))   return "live-show";
    if (r.includes("desi mms"))    return "desi-mms";
    if (r.includes("desi x"))      return "desi-x";
    if (r.includes("desi amateur"))return "desi-amateur";
    if (r.includes("bangladeshi")) return "bangladeshi";
    if (r.includes("pakistani"))   return "pakistani";
    if (r.includes("sri lankan"))  return "sri-lankan";
    if (r.includes("big boobs"))   return "big-boobs";
    if (r.includes("chamet"))      return "chamet";
    if (r.includes("model"))       return "model";
    if (r.includes("indian porn")) return "indian-porn";
    if (r.includes("xxx"))         return "xxx";
    if (r.includes("solo"))        return "solo";
    return "adult"; // fallback
}

/** Extract "Added X ago" from the messy data blob */
function extractPublishedAt(data: string): string {
    const match = data.match(/Added\s+([\w\s]+ago)/i);
    if (match) return match[1].trim();
    return "";
}

/** Turn comma-separated keyword strings into a clean tag array */
function parseTags(keywords1: string, keywords2: string, title: string): string[] {
    const raw = [keywords1, keywords2].join(",");
    const tags = raw
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && t.toLowerCase() !== "auntymaza");

    // Always include channel name and a derived content tag
    if (tags.length === 0 && title) {
        tags.push("adult");
    }
    return [...new Set(tags)]; // deduplicate
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    if (!fs.existsSync(INPUT_CSV)) {
        console.error(`❌ CSV not found: ${INPUT_CSV}`);
        process.exit(1);
    }

    console.log(`📂 Reading: ${path.basename(INPUT_CSV)}`);

    const results: object[] = [];
    let rowIndex = 0;
    let skipped  = 0;

    const parser = fs
        .createReadStream(INPUT_CSV)
        .pipe(
            parse({
                columns: true,         // first row is headers
                relax_quotes: true,    // allow relaxed quoting
                relax_column_count: true,
                skip_empty_lines: true,
                trim: false,           // keep raw values; we trim manually
            })
        );

    for await (const record of parser) {
        rowIndex++;

        let title        = (record["title_2"]            || record["title_1"] || record["title"] || "").toString().trim();
        // Remove newlines from title
        title = title.split('\n')[0].trim();
        
        const thumbnail  = (record["image"]              || "").trim();
        const sourceUrl  = (record["item_page_link"]     || "").trim();
        const rawCat     = (record["articleSection_2"]   || "").trim();
        
        let keywords1  = (record["keywords_1"]         || "").toString().trim();
        let keywords2  = (record["keywords_2"]         || "").toString().trim();
        // Clean newlines
        keywords1 = keywords1.split('\n')[0].trim();
        keywords2 = keywords2.split('\n')[0].trim();
        
        const dataBlob   = (record["data"]               || "");

        // Skip rows with no usable data
        if (!sourceUrl) { skipped++; continue; }

        let tags = parseTags(keywords1, keywords2, title);

        // Fix for "Auntymaza" titles: if title is just the site name, use the first valid tag as title
        if ((!title || title.toLowerCase() === "auntymaza" || title.toLowerCase() === "home") && tags.length > 0) {
            title = tags[0];
            // optionally remove it from tags, but keeping it is fine too
        }

        if (!title && !sourceUrl) { skipped++; continue; }

        const category    = mapCategory(rawCat);
        const publishedAt = extractPublishedAt(dataBlob);

        results.push({
            id:          uuidv4(),
            title,
            thumbnail,
            duration:    "15:00", // Defaulting duration as per other scripts if missing
            views:       0,
            likes:       0,
            publishedAt: publishedAt || "1 month ago",
            channel: {
                name:        "Auntymaza",
                avatar:      "https://api.dicebear.com/7.x/identicon/svg?seed=Auntymaza",
            },
            category,
            tags,
            quality:     "1080p", // Standardized to 1080p
            source_url:  sourceUrl,
        });

        if (rowIndex % 500 === 0) {
            process.stdout.write(`\r  ⏳ Processed ${rowIndex} rows, ${results.length} valid…`);
        }
    }

    console.log(`\n\n✅ Total rows seen : ${rowIndex}`);
    console.log(`   Valid records   : ${results.length}`);
    console.log(`   Skipped         : ${skipped}`);
    console.log(`\n💾 Writing → ${path.basename(OUTPUT_JSON)} …`);

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(results, null, 2), "utf-8");
    console.log("🏁 Done!");
}

main().catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
});
