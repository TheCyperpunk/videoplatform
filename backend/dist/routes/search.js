"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Video_1 = __importDefault(require("../models/Video"));
const router = (0, express_1.Router)();
// ── GET /api/search?q=&category=&sort= ────────────────────────────────
router.get("/", async (req, res) => {
    try {
        const q = (req.query.q || "").trim();
        const category = req.query.category || "";
        const sort = req.query.sort || "date";
        if (!q) {
            res.json({ data: [], total: 0, query: q, error: null });
            return;
        }
        const filter = {
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { tags: { $elemMatch: { $regex: q, $options: "i" } } },
                { "channel.name": { $regex: q, $options: "i" } },
            ],
        };
        if (category && category !== "all")
            filter.category = category;
        const sortMap = {
            date: { publishedAt: -1 },
            views: { views: -1 },
            likes: { likes: -1 },
        };
        const sortQuery = sortMap[sort] ?? { publishedAt: -1 };
        const data = await Video_1.default.find(filter).sort(sortQuery).limit(100).lean();
        res.json({ data, total: data.length, query: q, error: null });
    }
    catch (err) {
        res.status(500).json({ data: [], total: 0, query: "", error: String(err) });
    }
});
exports.default = router;
