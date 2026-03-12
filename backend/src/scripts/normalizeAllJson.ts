import * as fs from "fs";
import * as path from "path";
import { normalize, detectSourceType } from "../utils/normalizers";

const CONFIG_FILE = path.resolve(__dirname, "../../normalize-config.json");

interface Job {
    input: string;
    output: string;
}

function processJob(job: Job) {
    const inputPath  = path.resolve(job.input);
    const outputPath = path.resolve(job.output);

    if (!fs.existsSync(inputPath)) {
        console.error(`  ❌ Input file not found: ${inputPath}`);
        return;
    }

    try {
        const rawData  = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
        const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || rawData.videos || [rawData]);
        const sourceType = detectSourceType(inputPath);

        console.log(`  Source type: "${sourceType}", Items: ${dataArray.length}`);

        let skipped = 0;
        const normalizedData = dataArray.map((item: unknown, i: number) => {
            try {
                return normalize(item, sourceType);
            } catch (err) {
                skipped++;
                if (skipped <= 3) console.warn(`    ⚠️  Item #${i} skipped: ${(err as Error).message}`);
                return null;
            }
        }).filter(Boolean);

        fs.writeFileSync(outputPath, JSON.stringify(normalizedData, null, 2), "utf-8");
        console.log(`  ✅ Wrote ${normalizedData.length} items → ${path.basename(outputPath)}`);
        if (skipped > 0) console.log(`     (${skipped} items skipped)`);

    } catch (err) {
        console.error(`  ❌ Failed: ${(err as Error).message}`);
    }
}

async function main() {
    console.log(`📋 Reading config: ${CONFIG_FILE}\n`);
    if (!fs.existsSync(CONFIG_FILE)) {
        console.error(`Config file not found: ${CONFIG_FILE}`);
        process.exit(1);
    }

    const config: { jobs: Job[] } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
    console.log(`Found ${config.jobs.length} job(s)\n`);

    for (const job of config.jobs) {
        console.log(`📂 ${path.basename(job.input)}`);
        processJob(job);
        console.log("");
    }

    console.log("🏁 All done!");
}

main();

