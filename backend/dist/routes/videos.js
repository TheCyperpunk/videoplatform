"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Video_1 = __importDefault(require("../models/Video"));
async function videoRoutes(fastify) {
    // ── GET /api/videos ────────────────────────────────────────────────────
    // Query params: page, limit, category, sort (date|views|likes), quality
    fastify.get("/", async (request, reply) => {
        try {
            const query = request.query;
            const page = Math.max(1, parseInt(query.page) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit) || 120));
            const category = query.category || "";
            const sort = query.sort || "date";
            const quality = query.quality || "";
            const filter = {};
            if (category && category !== "all")
                filter.category = category;
            if (quality && quality !== "all")
                filter.quality = quality;
            let sortQuery;
            switch (sort) {
                case "date":
                    // Sort by createdAt (when scraped) for newest first
                    sortQuery = { createdAt: -1 };
                    break;
                case "views":
                    // Since most videos have views: 0, use publishedAt as secondary sort
                    // This gives more meaningful "popular" results based on publish date
                    sortQuery = { views: -1, publishedAt: -1, createdAt: -1 };
                    break;
                case "likes":
                    // Sort by likes, including 0 likes (0 likes will be at bottom)
                    sortQuery = { likes: -1, createdAt: -1 };
                    break;
                default:
                    sortQuery = { createdAt: -1 };
            }
            const total = await Video_1.default.countDocuments(filter);
            const data = await Video_1.default.find(filter, {
                // Only select fields we actually need (projection)
                _id: 1,
                id: 1,
                title: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                likes: 1,
                publishedAt: 1,
                channel: 1,
                category: 1,
                quality: 1,
                source_url: 1,
                createdAt: 1
            })
                .sort(sortQuery)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(); // Use lean() for faster queries
            return {
                data,
                total,
                page,
                limit,
                hasMore: page * limit < total,
                error: null,
            };
        }
        catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 120, hasMore: false, error: String(err) };
        }
    });
    // ── GET /api/videos/trending ───────────────────────────────────────────
    fastify.get("/trending", async (request, reply) => {
        try {
            const data = await Video_1.default.find({ trending_rank: { $ne: null } })
                .sort({ trending_rank: 1 })
                .limit(10)
                .lean();
            return { data, total: data.length, error: null };
        }
        catch (err) {
            reply.code(500);
            return { data: [], error: String(err) };
        }
    });
    // ── GET /api/videos/new ─────────────────────────────────────────────────
    // Latest videos sorted by createdAt (when scraped)
    fastify.get("/new", async (request, reply) => {
        try {
            const query = request.query;
            const page = Math.max(1, parseInt(query.page) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit) || 20));
            const total = await Video_1.default.countDocuments({});
            const data = await Video_1.default.find({}, {
                _id: 1, id: 1, title: 1, thumbnail: 1, duration: 1, views: 1,
                likes: 1, publishedAt: 1, channel: 1, category: 1, quality: 1,
                source_url: 1, createdAt: 1
            })
                .sort({ createdAt: -1 }) // Newest scraped first
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
            return {
                data,
                total,
                page,
                limit,
                hasMore: page * limit < total,
                error: null,
            };
        }
        catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 20, hasMore: false, error: String(err) };
        }
    });
    // ── GET /api/videos/popular ─────────────────────────────────────────────
    // Popular videos using publishedAt since most videos have views: 0
    fastify.get("/popular", async (request, reply) => {
        try {
            const query = request.query;
            const page = Math.max(1, parseInt(query.page) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit) || 20));
            // Since most videos have views: 0, use a different popularity algorithm
            // Sort by: views desc (for the few with views), then publishedAt desc, then createdAt desc
            const total = await Video_1.default.countDocuments({});
            const data = await Video_1.default.find({}, {
                _id: 1, id: 1, title: 1, thumbnail: 1, duration: 1, views: 1,
                likes: 1, publishedAt: 1, channel: 1, category: 1, quality: 1,
                source_url: 1, createdAt: 1
            })
                .sort({ views: -1, publishedAt: -1, createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
            return {
                data,
                total,
                page,
                limit,
                hasMore: page * limit < total,
                error: null,
            };
        }
        catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 20, hasMore: false, error: String(err) };
        }
    });
    // ── GET /api/videos/top-rated ───────────────────────────────────────────
    // Top rated videos with likes > 0, sorted by likes desc
    fastify.get("/top-rated", async (request, reply) => {
        try {
            const query = request.query;
            const page = Math.max(1, parseInt(query.page) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit) || 20));
            const filter = { likes: { $gt: 0 } };
            const total = await Video_1.default.countDocuments(filter);
            const data = await Video_1.default.find(filter, {
                _id: 1, id: 1, title: 1, thumbnail: 1, duration: 1, views: 1,
                likes: 1, publishedAt: 1, channel: 1, category: 1, quality: 1,
                source_url: 1, createdAt: 1
            })
                .sort({ likes: -1, createdAt: -1 }) // Most liked first, then newest
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
            return {
                data,
                total,
                page,
                limit,
                hasMore: page * limit < total,
                error: null,
            };
        }
        catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 20, hasMore: false, error: String(err) };
        }
    });
    // ── GET /api/videos/:id ────────────────────────────────────────────────
    fastify.get("/:id", async (request, reply) => {
        try {
            const params = request.params;
            const video = await Video_1.default.findOne({ id: params.id }).lean();
            if (!video) {
                reply.code(404);
                return { data: null, error: "Video not found" };
            }
            // Related: same category, different id, max 10
            const related = await Video_1.default.find({
                category: video.category,
                id: { $ne: video.id },
            })
                .sort({ views: -1 })
                .limit(10)
                .lean();
            return { data: { video, related }, error: null };
        }
        catch (err) {
            reply.code(500);
            return { data: null, error: String(err) };
        }
    });
}
exports.default = videoRoutes;
