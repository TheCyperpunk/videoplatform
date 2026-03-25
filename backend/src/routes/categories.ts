import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import Video from "../models/Video";

async function categoryRoutes(fastify: FastifyInstance) {
    // ── GET /api/categories ───────────────────────────────────────────────
    // Returns distinct categories with video count, sorted by count desc
    fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const agg = await Video.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, value: "$_id", count: 1 } },
            ]);

            return { data: agg, error: null };
        } catch (err) {
            reply.code(500);
            return { data: [], error: String(err) };
        }
    });
}

export default categoryRoutes;