"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const db_1 = __importDefault(require("./config/db"));
// Import route modules
const videos_1 = __importDefault(require("./routes/videos"));
const search_1 = __importDefault(require("./routes/search"));
const categories_1 = __importDefault(require("./routes/categories"));
// Import API services
const redtubeService_1 = __importDefault(require("./services/redtubeService"));
const apijavService_1 = __importDefault(require("./services/apijavService"));
const epornerService_1 = __importDefault(require("./services/epornerService"));
const faphouseService_1 = __importDefault(require("./services/faphouseService"));
const haniApiService_1 = __importDefault(require("./services/haniApiService"));
const hentaioceanService_1 = __importDefault(require("./services/hentaioceanService"));
const fastify = (0, fastify_1.default)({
    logger: true,
    trustProxy: true
});
const PORT = parseInt(process.env.PORT || "5002");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// ── Register plugins ─────────────────────────────────────────────────────────
async function registerPlugins() {
    // CORS plugin
    await fastify.register(require('@fastify/cors'), {
        origin: FRONTEND_URL,
        credentials: true
    });
    // Compression plugin for faster responses
    await fastify.register(require('@fastify/compress'), {
        global: true,
        threshold: 1024, // Only compress responses > 1KB
    });
}
// ── Register routes ─────────────────────────────────────────────────────────
async function registerRoutes() {
    // Register main route modules
    await fastify.register(videos_1.default, { prefix: "/api/videos" });
    await fastify.register(search_1.default, { prefix: "/api/search" });
    await fastify.register(categories_1.default, { prefix: "/api/categories" });
}
// ── External API Routes ─────────────────────────────────────────────────────
// ===== REDTUBE API ENDPOINTS =====
fastify.get('/api/redtube/search', async (request, reply) => {
    try {
        const query = request.query;
        const searchParams = {
            search: query.search,
            page: query.page ? parseInt(query.page) : 1,
            thumbsize: query.thumbsize,
            ordering: query.ordering,
            period: query.period,
            tags: query.tags ? query.tags.split(',') : undefined
        };
        const videos = await redtubeService_1.default.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('RedTube search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/redtube/trending', async (request, reply) => {
    try {
        const query = request.query;
        const page = query.page ? parseInt(query.page) : 1;
        const period = query.period || 'weekly';
        const videos = await redtubeService_1.default.getTrendingVideos(page, period);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('RedTube trending error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/redtube/newest', async (request, reply) => {
    try {
        const query = request.query;
        const page = query.page ? parseInt(query.page) : 1;
        const videos = await redtubeService_1.default.getNewestVideos(page);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('RedTube newest error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/redtube/top-rated', async (request, reply) => {
    try {
        const query = request.query;
        const page = query.page ? parseInt(query.page) : 1;
        const period = query.period || 'alltime';
        const videos = await redtubeService_1.default.getTopRatedVideos(page, period);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('RedTube top-rated error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/redtube/tags/:tags', async (request, reply) => {
    try {
        const params = request.params;
        const query = request.query;
        const tags = params.tags.split(',');
        const page = query.page ? parseInt(query.page) : 1;
        const videos = await redtubeService_1.default.getVideosByTags(tags, page);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('RedTube tags error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ===== APIJAV API ENDPOINTS =====
fastify.get('/api/apijav/search', async (request, reply) => {
    try {
        const query = request.query;
        const searchParams = {
            search: query.search,
            page: query.page ? parseInt(query.page) : 1,
            per_page: query.per_page ? parseInt(query.per_page) : 20,
            orderby: query.orderby,
            order: query.order,
            category: query.category,
            tag: query.tag,
            actor: query.actor,
            studio: query.studio,
            after: query.after
        };
        const videos = await apijavService_1.default.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('APIJAV search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/apijav/video/:id', async (request, reply) => {
    try {
        const params = request.params;
        const id = parseInt(params.id);
        const video = await apijavService_1.default.getVideoById(id);
        if (!video) {
            reply.code(404);
            return { success: false, error: 'Video not found' };
        }
        return { success: true, data: video };
    }
    catch (error) {
        console.error('APIJAV video error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/apijav/trending', async (request, reply) => {
    try {
        const query = request.query;
        const page = query.page ? parseInt(query.page) : 1;
        const videos = await apijavService_1.default.getTrendingVideos(page);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('APIJAV trending error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ===== EPORNER API ENDPOINTS =====
fastify.get('/api/eporner/search', async (request, reply) => {
    try {
        const query = request.query;
        const searchParams = {
            query: query.query,
            page: query.page ? parseInt(query.page) : 1,
            per_page: query.per_page ? parseInt(query.per_page) : 20,
            thumbsize: query.thumbsize,
            order: query.order,
            gay: query.gay ? parseInt(query.gay) : undefined,
            lq: query.lq ? parseInt(query.lq) : undefined
        };
        const videos = await epornerService_1.default.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('Eporner search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ===== FAPHOUSE API ENDPOINTS =====
fastify.get('/api/faphouse/search', async (request, reply) => {
    try {
        const query = request.query;
        const searchParams = {
            query: query.query,
            page: query.page ? parseInt(query.page) : 1,
            per_page: query.per_page ? parseInt(query.per_page) : 20,
            studio: query.studio,
            category: query.category,
            quality: query.quality,
            sort: query.sort,
            premium_only: query.premium_only === 'true'
        };
        const videos = await faphouseService_1.default.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('FapHouse search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ===== HANIAPI ENDPOINTS =====
fastify.get('/api/haniapi/search', async (request, reply) => {
    try {
        const query = request.query;
        const searchParams = {
            search: query.search,
            page: query.page ? parseInt(query.page) : 0,
            tags: query.tags ? query.tags.split(',') : undefined,
            brands: query.brands ? query.brands.split(',') : undefined,
            blacklist: query.blacklist ? query.blacklist.split(',') : undefined,
            order_by: query.order_by,
            ordering: query.ordering
        };
        const videos = await haniApiService_1.default.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('HaniAPI search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/haniapi/newest', async (request, reply) => {
    try {
        const query = request.query;
        const page = query.page ? parseInt(query.page) : 0;
        const videos = await haniApiService_1.default.getNewestVideos(page);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('HaniAPI newest error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/haniapi/trending', async (request, reply) => {
    try {
        const query = request.query;
        const page = query.page ? parseInt(query.page) : 0;
        const time = query.time || 'month';
        const videos = await haniApiService_1.default.getTrendingVideos(page, time);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('HaniAPI trending error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/haniapi/video/:slug', async (request, reply) => {
    try {
        const params = request.params;
        const slug = params.slug;
        const video = await haniApiService_1.default.getVideoInfo(slug);
        if (!video) {
            reply.code(404);
            return { success: false, error: 'Video not found' };
        }
        return { success: true, data: video };
    }
    catch (error) {
        console.error('HaniAPI video error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ===== HENTAI OCEAN ENDPOINTS =====
fastify.get('/api/hentaiocean/search', async (request, reply) => {
    try {
        const query = request.query;
        const searchParams = {
            query: query.query,
            page: query.page ? parseInt(query.page) : 1,
            per_page: query.per_page ? parseInt(query.per_page) : 20
        };
        const videos = await hentaioceanService_1.default.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('Hentai Ocean search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/hentaiocean/latest', async (request, reply) => {
    try {
        const query = request.query;
        const page = query.page ? parseInt(query.page) : 1;
        const per_page = query.per_page ? parseInt(query.per_page) : 20;
        const videos = await hentaioceanService_1.default.getLatestVideos(page, per_page);
        return { success: true, data: videos, count: videos.length };
    }
    catch (error) {
        console.error('Hentai Ocean latest error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
fastify.get('/api/hentaiocean/video/:slug', async (request, reply) => {
    try {
        const params = request.params;
        const slug = params.slug;
        const video = await hentaioceanService_1.default.getVideoBySlug(slug);
        if (!video) {
            reply.code(404);
            return { success: false, error: 'Video not found' };
        }
        return { success: true, data: video };
    }
    catch (error) {
        console.error('Hentai Ocean video error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ===== CATEGORY-SPECIFIC SEARCH ENDPOINT =====
fastify.get('/api/external/category/:category', async (request, reply) => {
    try {
        const params = request.params;
        const query = request.query;
        const category = params.category;
        const page = query.page ? parseInt(query.page) : 1;
        // Map category to sources
        let sources = [];
        if (category === 'jav' || category === 'javfetch') {
            sources = ['apijav', 'redtube', 'eporner', 'faphouse'];
        }
        else if (category === 'hentai') {
            sources = ['hentaiocean', 'haniapi'];
        }
        else {
            reply.code(400);
            return { success: false, error: 'Invalid category' };
        }
        const results = {};
        // Fetch from all sources in parallel
        const fetchPromises = sources.map(async (source) => {
            try {
                switch (source.toLowerCase()) {
                    case 'apijav':
                        return { source: 'apijav', data: await apijavService_1.default.searchVideos({ page, maxPages: 3 }) };
                    case 'redtube':
                        return { source: 'redtube', data: await redtubeService_1.default.searchVideos({ page }) };
                    case 'eporner':
                        return { source: 'eporner', data: await epornerService_1.default.searchVideos({ page }) };
                    case 'faphouse':
                        return { source: 'faphouse', data: await faphouseService_1.default.searchVideos({ page }) };
                    case 'haniapi':
                        return { source: 'haniapi', data: await haniApiService_1.default.getNewestVideos(page - 1) };
                    case 'hentaiocean':
                        return { source: 'hentaiocean', data: await hentaioceanService_1.default.getLatestVideos(page) };
                    default:
                        return { source, data: [] };
                }
            }
            catch (error) {
                console.error(`Error fetching ${source}:`, error);
                return { source, data: [] };
            }
        });
        const fetchResults = await Promise.all(fetchPromises);
        // Organize results by source
        fetchResults.forEach(result => {
            results[result.source] = result.data;
        });
        // Calculate total count
        const totalCount = Object.values(results).reduce((sum, videos) => sum + videos.length, 0);
        return {
            success: true,
            data: results,
            totalCount,
            category,
            page,
            sources: sources
        };
    }
    catch (error) {
        console.error('Category search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ===== UNIFIED SEARCH ENDPOINT =====
fastify.get('/api/external/search', async (request, reply) => {
    try {
        const query = request.query;
        const searchQuery = query.query;
        const page = query.page ? parseInt(query.page) : 1;
        const sources = query.sources ? query.sources.split(',') : ['redtube', 'apijav', 'eporner', 'faphouse', 'haniapi', 'hentaiocean'];
        if (!searchQuery) {
            reply.code(400);
            return { success: false, error: 'Query parameter is required' };
        }
        const results = {};
        // Search all requested sources in parallel
        const searchPromises = sources.map(async (source) => {
            try {
                switch (source.toLowerCase()) {
                    case 'redtube':
                        return { source: 'redtube', data: await redtubeService_1.default.searchVideos({ search: searchQuery, page }) };
                    case 'apijav':
                        return { source: 'apijav', data: await apijavService_1.default.searchVideos({ search: searchQuery, page }) };
                    case 'eporner':
                        return { source: 'eporner', data: await epornerService_1.default.searchVideos({ query: searchQuery, page }) };
                    case 'faphouse':
                        return { source: 'faphouse', data: await faphouseService_1.default.searchVideos({ query: searchQuery, page }) };
                    case 'haniapi':
                        return { source: 'haniapi', data: await haniApiService_1.default.searchVideos({ search: searchQuery, page: page - 1 }) }; // HaniAPI uses 0-based pages
                    case 'hentaiocean':
                        return { source: 'hentaiocean', data: await hentaioceanService_1.default.searchVideos({ query: searchQuery, page }) };
                    default:
                        return { source, data: [] };
                }
            }
            catch (error) {
                console.error(`Error searching ${source}:`, error);
                return { source, data: [] };
            }
        });
        const searchResults = await Promise.all(searchPromises);
        // Organize results by source
        searchResults.forEach(result => {
            results[result.source] = result.data;
        });
        // Calculate total count
        const totalCount = Object.values(results).reduce((sum, videos) => sum + videos.length, 0);
        return {
            success: true,
            data: results,
            totalCount,
            query: searchQuery,
            page,
            sources: sources
        };
    }
    catch (error) {
        console.error('Unified search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});
// ── Health check ───────────────────────────────────────────────────────
fastify.get("/api/health", async (request, reply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
});
// ── Start server ───────────────────────────────────────────────────────
async function start() {
    try {
        // Connect to MongoDB
        await (0, db_1.default)();
        // Register plugins
        await registerPlugins();
        // Register routes
        await registerRoutes();
        // Start server
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`🚀 Fastify server running on port ${PORT}`);
        console.log(`📊 Performance: ~3x faster than Express`);
        console.log(`🎯 Ready for production!`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}
start();
