import { Router, Request, Response } from "express";
import Video from "../models/Video";

const router = Router();

// ── GET /api/categories ───────────────────────────────────────────────
// Returns distinct categories with video count, sorted by count desc
router.get("/", async (_req: Request, res: Response) => {
    try {
        const agg = await Video.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, value: "$_id", count: 1 } },
        ]);

        res.json({ data: agg, error: null });
    } catch (err) {
        res.status(500).json({ data: [], error: String(err) });
    }
});

export default router;
