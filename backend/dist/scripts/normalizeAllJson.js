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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const normalizers_1 = require("../utils/normalizers");
async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.error("Usage: npx ts-node src/scripts/normalizeAllJson.ts <input_file.json> <output_file.json>");
        process.exit(1);
    }
    const inputPath = path.resolve(args[0]);
    const outputPath = path.resolve(args[1]);
    if (!fs.existsSync(inputPath)) {
        console.error(`Error: Input file not found at ${inputPath}`);
        process.exit(1);
    }
    try {
        console.log(`Reading: ${inputPath}`);
        const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
        let dataArray = Array.isArray(rawData) ? rawData : (rawData.data || rawData.videos || [rawData]);
        if (!Array.isArray(dataArray)) {
            console.error("Error: Input JSON must be an array or contain a 'data'/'videos' array");
            process.exit(1);
        }
        const sourceType = (0, normalizers_1.detectSourceType)(inputPath);
        console.log(`Detected source type: ${sourceType}`);
        console.log(`Normalizing ${dataArray.length} items...`);
        const normalizedData = dataArray.map(item => {
            try {
                return (0, normalizers_1.normalize)(item, sourceType);
            }
            catch (err) {
                console.warn(`Warning: Could not normalize an item, skipping. Error: ${err.message}`);
                return null;
            }
        }).filter(Boolean); // remove any nulls
        fs.writeFileSync(outputPath, JSON.stringify(normalizedData, null, 2), "utf-8");
        console.log(`✅ Success! Wrote ${normalizedData.length} normalized items to ${outputPath}`);
    }
    catch (err) {
        console.error("Failed to process file:", err);
        process.exit(1);
    }
}
main();
