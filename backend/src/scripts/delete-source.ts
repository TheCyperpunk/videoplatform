/**
 * delete-source.ts
 *
 * Deletes all Video documents from MongoDB that match a given source URL pattern.
 *
 * Usage:
 *   npx ts-node src/scripts/delete-source.ts <source-pattern>
 *
 * Examples:
 *   npx ts-node src/scripts/delete-source.ts uncutmaza.com.co
 *   npx ts-node src/scripts/delete-source.ts desihub.org
 *   npx ts-node src/scripts/delete-source.ts assoass.com
 *   npx ts-node src/scripts/delete-source.ts dinotube.com
 */

import "dotenv/config";
import mongoose from "mongoose";
import Video from "../models/Video";

async function main() {
    const [,, pattern] = process.argv;

    if (!pattern) {
        console.error("❌ Usage: npx ts-node src/scripts/delete-source.ts <source-pattern>");
        console.error("   Example: npx ts-node src/scripts/delete-source.ts uncutmaza.com.co");
        process.exit(1);
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not set in .env");
        process.exit(1);
    }

    console.log(`🔗 Connecting to MongoDB...`);
    await mongoose.connect(uri);
    console.log(`✅ Connected.`);

    // Count first
    const count = await Video.countDocuments({ source_url: { $regex: pattern, $options: "i" } });
    console.log(`🔍 Found ${count} documents matching pattern: "${pattern}"`);

    if (count === 0) {
        console.log("⚠️  Nothing to delete.");
        await mongoose.disconnect();
        process.exit(0);
    }

    const result = await Video.deleteMany({ source_url: { $regex: pattern, $options: "i" } });
    console.log(`✅ Deleted ${result.deletedCount} documents.`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Delete failed:", err);
    process.exit(1);
});
