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
const CONFIG_FILE = path.resolve(__dirname, "../../normalize-config.json");
function processJob(job) {
    const inputPath = path.resolve(job.input);
    const outputPath = path.resolve(job.output);
    if (!fs.existsSync(inputPath)) {
        console.error(`  ❌ Input file not found: ${inputPath}`);
        return;
    }
    try {
        const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
        const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || rawData.videos || [rawData]);
        const sourceType = (0, normalizers_1.detectSourceType)(inputPath);
        console.log(`  Source type: "${sourceType}", Items: ${dataArray.length}`);
        let skipped = 0;
        const normalizedData = dataArray.map((item, i) => {
            try {
                return (0, normalizers_1.normalize)(item, sourceType);
            }
            catch (err) {
                skipped++;
                if (skipped <= 3)
                    console.warn(`    ⚠️  Item #${i} skipped: ${err.message}`);
                return null;
            }
        }).filter(Boolean);
        fs.writeFileSync(outputPath, JSON.stringify(normalizedData, null, 2), "utf-8");
        console.log(`  ✅ Wrote ${normalizedData.length} items → ${path.basename(outputPath)}`);
        if (skipped > 0)
            console.log(`     (${skipped} items skipped)`);
    }
    catch (err) {
        console.error(`  ❌ Failed: ${err.message}`);
    }
}
async function main() {
    console.log(`📋 Reading config: ${CONFIG_FILE}\n`);
    if (!fs.existsSync(CONFIG_FILE)) {
        console.error(`Config file not found: ${CONFIG_FILE}`);
        process.exit(1);
    }
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    console.log(`Found ${config.jobs.length} job(s)\n`);
    for (const job of config.jobs) {
        console.log(`📂 ${path.basename(job.input)}`);
        processJob(job);
        console.log("");
    }
    console.log("🏁 All done!");
}
main();
