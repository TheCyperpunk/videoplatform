"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class HaniApiService {
    constructor() {
        this.baseUrl = 'https://haniapi.vercel.app';
        this.hanimeBase = 'https://hanime.tv/videos/hentai';
    }
    // Build the hanime.tv watch URL from a slug
    watchUrl(slug) {
        return `${this.hanimeBase}/${slug}`;
    }
    // Map the raw API video object to our unified VideoData shape
    formatVideo(v) {
        return {
            id: v.slug,
            title: v.name,
            thumbnail: v.cover_url || v.poster_url || '',
            url: this.watchUrl(v.slug),
            views: v.views,
            tags: v.tags || [],
            brand: v.brand,
            isCensored: v.is_censored,
            releaseDate: v.released_at,
        };
    }
    // GET /getLanding/newest
    async getNewestVideos(page = 0) {
        try {
            console.log(`HaniAPI: fetching newest (page ${page})`);
            const response = await axios_1.default.get(`${this.baseUrl}/getLanding/newest`, {
                params: { p: page },
                timeout: 12000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
            });
            const list = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];
            console.log(`HaniAPI: got ${list.length} newest videos`);
            return list.map((v) => this.formatVideo(v));
        }
        catch (error) {
            console.error('HaniAPI getNewestVideos error:', error);
            return [];
        }
    }
    // GET /getLanding/recent
    async getRecentVideos(page = 0) {
        try {
            console.log(`HaniAPI: fetching recent (page ${page})`);
            const response = await axios_1.default.get(`${this.baseUrl}/getLanding/recent`, {
                params: { p: page },
                timeout: 12000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
            });
            const list = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];
            console.log(`HaniAPI: got ${list.length} recent videos`);
            return list.map((v) => this.formatVideo(v));
        }
        catch (error) {
            console.error('HaniAPI getRecentVideos error:', error);
            return [];
        }
    }
    // GET /getLanding/trending?time=week&p=0
    async getTrendingVideos(page = 0, time = 'month') {
        try {
            console.log(`HaniAPI: fetching trending (time=${time}, page=${page})`);
            const response = await axios_1.default.get(`${this.baseUrl}/getLanding/trending`, {
                params: { p: page, time },
                timeout: 12000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
            });
            const list = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];
            console.log(`HaniAPI: got ${list.length} trending videos`);
            return list.map((v) => this.formatVideo(v));
        }
        catch (error) {
            console.error('HaniAPI getTrendingVideos error:', error);
            return [];
        }
    }
    // POST /search with body params - Enhanced with multiple search strategies
    async searchVideos(params) {
        const { search, tags = [], brands = [], blacklist = [], order_by = 'views', ordering = 'desc', page = 0 } = params;
        if (!search || !search.trim()) {
            // No query → return newest as default with multi-page
            return this.getMultiPageNewest(3); // Fetch 3 pages of newest
        }
        try {
            console.log(`HaniAPI: enhanced search for "${search}"`);
            // Strategy 1: Direct search with multiple pages
            const searchPromises = [];
            const maxPages = 2; // Reduce to 2 pages since page 1+ often empty
            for (let p = 0; p < maxPages; p++) {
                searchPromises.push(axios_1.default.post(`${this.baseUrl}/search`, { search: search.trim(), tags, brands, blacklist, order_by, ordering, page: p }, {
                    timeout: 15000,
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)',
                    },
                }).catch(error => {
                    console.error(`HaniAPI search page ${p} error:`, error);
                    return { data: [] };
                }));
            }
            // Strategy 2: Also fetch trending and newest to supplement results
            searchPromises.push(axios_1.default.get(`${this.baseUrl}/getLanding/trending`, {
                params: { p: 0, time: 'month' },
                timeout: 12000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
            }).catch(error => {
                console.error('HaniAPI trending error:', error);
                return { data: [] };
            }));
            searchPromises.push(axios_1.default.get(`${this.baseUrl}/getLanding/newest`, {
                params: { p: 0 },
                timeout: 12000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
            }).catch(error => {
                console.error('HaniAPI newest error:', error);
                return { data: [] };
            }));
            const responses = await Promise.all(searchPromises);
            const allVideos = [];
            responses.forEach((response, index) => {
                if (response.data) {
                    const list = Array.isArray(response.data)
                        ? response.data
                        : (response.data.results || []);
                    const sourceType = index < maxPages ? `search-page-${index}` :
                        index === maxPages ? 'trending' : 'newest';
                    console.log(`HaniAPI: ${sourceType} returned ${list.length} results`);
                    // Filter results that match the search query (for trending/newest)
                    if (index >= maxPages) {
                        // More flexible matching - check if any word in search matches title or tags
                        const searchWords = search.toLowerCase().split(' ').filter(word => word.length > 2);
                        const filteredList = list.filter(video => {
                            const title = video.name.toLowerCase();
                            const tags = (video.tags || []).join(' ').toLowerCase();
                            // Match if any search word is found in title or tags
                            return searchWords.some(word => title.includes(word) || tags.includes(word)) || title.includes(search.toLowerCase());
                        });
                        console.log(`HaniAPI: ${sourceType} filtered to ${filteredList.length} matching results`);
                        allVideos.push(...filteredList);
                    }
                    else {
                        allVideos.push(...list);
                    }
                }
            });
            // Remove duplicates based on slug
            const uniqueVideos = allVideos.filter((video, index, self) => index === self.findIndex(v => v.slug === video.slug));
            console.log(`HaniAPI: total ${uniqueVideos.length} unique results from enhanced search`);
            return uniqueVideos.map((v) => this.formatVideo(v));
        }
        catch (error) {
            console.error('HaniAPI searchVideos error:', error);
            return [];
        }
    }
    // Helper method to fetch multiple pages of newest videos
    async getMultiPageNewest(maxPages = 3) {
        try {
            console.log(`HaniAPI: fetching ${maxPages} pages of newest videos`);
            const pagePromises = [];
            for (let p = 0; p < maxPages; p++) {
                pagePromises.push(axios_1.default.get(`${this.baseUrl}/getLanding/newest`, {
                    params: { p },
                    timeout: 12000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
                }).catch(error => {
                    console.error(`HaniAPI newest page ${p} error:`, error);
                    return { data: [] };
                }));
            }
            const responses = await Promise.all(pagePromises);
            const allVideos = [];
            responses.forEach((response, pageIndex) => {
                if (response.data) {
                    const list = Array.isArray(response.data)
                        ? response.data
                        : response.data.results || [];
                    console.log(`HaniAPI: newest page ${pageIndex} returned ${list.length} results`);
                    allVideos.push(...list);
                }
            });
            // Remove duplicates
            const uniqueVideos = allVideos.filter((video, index, self) => index === self.findIndex(v => v.slug === video.slug));
            console.log(`HaniAPI: total ${uniqueVideos.length} unique newest videos`);
            return uniqueVideos.map((v) => this.formatVideo(v));
        }
        catch (error) {
            console.error('HaniAPI getMultiPageNewest error:', error);
            return [];
        }
    }
    // GET /getInfo/:slug — detailed metadata for a single video
    async getVideoInfo(slug) {
        try {
            console.log(`HaniAPI: getting info for slug "${slug}"`);
            const response = await axios_1.default.get(`${this.baseUrl}/getInfo/${slug}`, {
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
            });
            return response.data;
        }
        catch (error) {
            console.error('HaniAPI getVideoInfo error:', error);
            return null;
        }
    }
}
exports.default = new HaniApiService();
