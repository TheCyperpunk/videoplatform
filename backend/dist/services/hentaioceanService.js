"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class HentaiOceanService {
    constructor() {
        this.baseUrl = 'https://hentaiocean.com';
        this.rssUrl = 'https://hentaiocean.com/rss.xml';
    }
    // Extract slug from a HentaiOcean URL like https://hentaiocean.com/watch/my-mother-1/
    extractSlug(url) {
        return url.replace(/\/$/, '').split('/').pop() || '';
    }
    // Build thumbnail URL from slug
    thumbnailUrl(slug) {
        return `${this.baseUrl}/thumbnail/${slug}.webp`;
    }
    // Build embed/watch URL from slug
    watchUrl(slug) {
        return `${this.baseUrl}/watch/${slug}/`;
    }
    // Fetch metadata for a single slug via the Hentai Ocean API
    async getVideoBySlug(slug) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/api`, {
                params: { action: 'hentai', slug },
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
            });
            const info = response.data?.info?.[0];
            if (!info)
                return null;
            return {
                id: info.urlname,
                title: info.videoname,
                thumbnail: this.thumbnailUrl(info.urlname),
                url: this.watchUrl(info.urlname),
                releaseDate: info.releasedate,
                description: info.description,
                genres: (response.data.genres || []).map((g) => g.genre),
                coverUrl: `${this.baseUrl}/assets/cover/${info.coverimg}`,
            };
        }
        catch (error) {
            console.error(`HentaiOcean getVideoBySlug error for "${slug}":`, error);
            return null;
        }
    }
    // Fetch the latest videos from the RSS feed - Enhanced with higher limits
    async getLatestVideos(page = 1, perPage = 50) {
        try {
            console.log(`HentaiOcean: fetching RSS feed (page ${page}, perPage ${perPage})`);
            const response = await axios_1.default.get(this.rssUrl, {
                timeout: 15000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
                responseType: 'text',
            });
            const $ = cheerio.load(response.data, { xmlMode: true });
            const items = $('item').toArray();
            // Simple pagination over RSS items with higher limits
            const start = (page - 1) * perPage;
            const pageItems = items.slice(start, start + perPage);
            const videos = pageItems.map((el) => {
                const link = $(el).find('link').next().text().trim() || $(el).find('link').text().trim();
                const thumb = $(el).find('media\\:thumbnail, thumbnail').attr('url') || '';
                const pubDate = $(el).find('pubDate').text().trim();
                const title = $(el).find('title').text().trim();
                // Extract slug from link
                const slug = this.extractSlug(link);
                return {
                    id: slug || title,
                    title,
                    thumbnail: slug ? this.thumbnailUrl(slug) : thumb,
                    url: link || this.watchUrl(slug),
                    releaseDate: pubDate,
                };
            });
            console.log(`HentaiOcean: found ${videos.length} videos from RSS (total RSS items: ${items.length})`);
            return videos;
        }
        catch (error) {
            console.error('HentaiOcean getLatestVideos error:', error);
            return [];
        }
    }
    // Search via HTML scraping and RSS feed - Enhanced strategy
    async searchVideos(params = {}) {
        const { query, page = 1, per_page = 50 } = params;
        if (!query || !query.trim()) {
            // Return multiple pages of latest videos for better results
            return this.getMultiPageLatest(2, per_page); // Reduced to 2 pages to avoid too many duplicates
        }
        try {
            console.log(`HentaiOcean: enhanced search for "${query}"`);
            // Strategy 1: HTML search (single page to avoid duplicates)
            const htmlResults = await this.searchSinglePage(query, 1, per_page).catch(error => {
                console.error('HentaiOcean HTML search error:', error);
                return [];
            });
            // Strategy 2: RSS feed search (filter RSS items by query)
            const rssResults = await this.searchRSSFeed(query, per_page).catch(error => {
                console.error('HentaiOcean RSS search error:', error);
                return [];
            });
            // Combine results
            const allVideos = [...htmlResults, ...rssResults];
            // Remove duplicates based on id
            const uniqueVideos = allVideos.filter((video, index, self) => index === self.findIndex(v => v.id === video.id));
            console.log(`HentaiOcean: HTML=${htmlResults.length}, RSS=${rssResults.length}, unique=${uniqueVideos.length}`);
            return uniqueVideos;
        }
        catch (error) {
            console.error('HentaiOcean searchVideos error:', error);
            return [];
        }
    }
    // New method to search through RSS feed
    async searchRSSFeed(query, limit = 50) {
        try {
            console.log(`HentaiOcean: searching RSS feed for "${query}"`);
            const response = await axios_1.default.get(this.rssUrl, {
                timeout: 15000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
                responseType: 'text',
            });
            const $ = cheerio.load(response.data, { xmlMode: true });
            const items = $('item').toArray();
            // Filter RSS items by query and take more items
            const matchingItems = items.filter((el) => {
                const title = $(el).find('title').text().trim().toLowerCase();
                const description = $(el).find('description').text().trim().toLowerCase();
                const queryLower = query.toLowerCase();
                return title.includes(queryLower) || description.includes(queryLower);
            }).slice(0, limit);
            const videos = matchingItems.map((el) => {
                const link = $(el).find('link').next().text().trim() || $(el).find('link').text().trim();
                const thumb = $(el).find('media\\:thumbnail, thumbnail').attr('url') || '';
                const pubDate = $(el).find('pubDate').text().trim();
                const title = $(el).find('title').text().trim();
                const description = $(el).find('description').text().trim();
                // Extract slug from link
                const slug = this.extractSlug(link);
                return {
                    id: slug || title,
                    title,
                    thumbnail: slug ? this.thumbnailUrl(slug) : thumb,
                    url: link || this.watchUrl(slug),
                    releaseDate: pubDate,
                    description: description.substring(0, 200) + '...', // Truncate description
                };
            });
            console.log(`HentaiOcean: RSS search found ${videos.length} matching items from ${items.length} total`);
            return videos;
        }
        catch (error) {
            console.error('HentaiOcean searchRSSFeed error:', error);
            return [];
        }
    }
    // Helper method to search a single page
    async searchSinglePage(query, page, per_page) {
        const searchUrl = `${this.baseUrl}/`;
        const response = await axios_1.default.get(searchUrl, {
            params: { s: query, paged: page },
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
            },
            responseType: 'text',
        });
        const $ = cheerio.load(response.data);
        const videos = [];
        // Try multiple common selectors with higher limits
        const selectors = [
            'article',
            '.post',
            '.video-item',
            '.entry',
            '.hentai-item',
            '.movie-item',
        ];
        let found = false;
        for (const sel of selectors) {
            const items = $(sel);
            if (items.length > 0) {
                items.slice(0, per_page).each((_, el) => {
                    const linkEl = $(el).find('a').first();
                    const href = linkEl.attr('href') || '';
                    const title = linkEl.attr('title') || $(el).find('h2, h3, .title, .entry-title').first().text().trim() || '';
                    const imgSrc = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src') || '';
                    const slug = this.extractSlug(href);
                    if (slug && title) {
                        videos.push({
                            id: slug,
                            title,
                            thumbnail: slug ? this.thumbnailUrl(slug) : imgSrc,
                            url: href || this.watchUrl(slug),
                        });
                    }
                });
                if (videos.length > 0) {
                    found = true;
                    break;
                }
            }
        }
        // Fallback: scan all links that look like hentai watch pages
        if (!found || videos.length === 0) {
            $('a[href*="/watch/"]').slice(0, per_page).each((_, el) => {
                const href = $(el).attr('href') || '';
                const slug = this.extractSlug(href);
                if (!slug)
                    return;
                // Avoid duplicates
                if (videos.find((v) => v.id === slug))
                    return;
                const title = $(el).attr('title') ||
                    $(el).text().trim() ||
                    slug.replace(/-/g, ' ');
                videos.push({
                    id: slug,
                    title,
                    thumbnail: this.thumbnailUrl(slug),
                    url: href,
                });
            });
        }
        return videos;
    }
    // Helper method to fetch multiple pages of latest videos
    async getMultiPageLatest(maxPages = 3, perPage = 50) {
        try {
            console.log(`HentaiOcean: fetching ${maxPages} pages of latest videos`);
            const pagePromises = [];
            for (let p = 1; p <= maxPages; p++) {
                pagePromises.push(this.getLatestVideos(p, perPage).catch(error => {
                    console.error(`HentaiOcean latest page ${p} error:`, error);
                    return [];
                }));
            }
            const pageResults = await Promise.all(pagePromises);
            const allVideos = [];
            pageResults.forEach((videos, pageIndex) => {
                console.log(`HentaiOcean: latest page ${pageIndex + 1} returned ${videos.length} results`);
                allVideos.push(...videos);
            });
            // Remove duplicates
            const uniqueVideos = allVideos.filter((video, index, self) => index === self.findIndex(v => v.id === video.id));
            console.log(`HentaiOcean: total ${uniqueVideos.length} unique latest videos`);
            return uniqueVideos;
        }
        catch (error) {
            console.error('HentaiOcean getMultiPageLatest error:', error);
            return [];
        }
    }
}
exports.default = new HentaiOceanService();
