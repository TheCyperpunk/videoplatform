"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const Video_1 = __importDefault(require("../models/Video"));
async function searchRoutes(fastify) {
    // ── GET /api/search?q=&category=&sort=&page=&limit= ────────────────────
    fastify.get("/", async (request, reply) => {
        try {
            const query = request.query;
            const q = (query.q || "").trim().slice(0, 100); // Limit to 100 chars
            const category = query.category || "";
            const sort = query.sort || "date";
            const page = Math.max(1, parseInt(query.page) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit) || 120));
            // Reject queries that are too short
            if (!q || q.length < 2) {
                return { data: [], total: 0, page, limit, hasMore: false, query: q, error: null };
            }
            // Escape regex special characters to prevent ReDoS attacks
            const safeQ = (0, escape_string_regexp_1.default)(q);
            const filter = {
                $or: [
                    { title: { $regex: safeQ, $options: "i" } },
                    { description: { $regex: safeQ, $options: "i" } },
                    { tags: { $elemMatch: { $regex: safeQ, $options: "i" } } },
                    { "channel.name": { $regex: safeQ, $options: "i" } },
                ],
            };
            if (category && category !== "all")
                filter.category = category;
            let sortQuery;
            switch (sort) {
                case "date":
                    sortQuery = { createdAt: -1 };
                    break;
                case "views":
                    // Since most videos have views: 0, use publishedAt as secondary sort
                    sortQuery = { views: -1, publishedAt: -1, createdAt: -1 };
                    break;
                case "likes":
                    sortQuery = { likes: -1, createdAt: -1 };
                    break;
                default:
                    sortQuery = { createdAt: -1 };
            }
            const total = await Video_1.default.countDocuments(filter);
            const data = await Video_1.default.find(filter, {
                // Only select fields we need
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
                query: q,
                error: null,
            };
        }
        catch (err) {
            fastify.log.error(err); // Log internally only
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 120, hasMore: false, query: "", error: "Internal server error" };
        }
    });
}
exports.default = searchRoutes;
