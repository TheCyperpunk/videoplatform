/**
 * Import normalized_jilkatha.json into MongoDB "videos" collection
 *
 * Usage:
 *   npx tsx src/scripts/importJilkatha.ts
 */

import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Video from "../models/Video";

const JSON_FILE = path.resolve(
    __dirname,
    "../../../normalized_jilkatha.json"
);

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("No MONGODB_URI in .env");

    console.log("⏳  Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅  Connected");

    const raw = fs.readFileSync(JSON_FILE, "utf-8");
    const records = JSON.parse(raw);
    console.log(`📦  Loaded ${records.length} records from JSON`);

    // Add missing fields that the Video model expects
    const docs = records.map((r: any) => ({
        ...r,
        description: r.description || "",
        trending_rank: r.trending_rank || null,
        scraped_at: r.scraped_at || new Date().toISOString(),
        channel: {
            ...r.channel,
            subscribers: r.channel?.subscribers || 0,
            verified: r.channel?.verified || false,
        },
    }));

    // Use insertMany with ordered:false to skip duplicates
    const result = await Video.insertMany(docs, { ordered: false }).catch(
        (err: any) => {
            // BulkWriteError — some docs may have been inserted
            if (err.code === 11000 || err.insertedDocs) {
                const inserted = err.insertedDocs?.length ?? err.result?.nInserted ?? "some";
                console.log(`⚠️  Duplicate key errors — ${inserted} new docs inserted, duplicates skipped`);
                return err.insertedDocs || [];
            }
            throw err;
        }
    );

    const count = Array.isArray(result) ? result.length : 0;
    console.log(`✅  Inserted ${count} documents into MongoDB`);

    // Verify counts
    const total = await Video.countDocuments();
    console.log(`📊  Total documents in collection: ${total}`);

    const byCat = await Video.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    console.log("📊  By category:", byCat);

    await mongoose.disconnect();
    console.log("🔌  Disconnected");
}

main().catch((err) => {
    console.error("❌  Error:", err);
    process.exit(1);
});
