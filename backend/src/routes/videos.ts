import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import Video from "../models/Video";

async function videoRoutes(fastify: FastifyInstance) {
    // ── GET /api/videos ────────────────────────────────────────────────────
    // Query params: page, limit, category, sort (date|views|likes), quality
    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const query = request.query as any;
            const page = Math.max(1, parseInt(query.page as string) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit as string) || 120));
            const category = (query.category as string) || "";
            const sort = (query.sort as string) || "date";
            const quality = (query.quality as string) || "";

            const filter: Record<string, unknown> = {};
            if (category && category !== "all") filter.category = category;
            if (quality && quality !== "all") filter.quality = quality;

            let sortQuery: Record<string, 1 | -1>;
            
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

            const total = await Video.countDocuments(filter);
            const data = await Video.find(filter, {
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
        } catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 120, hasMore: false, error: String(err) };
        }
    });

    // ── GET /api/videos/trending ───────────────────────────────────────────
    fastify.get("/trending", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const data = await Video.find({ trending_rank: { $ne: null } })
                .sort({ trending_rank: 1 })
                .limit(10)
                .lean();
            return { data, total: data.length, error: null };
        } catch (err) {
            reply.code(500);
            return { data: [], error: String(err) };
        }
    });

    // ── GET /api/videos/new ─────────────────────────────────────────────────
    // Latest videos sorted by createdAt (when scraped)
    fastify.get("/new", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const query = request.query as any;
            const page = Math.max(1, parseInt(query.page as string) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit as string) || 20));

            const total = await Video.countDocuments({});
            const data = await Video.find({}, {
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
        } catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 20, hasMore: false, error: String(err) };
        }
    });

    // ── GET /api/videos/popular ─────────────────────────────────────────────
    // Popular videos using publishedAt since most videos have views: 0
    fastify.get("/popular", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const query = request.query as any;
            const page = Math.max(1, parseInt(query.page as string) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit as string) || 20));

            // Since most videos have views: 0, use a different popularity algorithm
            // Sort by: views desc (for the few with views), then publishedAt desc, then createdAt desc
            const total = await Video.countDocuments({});
            const data = await Video.find({}, {
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
        } catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 20, hasMore: false, error: String(err) };
        }
    });

    // ── GET /api/videos/top-rated ───────────────────────────────────────────
    // Top rated videos with likes > 0, sorted by likes desc
    fastify.get("/top-rated", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const query = request.query as any;
            const page = Math.max(1, parseInt(query.page as string) || 1);
            const limit = Math.min(200, Math.max(1, parseInt(query.limit as string) || 20));

            const filter = { likes: { $gt: 0 } };
            
            const total = await Video.countDocuments(filter);
            const data = await Video.find(filter, {
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
        } catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 20, hasMore: false, error: String(err) };
        }
    });

    // ── GET /api/videos/:id ────────────────────────────────────────────────
    fastify.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const params = request.params as any;
            const video = await Video.findOne({ id: params.id }).lean();
            if (!video) {
                reply.code(404);
                return { data: null, error: "Video not found" };
            }

            // Related: same category, different id, max 10
            const related = await Video.find({
                category: video.category,
                id: { $ne: video.id },
            })
                .sort({ views: -1 })
                .limit(10)
                .lean();

            return { data: { video, related }, error: null };
        } catch (err) {
            reply.code(500);
            return { data: null, error: String(err) };
        }
    });
}

export default videoRoutes;