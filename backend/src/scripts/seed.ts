import "dotenv/config";
import mongoose from "mongoose";
import Video from "../models/Video";
import videosData from "../../data/videos.json";

async function seed() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not set in .env");
        process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("✅ Connected");

    console.log("🗑️  Clearing existing videos...");
    await Video.deleteMany({});

    console.log(`📥 Seeding ${videosData.length} videos...`);
    await Video.insertMany(videosData);

    console.log(`✅ Seeded ${videosData.length} videos successfully!`);
    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
