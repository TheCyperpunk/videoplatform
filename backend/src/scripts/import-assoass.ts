/**
 * import-assoass.ts
 *
 * Imports converted assoass JSON data into MongoDB.
 * Uses upsert to avoid duplicates based on source_url.
 *
 * Usage:
 *   npx ts-node --transpile-only src/scripts/import-assoass.ts
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import mongoose from "mongoose";
import Video from "../models/Video";

const CONVERTED_FILE = path.resolve(__dirname, "../../../converted-assoass.json");

async function importAssoassData(): Promise<{ inserted: number; skipped: number; errors: number }> {
    if (!fs.existsSync(CONVERTED_FILE)) {
        console.error(`❌ File not found: ${CONVERTED_FILE}`);
        process.exit(1);
    }

    console.log(`📂 Reading: ${path.basename(CONVERTED_FILE)}`);
    const data: Record<string, unknown>[] = JSON.parse(fs.readFileSync(CONVERTED_FILE, "utf-8"));
    console.log(`  📋 ${data.length} records found`);

    // Filter out records without source_url
    const bulkOps = data
        .filter((doc) => !!(doc as { source_url?: string }).source_url)
        .map((doc) => ({
            updateOne: {
                filter: { source_url: (doc as { source_url: string }).source_url },
                update: { $setOnInsert: doc },
                upsert: true,
            },
        }));

    if (bulkOps.length === 0) {
        console.log(`  ⚠️  No valid docs (missing source_url).`);
        return { inserted: 0, skipped: data.length, errors: 0 };
    }

    console.log(`  🔄 Upserting ${bulkOps.length} videos...`);
    const result = await Video.bulkWrite(bulkOps, { ordered: false });

    return {
        inserted: result.upsertedCount,
        skipped: result.matchedCount,
        errors: data.length - bulkOps.length,
    };
}

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not set in .env");
        process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Connected.\n");

    const { inserted, skipped, errors } = await importAssoassData();

    console.log("\n─────────────────────────────");
    console.log(`✅ Inserted (new)    : ${inserted}`);
    console.log(`⏭️  Skipped (existing): ${skipped}`);
    console.log(`❌ Errors            : ${errors}`);
    console.log("─────────────────────────────");

    await mongoose.disconnect();
    console.log("\n✅ Import complete!");
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Import failed:", err);
    process.exit(1);
});
