const fs = require('fs');
const crypto = require('crypto');

// Generate UUID v4
function uuidv4() {
    return crypto.randomUUID();
}

// Read all three JSON files
const file1 = JSON.parse(fs.readFileSync('assoass (1).json', 'utf8'));
const file2 = JSON.parse(fs.readFileSync('assoass (2).json', 'utf8'));
const file3 = JSON.parse(fs.readFileSync('assoass (3).json', 'utf8'));

// Helper function to extract duration in MM:SS format
function formatDuration(duration) {
    return duration || "0:00";
}

// Helper function to convert scraped data to schema format
function convertToSchema(scrapedData, category = "adult") {
    const converted = [];
    
    scrapedData.data.forEach((item) => {
        const [
            sourceUrl,
            thumbnail,
            likes,
            duration,
            quality,
            reportUrl,
            title,
            channelName,
            channelUrl,
            publishedAt
        ] = item;

        const video = {
            id: uuidv4(),
            title: title || "Untitled",
            thumbnail: thumbnail || "",
            duration: formatDuration(duration),
            views: 0,
            likes: parseInt(likes?.replace('%', '')) || 0,
            publishedAt: publishedAt || "Unknown",
            channel: {
                name: channelName || "Unknown",
                avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${channelName || 'Unknown'}`
            },
            category: category,
            tags: [category],
            quality: quality || "HD",
            source_url: sourceUrl || ""
        };

        converted.push(video);
    });

    return converted;
}

// Convert all three files
const converted1 = convertToSchema(file1, "adult");
const converted2 = convertToSchema(file2, "webseries");
const converted3 = convertToSchema(file3, "adult");

// Combine all arrays
const allVideos = [...converted1, ...converted2, ...converted3];

// Write to output file
fs.writeFileSync('converted-assoass.json', JSON.stringify(allVideos, null, 2));

console.log(`✅ Converted ${allVideos.length} videos successfully!`);
console.log(`   - File 1: ${converted1.length} videos (adult)`);
console.log(`   - File 2: ${converted2.length} videos (webseries)`);
console.log(`   - File 3: ${converted3.length} videos (adult)`);
console.log(`   - Output: converted-assoass.json`);
