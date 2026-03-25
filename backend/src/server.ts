import "dotenv/config";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import connectDB from "./config/db";

// Import route modules
import videoRoutes from "./routes/videos";
import searchRoutes from "./routes/search";
import categoryRoutes from "./routes/categories";

// Import API services
import redtubeService from "./services/redtubeService";
import apijavService from "./services/apijavService";
import epornerService from "./services/epornerService";
import faphouseService from "./services/faphouseService";
import haniApiService from "./services/haniApiService";
import hentaioceanService from "./services/hentaioceanService";

// Import types
import { RedTubeSearchParams } from "./types/redtube";
import { ApiJavSearchParams } from "./types/apijav";
import { EpornerSearchParams } from "./types/eporner";
import { FapHouseSearchParams } from "./types/faphouse";
import { HaniSearchParams } from "./types/haniapi";
import { HentaiOceanSearchParams } from "./types/hentaiocean";

const fastify = Fastify({ 
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
  await fastify.register(videoRoutes, { prefix: "/api/videos" });
  await fastify.register(searchRoutes, { prefix: "/api/search" });
  await fastify.register(categoryRoutes, { prefix: "/api/categories" });
}

// ── External API Routes ─────────────────────────────────────────────────────

// ===== REDTUBE API ENDPOINTS =====
fastify.get('/api/redtube/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const searchParams: RedTubeSearchParams = {
            search: query.search as string,
            page: query.page ? parseInt(query.page as string) : 1,
            thumbsize: query.thumbsize as 'small' | 'medium' | 'medium1' | 'medium2' | 'big' | 'all',
            ordering: query.ordering as 'newest' | 'mostviewed' | 'rating',
            period: query.period as 'weekly' | 'monthly' | 'alltime',
            tags: query.tags ? (query.tags as string).split(',') : undefined
        };

        const videos = await redtubeService.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('RedTube search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/redtube/trending', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const page = query.page ? parseInt(query.page as string) : 1;
        const period = query.period as 'weekly' | 'monthly' | 'alltime' || 'weekly';
        
        const videos = await redtubeService.getTrendingVideos(page, period);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('RedTube trending error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/redtube/newest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const page = query.page ? parseInt(query.page as string) : 1;
        
        const videos = await redtubeService.getNewestVideos(page);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('RedTube newest error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/redtube/top-rated', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const page = query.page ? parseInt(query.page as string) : 1;
        const period = query.period as 'weekly' | 'monthly' | 'alltime' || 'alltime';
        
        const videos = await redtubeService.getTopRatedVideos(page, period);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('RedTube top-rated error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/redtube/tags/:tags', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const params = request.params as any;
        const query = request.query as any;
        const tags = params.tags.split(',');
        const page = query.page ? parseInt(query.page as string) : 1;
        
        const videos = await redtubeService.getVideosByTags(tags, page);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('RedTube tags error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

// ===== APIJAV API ENDPOINTS =====
fastify.get('/api/apijav/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const searchParams: ApiJavSearchParams = {
            search: query.search as string,
            page: query.page ? parseInt(query.page as string) : 1,
            per_page: query.per_page ? parseInt(query.per_page as string) : 20,
            orderby: query.orderby as 'date' | 'views' | 'title',
            order: query.order as 'ASC' | 'DESC',
            category: query.category as string,
            tag: query.tag as string,
            actor: query.actor as string,
            studio: query.studio as string,
            after: query.after as string
        };

        const videos = await apijavService.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('APIJAV search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/apijav/video/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const params = request.params as any;
        const id = parseInt(params.id);
        const video = await apijavService.getVideoById(id);
        
        if (!video) {
            reply.code(404);
            return { success: false, error: 'Video not found' };
        }
        
        return { success: true, data: video };
    } catch (error: any) {
        console.error('APIJAV video error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/apijav/trending', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const page = query.page ? parseInt(query.page as string) : 1;
        
        const videos = await apijavService.getTrendingVideos(page);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('APIJAV trending error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

// ===== EPORNER API ENDPOINTS =====
fastify.get('/api/eporner/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const searchParams: EpornerSearchParams = {
            query: query.query as string,
            page: query.page ? parseInt(query.page as string) : 1,
            per_page: query.per_page ? parseInt(query.per_page as string) : 20,
            thumbsize: query.thumbsize as 'small' | 'medium' | 'big',
            order: query.order as 'latest' | 'longest' | 'shortest' | 'top-rated' | 'most-popular' | 'top-weekly' | 'top-monthly',
            gay: query.gay ? (parseInt(query.gay as string) as 0 | 1) : undefined,
            lq: query.lq ? (parseInt(query.lq as string) as 0 | 1) : undefined
        };

        const videos = await epornerService.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('Eporner search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

// ===== FAPHOUSE API ENDPOINTS =====
fastify.get('/api/faphouse/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const searchParams: FapHouseSearchParams = {
            query: query.query as string,
            page: query.page ? parseInt(query.page as string) : 1,
            per_page: query.per_page ? parseInt(query.per_page as string) : 20,
            studio: query.studio as string,
            category: query.category as string,
            quality: query.quality as 'SD' | 'HD' | '4K' | 'all',
            sort: query.sort as 'latest' | 'popular' | 'trending' | 'longest' | 'shortest',
            premium_only: query.premium_only === 'true'
        };

        const videos = await faphouseService.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('FapHouse search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

// ===== HANIAPI ENDPOINTS =====
fastify.get('/api/haniapi/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const searchParams: HaniSearchParams = {
            search: query.search as string,
            page: query.page ? parseInt(query.page as string) : 0,
            tags: query.tags ? (query.tags as string).split(',') : undefined,
            brands: query.brands ? (query.brands as string).split(',') : undefined,
            blacklist: query.blacklist ? (query.blacklist as string).split(',') : undefined,
            order_by: query.order_by as 'likes' | 'created_at_unix' | 'views' | 'released_at_unix' | 'title_sortable',
            ordering: query.ordering as 'asc' | 'desc'
        };

        const videos = await haniApiService.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('HaniAPI search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/haniapi/newest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const page = query.page ? parseInt(query.page as string) : 0;
        
        const videos = await haniApiService.getNewestVideos(page);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('HaniAPI newest error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/haniapi/trending', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const page = query.page ? parseInt(query.page as string) : 0;
        const time = query.time as string || 'month';
        
        const videos = await haniApiService.getTrendingVideos(page, time);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('HaniAPI trending error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/haniapi/video/:slug', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const params = request.params as any;
        const slug = params.slug as string;
        const video = await haniApiService.getVideoInfo(slug);
        
        if (!video) {
            reply.code(404);
            return { success: false, error: 'Video not found' };
        }
        
        return { success: true, data: video };
    } catch (error: any) {
        console.error('HaniAPI video error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

// ===== HENTAI OCEAN ENDPOINTS =====
fastify.get('/api/hentaiocean/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const searchParams: HentaiOceanSearchParams = {
            query: query.query as string,
            page: query.page ? parseInt(query.page as string) : 1,
            per_page: query.per_page ? parseInt(query.per_page as string) : 20
        };

        const videos = await hentaioceanService.searchVideos(searchParams);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('Hentai Ocean search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/hentaiocean/latest', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const page = query.page ? parseInt(query.page as string) : 1;
        const per_page = query.per_page ? parseInt(query.per_page as string) : 20;
        
        const videos = await hentaioceanService.getLatestVideos(page, per_page);
        return { success: true, data: videos, count: videos.length };
    } catch (error: any) {
        console.error('Hentai Ocean latest error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

fastify.get('/api/hentaiocean/video/:slug', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const params = request.params as any;
        const slug = params.slug as string;
        const video = await hentaioceanService.getVideoBySlug(slug);
        
        if (!video) {
            reply.code(404);
            return { success: false, error: 'Video not found' };
        }
        
        return { success: true, data: video };
    } catch (error: any) {
        console.error('Hentai Ocean video error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

// ===== UNIFIED SEARCH ENDPOINT =====
fastify.get('/api/external/search', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const query = request.query as any;
        const searchQuery = query.query as string;
        const page = query.page ? parseInt(query.page as string) : 1;
        const sources = query.sources ? (query.sources as string).split(',') : ['redtube', 'apijav', 'eporner', 'faphouse', 'haniapi', 'hentaiocean'];

        if (!searchQuery) {
            reply.code(400);
            return { success: false, error: 'Query parameter is required' };
        }

        const results: any = {};

        // Search all requested sources in parallel
        const searchPromises = sources.map(async (source) => {
            try {
                switch (source.toLowerCase()) {
                    case 'redtube':
                        return { source: 'redtube', data: await redtubeService.searchVideos({ search: searchQuery, page }) };
                    case 'apijav':
                        return { source: 'apijav', data: await apijavService.searchVideos({ search: searchQuery, page }) };
                    case 'eporner':
                        return { source: 'eporner', data: await epornerService.searchVideos({ query: searchQuery, page }) };
                    case 'faphouse':
                        return { source: 'faphouse', data: await faphouseService.searchVideos({ query: searchQuery, page }) };
                    case 'haniapi':
                        return { source: 'haniapi', data: await haniApiService.searchVideos({ search: searchQuery, page: page - 1 }) }; // HaniAPI uses 0-based pages
                    case 'hentaiocean':
                        return { source: 'hentaiocean', data: await hentaioceanService.searchVideos({ query: searchQuery, page }) };
                    default:
                        return { source, data: [] };
                }
            } catch (error) {
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
        const totalCount = Object.values(results).reduce((sum: number, videos: any) => sum + videos.length, 0);

        return { 
            success: true, 
            data: results, 
            totalCount,
            query: searchQuery,
            page,
            sources: sources
        };
    } catch (error: any) {
        console.error('Unified search error:', error);
        reply.code(500);
        return { success: false, error: error.message };
    }
});

// ── Health check ───────────────────────────────────────────────────────
fastify.get("/api/health", async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: "ok", timestamp: new Date().toISOString() };
});

// ── Start server ───────────────────────────────────────────────────────
async function start() {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Register plugins
        await registerPlugins();
        
        // Register routes
        await registerRoutes();
        
        // Start server
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`🚀 Fastify server running on port ${PORT}`);
        console.log(`📊 Performance: ~3x faster than Express`);
        console.log(`🎯 Ready for production!`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();