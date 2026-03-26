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
const mongoose_1 = __importStar(require("mongoose"));
const ChannelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    subscribers: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
}, { _id: false });
const VideoSchema = new mongoose_1.Schema({
    id: { type: String, required: false, unique: true, sparse: true },
    title: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    duration: { type: String, default: "0:00" },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    publishedAt: { type: String, default: "" },
    channel: { type: ChannelSchema, required: true },
    category: { type: String, default: "general" },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    quality: { type: String, enum: ["720p", "1080p", "4K"], default: "1080p" },
    trending_rank: { type: Number, default: null },
    source_url: { type: String, default: "" },
    scraped_at: { type: String, default: new Date().toISOString() },
}, { timestamps: true });
// Performance indexes for faster queries
VideoSchema.index({ title: "text", description: "text", tags: "text" }); // Text search
VideoSchema.index({ createdAt: -1 }); // For newest/date sorting
VideoSchema.index({ views: -1, createdAt: -1 }); // For views sorting
VideoSchema.index({ likes: -1, createdAt: -1 }); // For likes sorting
VideoSchema.index({ category: 1, createdAt: -1 }); // For category filtering
VideoSchema.index({ trending_rank: 1 }); // For trending videos
VideoSchema.index({ likes: 1 }); // For top-rated filtering (likes > 0)
const Video = mongoose_1.default.model("Video", VideoSchema);
exports.default = Video;
