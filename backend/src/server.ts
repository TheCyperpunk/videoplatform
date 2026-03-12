import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db";
import videoRoutes from "./routes/videos";
import searchRoutes from "./routes/search";


const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ── Middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(morgan("dev")); // logs: GET /api/videos 200 12ms


// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/videos", videoRoutes);
app.use("/api/search", searchRoutes);


// ── Health check ───────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ───────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
});

// ── 404 catch-all ──────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
});

// ── Start ──────────────────────────────────────────────────────────────
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Videx API running at http://localhost:${PORT}`);
    });
})();
