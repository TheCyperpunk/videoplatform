import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import Video from "../models/Video";

const SITEMAP_PAGE_SIZE = 40000; // Max URLs per sitemap file (Google limit is 50k)

async function sitemapRoutes(fastify: FastifyInstance) {
    /**
     * GET /api/sitemap/count
     * Returns the total number of videos in the DB.
     * Used by the frontend to calculate how many sitemap files to generate.
     */
    fastify.get("/count", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const total = await Video.countDocuments({});
            const totalPages = Math.ceil(total / SITEMAP_PAGE_SIZE);
            reply.header("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
            return { total, totalPages, pageSize: SITEMAP_PAGE_SIZE };
        } catch (err) {
            reply.code(500);
            return { error: String(err) };
        }
    });

    /**
     * GET /api/sitemap/videos/:page
     * Returns a lightweight slice of video records (only id + updatedAt).
     * :page is 0-indexed. Page 0 = first 40,000 videos, Page 1 = next 40,000, etc.
     * We intentionally skip thumbnails, descriptions, tags, etc. for speed.
     */
    fastify.get("/videos/:page", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const params = request.params as { page: string };
            const page = Math.max(0, parseInt(params.page) || 0);

            const data = await Video.find(
                {},
                { id: 1, updatedAt: 1, _id: 0 } // Minimal projection — only what the sitemap needs
            )
                .sort({ createdAt: -1 }) // Newest first so Google picks up fresh content fast
                .skip(page * SITEMAP_PAGE_SIZE)
                .limit(SITEMAP_PAGE_SIZE)
                .lean();

            reply.header("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
            return { data, page, count: data.length };
        } catch (err) {
            reply.code(500);
            return { data: [], error: String(err) };
        }
    });
}

export default sitemapRoutes;
