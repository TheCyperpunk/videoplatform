"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const Video_1 = __importDefault(require("../models/Video"));
async function verify() {
    const uri = process.env.MONGODB_URI;
    if (!uri)
        throw new Error("No MONGODB_URI");
    await mongoose_1.default.connect(uri);
    // Get counts by category
    const counts = await Video_1.default.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);
    console.log("=== DB COUNTS BY CATEGORY ===");
    console.log(counts);
    // Get 1 random adult video and 1 random webseries video
    const adult = await Video_1.default.findOne({ category: "adult" });
    const series = await Video_1.default.findOne({ category: "webseries" });
    console.log("\n=== SAMPLE ADULT VIDEO ===");
    console.log(JSON.stringify(adult, null, 2));
    console.log("\n=== SAMPLE WEBSERIES ===");
    console.log(JSON.stringify(series, null, 2));
    await mongoose_1.default.disconnect();
}
verify().catch(console.error);
