"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Video_1 = __importDefault(require("../models/Video"));
const router = (0, express_1.Router)();
// ── GET /api/videos ────────────────────────────────────────────────────
// Query params: page, limit, category, sort (date|views|likes), quality
router.get("/", async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(200, Math.max(1, parseInt(req.query.limit) || 120));
        const category = req.query.category || "";
        const sort = req.query.sort || "date";
        const quality = req.query.quality || "";
        const filter = {};
        if (category && category !== "all")
            filter.category = category;
        if (quality && quality !== "all")
            filter.quality = quality;
        const sortMap = {
            date: { publishedAt: -1 },
            views: { views: -1 },
            likes: { likes: -1 },
        };
        const sortQuery = sortMap[sort] ?? { publishedAt: -1 };
        const total = await Video_1.default.countDocuments(filter);
        const data = await Video_1.default.find(filter)
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        res.json({
            data,
            total,
            page,
            limit,
            hasMore: page * limit < total,
            error: null,
        });
    }
    catch (err) {
        res.status(500).json({ data: [], total: 0, page: 1, limit: 120, hasMore: false, error: String(err) });
    }
});
// ── GET /api/videos/trending ───────────────────────────────────────────
router.get("/trending", async (_req, res) => {
    try {
        const data = await Video_1.default.find({ trending_rank: { $ne: null } })
            .sort({ trending_rank: 1 })
            .limit(10)
            .lean();
        res.json({ data, total: data.length, error: null });
    }
    catch (err) {
        res.status(500).json({ data: [], error: String(err) });
    }
});
// ── GET /api/videos/:id ────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
    try {
        const video = await Video_1.default.findOne({ id: req.params.id }).lean();
        if (!video) {
            res.status(404).json({ data: null, error: "Video not found" });
            return;
        }
        // Related: same category, different id, max 10
        const related = await Video_1.default.find({
            category: video.category,
            id: { $ne: video.id },
        })
            .sort({ views: -1 })
            .limit(10)
            .lean();
        res.json({ data: { video, related }, error: null });
    }
    catch (err) {
        res.status(500).json({ data: null, error: String(err) });
    }
});
exports.default = router;
