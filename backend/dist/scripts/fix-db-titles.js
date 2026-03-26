"use strict";
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
const mongoose_1 = __importDefault(require("mongoose"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Video_1 = __importDefault(require("../models/Video"));
const INPUT_JSON = path.resolve(__dirname, "../../normalized_auntymaza.json");
async function main() {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose_1.default.connect(process.env.MONGODB_URI);
    console.log("✅ Connected.\n");
    const data = JSON.parse(fs.readFileSync(INPUT_JSON, "utf-8"));
    console.log(`📋 Found ${data.length} records in normalized JSON.`);
    let updated = 0;
    // Create bulk updates
    // We match on source_url since that is unique for each scraped video
    const bulkOps = data.map((doc) => ({
        updateOne: {
            filter: { source_url: doc.source_url },
            update: { $set: { title: doc.title, tags: doc.tags } }
        }
    }));
    if (bulkOps.length > 0) {
        console.log(`Executing ${bulkOps.length} bulk updates...`);
        const result = await Video_1.default.bulkWrite(bulkOps, { ordered: false });
        updated = result.modifiedCount;
    }
    console.log(`✅ Successfully updated ${updated} records in the database.`);
    await mongoose_1.default.disconnect();
    process.exit(0);
}
main().catch((err) => {
    console.error("❌ Failed:", err);
    process.exit(1);
});
