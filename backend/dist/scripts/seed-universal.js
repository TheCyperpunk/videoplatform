"use strict";
/**
 * seed-universal.ts
 *
 * A single seed script that handles ALL scraped JSON formats.
 *
 * Usage:
 *   npx ts-node src/scripts/seed-universal.ts <input.json> [sourceType]
 *
 * Examples:
 *   npx ts-node src/scripts/seed-universal.ts assoass.json assoass
 *   npx ts-node src/scripts/seed-universal.ts "dinotube (2).json" dinotube
 *   npx ts-node src/scripts/seed-universal.ts uncutmaza.json uncutmaza-simple
 *   npx ts-node src/scripts/seed-universal.ts uncutmaza-com-co-2026-03-07-2.json uncutmaza-rich
 *   npx ts-node src/scripts/seed-universal.ts desihub.json desihub
 *
 * If you omit sourceType, it will AUTO-DETECT based on the filename.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const Video_1 = __importDefault(require("../models/Video"));
const normalizers_1 = require("../utils/normalizers");
async function main() {
    const [, , inputArg, sourceTypeArg] = process.argv;
    if (!inputArg) {
        console.error("❌ Usage: npx ts-node src/scripts/seed-universal.ts <input.json> [sourceType]");
        console.error("   sourceType options: assoass | dinotube | uncutmaza-simple | uncutmaza-rich | desihub");
        process.exit(1);
    }
    const inputPath = path.resolve(inputArg);
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ File not found: ${inputPath}`);
        process.exit(1);
    }
    // Detect or use explicit source type
    const sourceType = sourceTypeArg || (0, normalizers_1.detectSourceType)(path.basename(inputPath));
    console.log(`📂 Input file : ${inputPath}`);
    console.log(`🔍 Source type: ${sourceType}`);
    // Parse the JSON
    const rawFile = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
    // Extract the rows/docs depending on file shape
    let items;
    if (Array.isArray(rawFile)) {
        // uncutmaza-rich format: top-level array of objects
        items = rawFile;
    }
    else if (rawFile.data && Array.isArray(rawFile.data)) {
        // assoass / dinotube / uncutmaza-simple / desihub: { fields, data: [] }
        items = rawFile.data;
    }
    else {
        console.error("❌ Unrecognized JSON structure. Expected a top-level array or { data: [] }.");
        process.exit(1);
    }
    console.log(`📋 Found ${items.length} records to process.`);
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not set in .env");
        process.exit(1);
    }
    console.log("🔗 Connecting to MongoDB...");
    await mongoose_1.default.connect(uri);
    console.log("✅ Connected.");
    // Normalize each row and build bulk upsert ops
    let skipped = 0;
    const bulkOps = items
        .map((item) => {
        try {
            return (0, normalizers_1.normalize)(item, sourceType);
        }
        catch (e) {
            skipped++;
            return null;
        }
    })
        .filter((doc) => doc !== null && !!doc.source_url)
        .map((doc) => ({
        updateOne: {
            filter: { source_url: doc.source_url },
            update: { $setOnInsert: doc },
            upsert: true,
        },
    }));
    if (bulkOps.length === 0) {
        console.log("⚠️  No valid documents to insert.");
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    console.log(`💾 Upserting ${bulkOps.length} documents (${skipped} skipped)...`);
    const result = await Video_1.default.bulkWrite(bulkOps, { ordered: false });
    console.log(`✅ Done!`);
    console.log(`   Inserted : ${result.upsertedCount}`);
    console.log(`   Matched  : ${result.matchedCount} (already existed, skipped)`);
    await mongoose_1.default.disconnect();
    process.exit(0);
}
main().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
