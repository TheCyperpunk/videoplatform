"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const videos_1 = __importDefault(require("./routes/videos"));
const search_1 = __importDefault(require("./routes/search"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// ── Middleware ─────────────────────────────────────────────────────────
app.use((0, cors_1.default)({ origin: FRONTEND_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev")); // logs: GET /api/videos 200 12ms
// ── Routes ─────────────────────────────────────────────────────────────
app.use("/api/videos", videos_1.default);
app.use("/api/search", search_1.default);
// ── Health check ───────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// ── Global error handler ───────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
});
// ── 404 catch-all ──────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// ── Start ──────────────────────────────────────────────────────────────
(async () => {
    await (0, db_1.default)();
    app.listen(PORT, () => {
        console.log(`🚀 Videx API running at http://localhost:${PORT}`);
    });
})();
