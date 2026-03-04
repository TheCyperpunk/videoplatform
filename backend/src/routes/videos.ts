import { Router, Request, Response } from "express";
import Video from "../models/Video";

const router = Router();

// ── GET /api/videos ────────────────────────────────────────────────────
// Query params: page, limit, category, sort (date|views|likes), quality
router.get("/", async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 120));
        const category = (req.query.category as string) || "";
        const sort = (req.query.sort as string) || "date";
        const quality = (req.query.quality as string) || "";

        const filter: Record<string, unknown> = {};
        if (category && category !== "all") filter.category = category;
        if (quality && quality !== "all") filter.quality = quality;

        const sortMap: Record<string, Record<string, 1 | -1>> = {
            date: { publishedAt: -1 },
            views: { views: -1 },
            likes: { likes: -1 },
        };
        const sortQuery = sortMap[sort] ?? { publishedAt: -1 };

        const total = await Video.countDocuments(filter);
        const data = await Video.find(filter)
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
    } catch (err) {
        res.status(500).json({ data: [], total: 0, page: 1, limit: 120, hasMore: false, error: String(err) });
    }
});

// ── GET /api/videos/trending ───────────────────────────────────────────
router.get("/trending", async (_req: Request, res: Response) => {
    try {
        const data = await Video.find({ trending_rank: { $ne: null } })
            .sort({ trending_rank: 1 })
            .limit(10)
            .lean();
        res.json({ data, total: data.length, error: null });
    } catch (err) {
        res.status(500).json({ data: [], error: String(err) });
    }
});

// ── GET /api/videos/:id ────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const video = await Video.findOne({ id: req.params.id }).lean();
        if (!video) {
            res.status(404).json({ data: null, error: "Video not found" });
            return;
        }

        // Related: same category, different id, max 10
        const related = await Video.find({
            category: video.category,
            id: { $ne: video.id },
        })
            .sort({ views: -1 })
            .limit(10)
            .lean();

        res.json({ data: { video, related }, error: null });
    } catch (err) {
        res.status(500).json({ data: null, error: String(err) });
    }
});

export default router;
