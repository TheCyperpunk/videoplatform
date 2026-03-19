import "dotenv/config";
import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";
import Video from "../models/Video";

const INPUT_JSON = path.resolve(__dirname, "../../normalized_auntymaza.json");

async function main() {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected.\n");

    const data = JSON.parse(fs.readFileSync(INPUT_JSON, "utf-8"));
    console.log(`📋 Found ${data.length} records in normalized JSON.`);

    let updated = 0;
    
    // Create bulk updates
    // We match on source_url since that is unique for each scraped video
    const bulkOps = data.map((doc: any) => ({
        updateOne: {
            filter: { source_url: doc.source_url },
            update: { $set: { title: doc.title, tags: doc.tags } }
        }
    }));

    if (bulkOps.length > 0) {
        console.log(`Executing ${bulkOps.length} bulk updates...`);
        const result = await Video.bulkWrite(bulkOps, { ordered: false });
        updated = result.modifiedCount;
    }

    console.log(`✅ Successfully updated ${updated} records in the database.`);
    
    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
});
