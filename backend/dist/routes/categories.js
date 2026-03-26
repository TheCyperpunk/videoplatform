"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Video_1 = __importDefault(require("../models/Video"));
async function categoryRoutes(fastify) {
    // ── GET /api/categories ───────────────────────────────────────────────
    // Returns distinct categories with video count, sorted by count desc
    fastify.get("/", async (request, reply) => {
        try {
            const agg = await Video_1.default.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $project: { _id: 0, value: "$_id", count: 1 } },
            ]);
            return { data: agg, error: null };
        }
        catch (err) {
            reply.code(500);
            return { data: [], error: String(err) };
        }
    });
}
exports.default = categoryRoutes;
