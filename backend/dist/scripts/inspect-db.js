"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
async function main() {
    const uri = process.env.MONGODB_URI;
    await mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection.db;
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log("=== ALL COLLECTIONS ===");
    for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        const sample = await db.collection(col.name).findOne({});
        const keys = sample ? Object.keys(sample).join(", ") : "empty";
        console.log(`  [${col.name}] count=${count} keys: ${keys.slice(0, 120)}`);
    }
    await mongoose_1.default.disconnect();
}
main().catch(console.error);
