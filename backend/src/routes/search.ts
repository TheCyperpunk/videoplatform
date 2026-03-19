import { Router, Request, Response } from "express";
import Video from "../models/Video";

const router = Router();

// ── GET /api/search?q=&category=&sort=&page=&limit= ────────────────────
router.get("/", async (req: Request, res: Response) => {
    try {
        const q        = ((req.query.q as string) || "").trim();
        const category = (req.query.category as string) || "";
        const sort     = (req.query.sort as string) || "date";
        const page     = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit    = Math.min(200, Math.max(1, parseInt(req.query.limit as string) || 120));

        if (!q) {
            res.json({ data: [], total: 0, page, limit, hasMore: false, query: q, error: null });
            return;
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

        const sortMap: Record<string, Record<string, 1 | -1>> = {
            date:  { publishedAt: -1 },
            views: { views: -1 },
            likes: { likes: -1 },
        };
        const sortQuery = sortMap[sort] ?? { publishedAt: -1 };

        const total = await Video.countDocuments(filter);
        const data  = await Video.find(filter)
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
            query: q,
            error: null,
        });
    } catch (err) {
        res.status(500).json({ data: [], total: 0, page: 1, limit: 120, hasMore: false, query: "", error: String(err) });
    }
});

export default router;
