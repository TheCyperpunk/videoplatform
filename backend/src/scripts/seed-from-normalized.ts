/**
 * seed-from-normalized.ts
 *
 * Seeds MongoDB from pre-normalized JSON files.
 * Reads the list of normalized files from normalize-config.json (the "output" paths).
 *
 * Usage:
 *   npx ts-node --transpile-only src/scripts/seed-from-normalized.ts
 */

import "dotenv/config";
import * as fs   from "fs";
import * as path from "path";
import mongoose  from "mongoose";
import Video     from "../models/Video";

const CONFIG_FILE = path.resolve(__dirname, "../../normalize-config.json");

interface Job {
    input: string;
    output: string;
}

async function seedFile(filePath: string): Promise<{ inserted: number; skipped: number; errors: number }> {
    if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  File not found, skipping: ${filePath}`);
        return { inserted: 0, skipped: 0, errors: 0 };
    }

    const data: Record<string, unknown>[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`  📋 ${data.length} records`);

    const bulkOps = data
        .filter((doc) => !!(doc as { source_url?: string }).source_url)
        .map((doc) => ({
            updateOne: {
                filter: { source_url: (doc as { source_url: string }).source_url },
                update:  { $setOnInsert: doc },
                upsert:  true,
            },
        }));

    if (bulkOps.length === 0) {
        console.log(`  ⚠️  No valid docs (missing source_url).`);
        return { inserted: 0, skipped: data.length, errors: 0 };
    }

    const result = await Video.bulkWrite(bulkOps, { ordered: false });
    return {
        inserted: result.upsertedCount,
        skipped:  result.matchedCount,
        errors:   data.length - bulkOps.length,
    };
}

async function main() {
    if (!fs.existsSync(CONFIG_FILE)) {
        console.error(`❌ normalize-config.json not found at: ${CONFIG_FILE}`);
        process.exit(1);
    }

    const config: { jobs: Job[] } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    const normalizedFiles = config.jobs.map((j) => path.resolve(j.output));

    const uri = process.env.MONGODB_URI;
    if (!uri) { console.error("❌ MONGODB_URI not set in .env"); process.exit(1); }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Connected.\n");

    let totalInserted = 0;
    let totalSkipped  = 0;

    for (const filePath of normalizedFiles) {
        console.log(`📂 ${path.basename(filePath)}`);
        const { inserted, skipped, errors } = await seedFile(filePath);
        console.log(`  ✅ Inserted: ${inserted} | Already existed: ${skipped} | Errors: ${errors}\n`);
        totalInserted += inserted;
        totalSkipped  += skipped;
    }

    console.log("─────────────────────────────");
    console.log(`🏁 Total inserted : ${totalInserted}`);
    console.log(`   Total skipped  : ${totalSkipped}`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
