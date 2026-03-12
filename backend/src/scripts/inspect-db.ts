import "dotenv/config";
import mongoose from "mongoose";
import Video from "../models/Video";

async function verify() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("No MONGODB_URI");
  
  await mongoose.connect(uri);
  
  // Get counts by category
  const counts = await Video.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  
  console.log("=== DB COUNTS BY CATEGORY ===");
  console.log(counts);
  
  // Get 1 random adult video and 1 random webseries video
  const adult = await Video.findOne({ category: "adult" });
  const series = await Video.findOne({ category: "webseries" });
  
  console.log("\n=== SAMPLE ADULT VIDEO ===");
  console.log(JSON.stringify(adult, null, 2));
  
  console.log("\n=== SAMPLE WEBSERIES ===");
  console.log(JSON.stringify(series, null, 2));
  
  await mongoose.disconnect();
}

verify().catch(console.error);
