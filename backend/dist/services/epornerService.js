"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class EpornerService {
    constructor() {
        this.baseUrl = 'https://www.eporner.com/api/v2/video';
    }
    async searchVideos(searchParams = {}) {
        try {
            // Enhanced: Fetch multiple pages with higher per_page limit
            const maxPages = 3; // Fetch 3 pages for more comprehensive results
            const perPage = 50; // Increased from 20 to 50 (API supports up to 50)
            const allVideos = [];
            for (let page = 1; page <= maxPages; page++) {
                const params = {
                    per_page: perPage,
                    page: page,
                    thumbsize: searchParams.thumbsize || 'big',
                    format: 'json',
                    order: searchParams.order || 'latest'
                };
                // Add optional search parameters
                if (searchParams.query) {
                    params.query = searchParams.query;
                }
                if (searchParams.gay !== undefined) {
                    params.gay = searchParams.gay;
                }
                if (searchParams.lq !== undefined) {
                    params.lq = searchParams.lq;
                }
                console.log(`Fetching Eporner videos page ${page} with params:`, params);
                const response = await axios_1.default.get(`${this.baseUrl}/search/`, {
                    params,
                    timeout: 30000, // Increased to 30s for reliability
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)'
                    }
                });
                if (!response.data || !response.data.videos || !Array.isArray(response.data.videos) || response.data.videos.length === 0) {
                    console.log(`No videos found in response for page ${page}`);
                    break; // Stop if no more results
                }
                const pageVideos = response.data.videos.map((video) => this.formatVideo(video));
                allVideos.push(...pageVideos);
                console.log(`Eporner page ${page}: ${pageVideos.length} videos (total: ${allVideos.length}) - ${response.data.total_count} available`);
                // Add delay between requests to avoid rate limiting
                if (page < maxPages) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                // Stop if we got fewer results than expected (end of results)
                if (pageVideos.length < perPage) {
                    console.log(`Eporner: Reached end of results at page ${page}`);
                    break;
                }
            }
            console.log(`Found ${allVideos.length} total videos from Eporner (${maxPages} pages, ${perPage} per page)`);
            return allVideos;
        }
        catch (error) {
            console.error('Eporner API error:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
            }
            return [];
        }
    }
    async getVideoById(id, thumbsize = 'big') {
        try {
            console.log(`Fetching Eporner video by ID: ${id}`);
            const response = await axios_1.default.get(`${this.baseUrl}/id/`, {
                params: {
                    id,
                    thumbsize,
                    format: 'json'
                },
                timeout: 30000, // Increased to 30s for reliability
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)'
                }
            });
            if (!response.data || !response.data.id) {
                console.log('Video not found or removed');
                return null;
            }
            return this.formatVideo(response.data);
        }
        catch (error) {
            console.error('Eporner get video error:', error);
            if (axios_1.default.isAxiosError(error) && error.response?.status === 404) {
                console.log('Video not found (404)');
                return null;
            }
            return null;
        }
    }
    async getRemovedVideos() {
        try {
            console.log('Fetching Eporner removed videos list');
            const response = await axios_1.default.get(`${this.baseUrl}/removed/`, {
                params: {
                    format: 'json'
                },
                timeout: 30000, // Increased to 30s for reliability
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)'
                }
            });
            if (!response.data || !Array.isArray(response.data)) {
                console.log('No removed videos data');
                return [];
            }
            const removedIds = response.data.map((item) => item.id);
            console.log(`Found ${removedIds.length} removed video IDs`);
            return removedIds;
        }
        catch (error) {
            console.error('Eporner removed videos error:', error);
            return [];
        }
    }
    async getLatestVideos(page = 1) {
        return this.searchVideos({
            page,
            order: 'latest',
            per_page: 20,
            thumbsize: 'big'
        });
    }
    async getTopRatedVideos(page = 1) {
        return this.searchVideos({
            page,
            order: 'top-rated',
            per_page: 20,
            thumbsize: 'big'
        });
    }
    async getMostPopularVideos(page = 1) {
        return this.searchVideos({
            page,
            order: 'most-popular',
            per_page: 20,
            thumbsize: 'big'
        });
    }
    async getTopWeeklyVideos(page = 1) {
        return this.searchVideos({
            page,
            order: 'top-weekly',
            per_page: 20,
            thumbsize: 'big'
        });
    }
    async getTopMonthlyVideos(page = 1) {
        return this.searchVideos({
            page,
            order: 'top-monthly',
            per_page: 20,
            thumbsize: 'big'
        });
    }
    async getLongestVideos(page = 1) {
        return this.searchVideos({
            page,
            order: 'longest',
            per_page: 20,
            thumbsize: 'big'
        });
    }
    async getShortestVideos(page = 1) {
        return this.searchVideos({
            page,
            order: 'shortest',
            per_page: 20,
            thumbsize: 'big'
        });
    }
    async searchWithFilters(query, options = {}) {
        return this.searchVideos({
            query,
            page: options.page || 1,
            order: options.order || 'most-popular',
            gay: options.includeGay ? 1 : 0,
            lq: options.includeLowQuality ? 1 : 0,
            per_page: 20,
            thumbsize: 'big'
        });
    }
    formatVideo(video) {
        // Parse keywords into array
        const keywords = video.keywords ? video.keywords.split(',').map((k) => k.trim()).filter(Boolean) : [];
        return {
            id: video.id,
            title: video.title,
            thumbnail: video.default_thumb?.src || '',
            url: video.url,
            duration: video.length_min,
            views: video.views,
            rating: video.rate,
            embedUrl: video.embed,
            keywords,
            addedDate: video.added,
            thumbs: video.thumbs || []
        };
    }
}
exports.default = new EpornerService();
