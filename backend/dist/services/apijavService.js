"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class ApiJavService {
    constructor() {
        this.baseUrl = 'https://server.apijav.com/wp-json/myvideo/v1';
    }
    async searchVideos(searchParams = {}) {
        try {
            // Enhanced: Fetch multiple pages with higher per_page limit
            const maxPages = searchParams.maxPages || 3; // Allow override, default 3 pages
            const perPage = 100; // Increased from 20 to 100 (API supports up to 100)
            const allVideos = [];
            for (let page = 1; page <= maxPages; page++) {
                const params = {
                    per_page: perPage,
                    page: page,
                    orderby: searchParams.orderby || 'date',
                    order: searchParams.order || 'DESC'
                };
                // Add optional search parameters
                if (searchParams.search) {
                    params.search = searchParams.search;
                }
                if (searchParams.category) {
                    params.category = searchParams.category;
                }
                if (searchParams.tag) {
                    params.tag = searchParams.tag;
                }
                if (searchParams.actor) {
                    params.actor = searchParams.actor;
                }
                if (searchParams.studio) {
                    params.studio = searchParams.studio;
                }
                if (searchParams.after) {
                    params.after = searchParams.after;
                }
                console.log(`Fetching APIJAV videos page ${page} with params:`, params);
                const response = await axios_1.default.get(`${this.baseUrl}/posts`, {
                    params,
                    timeout: 15000,
                    headers: {
                        'Accept': 'application/json',
                        'X-Client-Site': 'https://localhost:3000' // Optional client identification
                    }
                });
                if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
                    console.log(`No videos found in response for page ${page}`);
                    break; // Stop if no more results
                }
                const pageVideos = response.data.map((video) => this.formatVideo(video));
                allVideos.push(...pageVideos);
                console.log(`APIJAV page ${page}: ${pageVideos.length} videos (total: ${allVideos.length})`);
                // Add delay between requests to avoid rate limiting
                if (page < maxPages) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                // Stop if we got fewer results than expected (end of results)
                if (pageVideos.length < perPage) {
                    console.log(`APIJAV: Reached end of results at page ${page}`);
                    break;
                }
            }
            console.log(`Found ${allVideos.length} total videos from APIJAV (${maxPages} pages, ${perPage} per page)`);
            return allVideos;
        }
        catch (error) {
            console.error('APIJAV API error:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
            }
            return [];
        }
    }
    async getVideoById(id) {
        try {
            console.log(`Fetching APIJAV video by ID: ${id}`);
            const response = await axios_1.default.get(`${this.baseUrl}/posts/${id}`, {
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'X-Client-Site': 'https://localhost:3000'
                }
            });
            if (!response.data) {
                console.log('Video not found');
                return null;
            }
            return this.formatVideo(response.data);
        }
        catch (error) {
            console.error('APIJAV get video error:', error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                console.log('Video not found (404)');
                return null;
            }
            return null;
        }
    }
    async getPlayerInfo(id) {
        try {
            console.log(`Fetching APIJAV player info for ID: ${id}`);
            const response = await axios_1.default.get(`${this.baseUrl}/player/${id}`, {
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'X-Client-Site': 'https://localhost:3000'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('APIJAV player info error:', error);
            return null;
        }
    }
    async getTrendingVideos(page = 1) {
        return this.searchVideos({
            page,
            orderby: 'views',
            order: 'DESC',
            per_page: 20
        });
    }
    async getNewestVideos(page = 1) {
        return this.searchVideos({
            page,
            orderby: 'date',
            order: 'DESC',
            per_page: 20
        });
    }
    async getVideosByCategory(category, page = 1) {
        return this.searchVideos({
            category,
            page,
            orderby: 'date',
            order: 'DESC',
            per_page: 20,
            maxPages: 3 // Fetch up to 300 videos (3 pages × 100 per page)
        });
    }
    async getVideosByStudio(studio, page = 1) {
        return this.searchVideos({
            studio,
            page,
            orderby: 'date',
            order: 'DESC',
            per_page: 20
        });
    }
    async getVideosByActor(actor, page = 1) {
        return this.searchVideos({
            actor,
            page,
            orderby: 'date',
            order: 'DESC',
            per_page: 20
        });
    }
    async getHDVideos(page = 1) {
        // Note: API doesn't have direct HD filter, so we'll get all and filter client-side
        const allVideos = await this.searchVideos({
            page,
            orderby: 'date',
            order: 'DESC',
            per_page: 100 // Get more to filter
        });
        return allVideos.filter(video => video.isHd);
    }
    formatVideo(video) {
        return {
            id: video.id,
            title: video.title,
            thumbnail: video.thumbnail,
            url: video.embed_url, // Use embed_url as redirect URL
            duration: video.duration,
            views: video.views,
            studio: video.studio,
            code: video.code,
            categories: video.categories,
            actors: video.actors,
            isHd: video.is_hd
        };
    }
}
exports.default = new ApiJavService();
