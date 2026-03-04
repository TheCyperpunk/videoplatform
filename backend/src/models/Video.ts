import mongoose, { Document, Schema } from "mongoose";

export interface IChannel {
    name: string;
    avatar: string;
    subscribers: number;
    verified: boolean;
}

export interface IVideo extends Document {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    views: number;
    likes: number;
    publishedAt: string;
    channel: IChannel;
    category: string;
    tags: string[];
    description: string;
    quality: "720p" | "1080p" | "4K";
    trending_rank: number | null;
    source_url: string;
    scraped_at: string;
}

const ChannelSchema = new Schema<IChannel>(
    {
        name: { type: String, required: true },
        avatar: { type: String, default: "" },
        subscribers: { type: Number, default: 0 },
        verified: { type: Boolean, default: false },
    },
    { _id: false }
);

const VideoSchema = new Schema<IVideo>(
    {
        id: { type: String, required: true, unique: true },
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
    },
    { timestamps: true }
);

// Text index for search
VideoSchema.index({ title: "text", description: "text", tags: "text" });

const Video = mongoose.model<IVideo>("Video", VideoSchema);
export default Video;
