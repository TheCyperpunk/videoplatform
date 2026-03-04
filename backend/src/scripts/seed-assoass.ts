import "dotenv/config";
import mongoose from "mongoose";
import crypto from "crypto";
import Video from "../models/Video";

// Load the raw scraped JSON
import rawData from "../../assoass.json";

function parseQuality(q: string): "720p" | "1080p" | "4K" {
    if (q.includes("4K")) return "4K";
    if (q.includes("HD")) return "1080p";
    return "720p";
}

async function seedAssoass() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not set in .env");
        process.exit(1);
    }

    console.log("🔗 Connecting to MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("✅ Connected");

    console.log("🗑️ Clearing existing videos...");
    await Video.deleteMany({});

    console.log(`📥 Parsing ${rawData.data.length} scraped entries from assoass.json...`);

    const videos = rawData.data.map((row: any[]) => {
        // Row mapping based on the JSON structure:
        // 0: URL, 1: Thumbnail, 2: Score, 4: Quality, 5: Duration, 7: Title, 8: Channel Name, 10: PublishedAt
        const title = String(row[7] || "Untitled Video").trim();
        const sourceUrl = String(row[0] || "");
        const thumbnail = String(row[1] || "");
        const qualityStr = String(row[4] || "HD");
        const durationStr = String(row[5] || "0:00");
        const channelName = String(row[8] || "Anonymous");
        const publishedAt = String(row[10] || "Unknown");

        // Generate random engagement stats to make the UI look alive
        const views = Math.floor(Math.random() * 5000000) + 10000;
        const likes = Math.floor(views * (Math.random() * 0.1 + 0.05)); // 5-15% of views

        return {
            id: crypto.randomUUID(), // Generate standard UUID
            title: title.length > 5 ? title : "Exciting Video Title",
            thumbnail: thumbnail,
            duration: durationStr,
            views: views,
            likes: likes,
            publishedAt: publishedAt,
            channel: {
                name: channelName,
                avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${channelName}`, // generic avatar
                subscribers: Math.floor(Math.random() * 1000000) + 5000,
                verified: Math.random() > 0.5,
            },
            category: "adult", // Categorize as adult
            tags: title.toLowerCase().split(" ").filter((w: string) => w.length > 3).slice(0, 5),
            description: `Watch ${title} right now on Videx!`,
            quality: parseQuality(qualityStr),
            trending_rank: Math.random() > 0.8 ? Math.floor(Math.random() * 50) + 1 : null,
            source_url: sourceUrl,
            scraped_at: new Date().toISOString()
        };
    });

    console.log("💾 Inserting transformed videos into MongoDB...");
    await Video.insertMany(videos);

    console.log(`✅ Seeded ${videos.length} videos from assoass.json successfully!`);
    await mongoose.disconnect();
    process.exit(0);
}

seedAssoass().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
