import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import Video from "../models/Video";

async function searchRoutes(fastify: FastifyInstance) {
    // ── GET /api/search?q=&category=&sort=&page=&limit= ────────────────────
    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const query = request.query as any;
            const q        = ((query.q as string) || "").trim();
            const category = (query.category as string) || "";
            const sort     = (query.sort as string) || "date";
            const page     = Math.max(1, parseInt(query.page as string) || 1);
            const limit    = Math.min(200, Math.max(1, parseInt(query.limit as string) || 120));

            if (!q) {
                return { data: [], total: 0, page, limit, hasMore: false, query: q, error: null };
            }

            const filter: Record<string, unknown> = {
                $or: [
                    { title:          { $regex: q, $options: "i" } },
                    { description:    { $regex: q, $options: "i" } },
                    { tags:           { $elemMatch: { $regex: q, $options: "i" } } },
                    { "channel.name": { $regex: q, $options: "i" } },
                ],
            };

            if (category && category !== "all") filter.category = category;

            let sortQuery: Record<string, 1 | -1>;
            
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

            const total = await Video.countDocuments(filter);
            const data  = await Video.find(filter, {
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
        } catch (err) {
            reply.code(500);
            return { data: [], total: 0, page: 1, limit: 120, hasMore: false, query: "", error: String(err) };
        }
    });
}

export default searchRoutes;