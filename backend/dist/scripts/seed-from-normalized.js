"use strict";
/**
 * seed-from-normalized.ts
 *
 * Seeds MongoDB from pre-normalized JSON files.
 * Reads the list of normalized files from normalize-config.json (the "output" paths).
 *
 * Usage:
 *   npx ts-node --transpile-only src/scripts/seed-from-normalized.ts
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
const CONFIG_FILE = path.resolve(__dirname, "../../normalize-config.json");
async function seedFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  File not found, skipping: ${filePath}`);
        return { inserted: 0, skipped: 0, errors: 0 };
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(`  📋 ${data.length} records`);
    const bulkOps = data
        .filter((doc) => !!doc.source_url)
        .map((doc) => ({
        updateOne: {
            filter: { source_url: doc.source_url },
            update: { $setOnInsert: doc },
            upsert: true,
        },
    }));
    if (bulkOps.length === 0) {
        console.log(`  ⚠️  No valid docs (missing source_url).`);
        return { inserted: 0, skipped: data.length, errors: 0 };
    }
    const result = await Video_1.default.bulkWrite(bulkOps, { ordered: false });
    return {
        inserted: result.upsertedCount,
        skipped: result.matchedCount,
        errors: data.length - bulkOps.length,
    };
}
async function main() {
    if (!fs.existsSync(CONFIG_FILE)) {
        console.error(`❌ normalize-config.json not found at: ${CONFIG_FILE}`);
        process.exit(1);
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    const normalizedFiles = config.jobs.map((j) => path.resolve(j.output));
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not set in .env");
        process.exit(1);
    }
    console.log("🔗 Connecting to MongoDB...");
    await mongoose_1.default.connect(uri);
    console.log("✅ Connected.\n");
    let totalInserted = 0;
    let totalSkipped = 0;
    for (const filePath of normalizedFiles) {
        console.log(`📂 ${path.basename(filePath)}`);
        const { inserted, skipped, errors } = await seedFile(filePath);
        console.log(`  ✅ Inserted: ${inserted} | Already existed: ${skipped} | Errors: ${errors}\n`);
        totalInserted += inserted;
        totalSkipped += skipped;
    }
    console.log("─────────────────────────────");
    console.log(`🏁 Total inserted : ${totalInserted}`);
    console.log(`   Total skipped  : ${totalSkipped}`);
    await mongoose_1.default.disconnect();
    process.exit(0);
}
main().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
