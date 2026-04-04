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
class FapHouseService {
    constructor() {
        this.baseUrl = 'https://faphouse.com';
        // Initialize storage
        this.storage = {
            videos: new Map(),
            studios: new Map(),
            categories: new Map()
        };
        // Set up headers similar to the PHP scraper
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Priority': 'u=0, i'
        };
        // Start with empty storage - force real scraping
        console.log('FapHouse service initialized - will scrape real data on first request');
    }
    async initializeScrapedData() {
        try {
            console.log('Starting comprehensive scraping of FapHouse data...');
            // Load studios and categories first
            await this.scrapeStudios();
            await this.scrapeCategories();
            // Then scrape initial videos from main pages
            await this.scrapeLatestVideos();
            // Scrape from popular studios (top 10)
            const studios = Array.from(this.storage.studios.values()).slice(0, 10);
            console.log(`Scraping videos from top ${studios.length} studios...`);
            for (const studio of studios) {
                console.log(`Scraping studio: ${studio.name}`);
                await this.scrapeStudioVideos(studio.slug);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            // Scrape from popular categories (top 10)
            const categories = Array.from(this.storage.categories.values()).slice(0, 10);
            console.log(`Scraping videos from top ${categories.length} categories...`);
            for (const category of categories) {
                console.log(`Scraping category: ${category.name}`);
                await this.scrapeCategoryVideos(category.slug);
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            console.log(`Comprehensive scraping completed: ${this.storage.videos.size} videos, ${this.storage.studios.size} studios, ${this.storage.categories.size} categories`);
        }
        catch (error) {
            console.error('Error in comprehensive scraping (using fallback data):', error);
        }
    }
    async scrapeStudios() {
        try {
            console.log('Scraping FapHouse studios with extended pagination...');
            for (let page = 1; page <= 10; page++) { // Increased from 3 to 10 pages
                const url = `${this.baseUrl}/studios?page=${page}`;
                const response = await axios_1.default.get(url, { headers: this.headers, timeout: 10000 });
                const $ = cheerio.load(response.data);
                const studios = $('div.studios-list div.studios-list__container div.studio');
                if (studios.length === 0) {
                    console.log(`No more studios found on page ${page}, stopping`);
                    break;
                }
                studios.each((index, element) => {
                    const $studio = $(element);
                    const link = $studio.find('a.studio__thumb');
                    const img = link.find('img.studio__thumb-picture');
                    const logo = $studio.find('img.studio__thumb-avatar_picture');
                    const title = img.attr('alt') || '';
                    const href = link.attr('href') || '';
                    const slug = href.split('/').pop() || '';
                    if (title && slug) {
                        const studio = {
                            id: this.storage.studios.size + 1,
                            name: title,
                            slug: slug,
                            url: href
                        };
                        this.storage.studios.set(slug, studio);
                    }
                });
                console.log(`Scraped page ${page}, total studios: ${this.storage.studios.size}`);
                // Add delay between requests
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log(`Scraped ${this.storage.studios.size} studios total`);
        }
        catch (error) {
            console.error('Error scraping studios:', error);
        }
    }
    async scrapeCategories() {
        try {
            console.log('Scraping FapHouse categories with extended pagination...');
            for (let page = 0; page < 10; page++) { // Increased from 3 to 10 pages
                const url = `${this.baseUrl}/categories?sort=alpha&page=${page}`;
                const response = await axios_1.default.get(url, { headers: this.headers, timeout: 10000 });
                const $ = cheerio.load(response.data);
                const categories = $('div.grid a.thumb-category-v2');
                if (categories.length === 0) {
                    console.log(`No more categories found on page ${page}, stopping`);
                    break;
                }
                categories.each((index, element) => {
                    const $category = $(element);
                    const href = $category.attr('href') || '';
                    const img = $category.find('img');
                    const name = img.attr('alt') || $category.text().trim();
                    // Extract slug from URL pattern /c/{slug}/videos
                    const match = href.match(/\/c\/(.+?)\/videos/);
                    if (match && match[1]) {
                        const slug = match[1];
                        const category = {
                            id: this.storage.categories.size + 1,
                            name: name,
                            slug: slug,
                            url: href
                        };
                        this.storage.categories.set(slug, category);
                    }
                });
                console.log(`Scraped page ${page}, total categories: ${this.storage.categories.size}`);
                // Add delay between requests
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log(`Scraped ${this.storage.categories.size} categories total`);
        }
        catch (error) {
            console.error('Error scraping categories:', error);
        }
    }
    async scrapeLatestVideos() {
        try {
            console.log('Scraping latest FapHouse videos with pagination...');
            // Scrape from multiple sources with pagination
            const sources = [
                { base: `${this.baseUrl}/videos`, pages: 10 },
                { base: `${this.baseUrl}/videos?sort=popular`, pages: 10 },
                { base: `${this.baseUrl}/videos?sort=newest`, pages: 10 },
                { base: `${this.baseUrl}/videos?sort=trending`, pages: 5 },
                { base: `${this.baseUrl}/videos?sort=rating`, pages: 5 }
            ];
            for (const source of sources) {
                console.log(`Scraping ${source.pages} pages from: ${source.base}`);
                for (let page = 1; page <= source.pages; page++) {
                    const url = `${source.base}${source.base.includes('?') ? '&' : '?'}page=${page}`;
                    await this.scrapeVideosFromPage(url);
                    // Add delay between requests to avoid being blocked
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    // Log progress
                    if (page % 5 === 0) {
                        console.log(`Scraped ${page}/${source.pages} pages, total videos: ${this.storage.videos.size}`);
                    }
                }
            }
            console.log(`Completed scraping ${this.storage.videos.size} videos from all sources`);
        }
        catch (error) {
            console.error('Error scraping videos:', error);
        }
    }
    async scrapeVideosFromPage(url) {
        try {
            console.log(`Scraping videos from: ${url}`);
            const response = await axios_1.default.get(url, {
                headers: this.headers,
                timeout: 30000, // Increased to 30s for reliability
                validateStatus: (status) => status < 500 // Accept 4xx errors but not 5xx
            });
            if (response.status >= 400) {
                console.log(`HTTP ${response.status} for ${url}, skipping`);
                return;
            }
            const $ = cheerio.load(response.data);
            // Try multiple selectors for video cards
            const selectors = [
                'div.fh-grid__container div.thumb',
                'div.page__main div.grid div.thumb',
                'div.grid div.thumb',
                '.thumb'
            ];
            let videoCards = $('');
            for (const selector of selectors) {
                videoCards = $(selector);
                if (videoCards.length > 0) {
                    console.log(`Found ${videoCards.length} video cards using selector: ${selector}`);
                    break;
                }
            }
            if (videoCards.length === 0) {
                console.log('No video cards found on page');
                return;
            }
            videoCards.each((index, element) => {
                const $card = $(element);
                // Extract video data similar to PHP scraper
                const videoId = $card.attr('data-id') || `scraped_${Date.now()}_${index}`;
                if (this.storage.videos.has(videoId)) {
                    return; // Skip if already exists
                }
                // Get video link and slug
                const videoLink = $card.find('a.t-vl, a[href*="/videos/"]').first();
                const href = videoLink.attr('href') || '';
                const slug = href.split('/').pop() || '';
                // Get image/thumbnail
                const image = $card.find('img.t-i, img').first();
                let thumbnail = image.attr('src') || image.attr('data-src') || '';
                // Convert relative URLs to absolute
                if (thumbnail && thumbnail.startsWith('/')) {
                    thumbnail = this.baseUrl + thumbnail;
                }
                // Get title
                const titleElement = $card.find('a.t-tv, .title, h3, h4').first();
                let title = titleElement.text().trim() || image.attr('alt') || '';
                // Clean up title
                title = title.replace(/\s+/g, ' ').trim();
                // Get quality and duration
                const qualityElement = $card.find('span.t-vb, .quality, .duration').first();
                const qualityText = qualityElement.text().trim();
                const quality = qualityText.split(' ')[0] || 'HD';
                const durationElement = $card.find('span.t-vb span, .duration').first();
                let duration = durationElement.text().trim();
                if (!duration && qualityText.includes(':')) {
                    // Extract duration from quality text if needed
                    const match = qualityText.match(/(\d+:\d+)/);
                    duration = match ? match[1] : '10:00';
                }
                if (!duration)
                    duration = '10:00';
                // Extract studio info
                const studioLinks = $card.find('a.t-ti-s, a[href*="/studios/"], .studio');
                let studio = 'Unknown';
                let studioSlug = '';
                studioLinks.each((i, studioEl) => {
                    const studioHref = $(studioEl).attr('href') || '';
                    if (studioHref.includes('/studios/')) {
                        studio = $(studioEl).text().trim() || 'Unknown';
                        studioSlug = studioHref.split('/').pop() || '';
                        return false; // Break loop
                    }
                });
                // Determine if premium
                const isPremium = $card.find('.premium-badge, .t-premium, [class*="premium"]').length > 0;
                // Build full URL
                const fullUrl = href.startsWith('http') ? href : this.baseUrl + href;
                // Only add if we have essential data
                if (title && thumbnail && slug) {
                    const video = {
                        id: parseInt(videoId.replace(/\D/g, '')) || this.storage.videos.size + 1,
                        video_id: videoId,
                        title: title,
                        slug: slug,
                        duration: duration,
                        quality: quality,
                        thumbnail: thumbnail,
                        url: fullUrl,
                        embed_url: `${this.baseUrl}/embed/${slug}`,
                        studio: studio,
                        studio_slug: studioSlug,
                        category: 'General',
                        category_slug: 'general',
                        is_premium: isPremium,
                        views: Math.floor(Math.random() * 1000000) + 1000,
                        rating: (Math.random() * 2 + 3).toFixed(1),
                        added_date: new Date().toISOString(),
                        description: `${quality} video: ${title}`,
                        tags: [quality.toLowerCase(), studio.toLowerCase()].filter(Boolean)
                    };
                    this.storage.videos.set(videoId, video);
                    console.log(`Scraped video: ${title} (${quality}, ${duration})`);
                }
            });
            console.log(`Scraped ${videoCards.length} videos from page, total: ${this.storage.videos.size}`);
        }
        catch (error) {
            console.error('Error scraping videos from page:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('Response status:', error.response?.status);
                console.error('Response headers:', error.response?.headers);
            }
        }
    }
    async scrapeSearchResults(query) {
        try {
            console.log(`Scraping search results for: ${query} with pagination`);
            // Scrape multiple pages of search results
            for (let page = 1; page <= 5; page++) {
                const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}`;
                await this.scrapeVideosFromPage(searchUrl);
                // Add delay between requests
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log(`Scraped search page ${page}, total videos: ${this.storage.videos.size}`);
            }
        }
        catch (error) {
            console.error('Error scraping search results:', error);
        }
    }
    async searchVideos(searchParams = {}) {
        try {
            console.log(`Searching FapHouse videos with params:`, searchParams);
            // Always scrape fresh data for search requests (CUSAT approach)
            if (searchParams.query && searchParams.query.trim()) {
                console.log(`Scraping fresh results for query: ${searchParams.query}`);
                await this.scrapeSearchResults(searchParams.query);
            }
            else {
                console.log('Scraping latest videos from FapHouse');
                await this.scrapeLatestVideos();
            }
            // If we still have no data after scraping, initialize with fallback
            if (this.storage.videos.size === 0) {
                console.log('No scraped data available, using minimal fallback');
                this.initializeFallbackData();
            }
            let videos = Array.from(this.storage.videos.values());
            // Apply filters with improved search logic
            if (searchParams.query) {
                const query = searchParams.query.toLowerCase().trim();
                const queryWords = query.split(/\s+/).filter(word => word.length > 0);
                videos = videos.filter(video => {
                    const searchableText = [
                        video.title.toLowerCase(),
                        video.studio?.toLowerCase() || '',
                        video.category?.toLowerCase() || '',
                        video.description?.toLowerCase() || '',
                        ...(video.tags || [])
                    ].join(' ');
                    // Multiple matching strategies for better results
                    return queryWords.some(word => {
                        // Exact word match
                        if (searchableText.includes(word))
                            return true;
                        // Partial match for words 3+ characters
                        if (word.length >= 3) {
                            // Check if any part of searchable text contains the word
                            const textWords = searchableText.split(/\s+/);
                            return textWords.some(textWord => textWord.includes(word) || word.includes(textWord));
                        }
                        return false;
                    }) ||
                        // Also check if the entire query appears anywhere
                        searchableText.includes(query);
                });
                console.log(`Search for "${query}" found ${videos.length} matches out of ${Array.from(this.storage.videos.values()).length} total videos`);
            }
            if (searchParams.studio) {
                videos = videos.filter(video => video.studio_slug === searchParams.studio ||
                    (video.studio && searchParams.studio && video.studio.toLowerCase().includes(searchParams.studio.toLowerCase())));
            }
            if (searchParams.category) {
                videos = videos.filter(video => video.category_slug === searchParams.category ||
                    (video.category && searchParams.category && video.category.toLowerCase().includes(searchParams.category.toLowerCase())));
            }
            if (searchParams.quality && searchParams.quality !== 'all') {
                videos = videos.filter(video => video.quality === searchParams.quality);
            }
            if (searchParams.premium_only) {
                videos = videos.filter(video => video.is_premium);
            }
            // Apply sorting
            switch (searchParams.sort) {
                case 'popular':
                    videos.sort((a, b) => (b.views || 0) - (a.views || 0));
                    break;
                case 'trending':
                    videos.sort((a, b) => {
                        const aScore = (a.views || 0) * parseFloat(a.rating || '0');
                        const bScore = (b.views || 0) * parseFloat(b.rating || '0');
                        return bScore - aScore;
                    });
                    break;
                case 'longest':
                    videos.sort((a, b) => {
                        const aDuration = this.parseDuration(a.duration);
                        const bDuration = this.parseDuration(b.duration);
                        return bDuration - aDuration;
                    });
                    break;
                case 'shortest':
                    videos.sort((a, b) => {
                        const aDuration = this.parseDuration(a.duration);
                        const bDuration = this.parseDuration(b.duration);
                        return aDuration - bDuration;
                    });
                    break;
                case 'latest':
                default:
                    videos.sort((a, b) => {
                        const aDate = new Date(a.added_date || 0).getTime();
                        const bDate = new Date(b.added_date || 0).getTime();
                        return bDate - aDate;
                    });
                    break;
            }
            // Apply pagination
            const page = searchParams.page || 1;
            const perPage = searchParams.per_page || 20;
            const startIndex = (page - 1) * perPage;
            const paginatedVideos = videos.slice(startIndex, startIndex + perPage);
            const formattedVideos = paginatedVideos.map(video => this.formatVideo(video));
            console.log(`FapHouse Search Results: Found ${formattedVideos.length} videos from ${videos.length} total matches (query: "${searchParams.query || 'none'}")`);
            return formattedVideos;
        }
        catch (error) {
            console.error('FapHouse service error:', error);
            // Return empty array if scraping fails completely
            return [];
        }
    }
    // Helper methods
    async scrapeStudioVideos(studioSlug) {
        try {
            console.log(`Scraping videos from studio: ${studioSlug}`);
            // Scrape multiple pages from the studio
            for (let page = 1; page <= 3; page++) {
                const url = `${this.baseUrl}/studios/${studioSlug}?sort=popular&page=${page}`;
                await this.scrapeVideosFromPage(url);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        catch (error) {
            console.error(`Error scraping studio ${studioSlug}:`, error);
        }
    }
    async scrapeCategoryVideos(categorySlug) {
        try {
            console.log(`Scraping videos from category: ${categorySlug}`);
            // Scrape multiple pages from the category
            for (let page = 1; page <= 3; page++) {
                const url = `${this.baseUrl}/c/${categorySlug}/videos?page=${page}`;
                await this.scrapeVideosFromPage(url);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        catch (error) {
            console.error(`Error scraping category ${categorySlug}:`, error);
        }
    }
    async refreshScrapedData() {
        console.log('Refreshing scraped data...');
        this.storage.videos.clear();
        this.storage.studios.clear();
        this.storage.categories.clear();
        await this.initializeScrapedData();
    }
    // Public API methods
    async getVideoById(id) {
        try {
            console.log(`Fetching FapHouse video by ID: ${id}`);
            // Check cache first
            const video = this.storage.videos.get(id);
            if (video) {
                return this.formatVideo(video);
            }
            // If not in cache, try to scrape it (this would require implementing video detail scraping)
            console.log('Video not found in cache');
            return null;
        }
        catch (error) {
            console.error('FapHouse get video error:', error);
            return null;
        }
    }
    async getLatestVideos(page = 1) {
        return this.searchVideos({
            page,
            sort: 'latest',
            per_page: 20
        });
    }
    async getPopularVideos(page = 1) {
        return this.searchVideos({
            page,
            sort: 'popular',
            per_page: 20
        });
    }
    async getTrendingVideos(page = 1) {
        return this.searchVideos({
            page,
            sort: 'trending',
            per_page: 20
        });
    }
    async getPremiumVideos(page = 1) {
        return this.searchVideos({
            page,
            premium_only: true,
            sort: 'latest',
            per_page: 20
        });
    }
    async getVideosByStudio(studio, page = 1) {
        return this.searchVideos({
            page,
            studio: studio,
            sort: 'latest',
            per_page: 20
        });
    }
    async getVideosByCategory(category, page = 1) {
        return this.searchVideos({
            page,
            category: category,
            sort: 'latest',
            per_page: 20
        });
    }
    async getHDVideos(page = 1) {
        return this.searchVideos({
            page,
            quality: 'HD',
            sort: 'latest',
            per_page: 20
        });
    }
    async get4KVideos(page = 1) {
        return this.searchVideos({
            page,
            quality: '4K',
            sort: 'latest',
            per_page: 20
        });
    }
    async getStudios() {
        return Array.from(this.storage.studios.values());
    }
    async getCategories() {
        return Array.from(this.storage.categories.values());
    }
    parseDuration(duration) {
        const parts = duration.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1]; // MM:SS
        }
        else if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
        }
        return 0;
    }
    formatVideo(video) {
        return {
            id: video.video_id,
            title: video.title,
            thumbnail: video.thumbnail,
            url: video.url,
            duration: video.duration,
            quality: video.quality,
            studio: video.studio || 'Unknown',
            category: video.category || 'Unknown',
            isPremium: video.is_premium,
            views: video.views,
            rating: video.rating
        };
    }
    async checkVideoExists(videoId) {
        return this.storage.videos.has(videoId);
    }
    async getVideoCount() {
        return this.storage.videos.size;
    }
    async getStudioCount() {
        return this.storage.studios.size;
    }
    async getCategoryCount() {
        return this.storage.categories.size;
    }
    async getScrapingStats() {
        return {
            videos: this.storage.videos.size,
            studios: this.storage.studios.size,
            categories: this.storage.categories.size,
            lastUpdated: new Date().toISOString()
        };
    }
    // Fallback data initialization (minimal)
    initializeFallbackData() {
        console.log('Initializing minimal fallback demo data...');
        // Add a few demo videos as fallback
        const demoVideos = [
            {
                id: 1,
                video_id: 'demo_1',
                title: 'Sample FapHouse Video 1',
                slug: 'sample-video-1',
                duration: '15:30',
                quality: 'HD',
                thumbnail: 'https://via.placeholder.com/300x200?text=FapHouse+Demo+1',
                url: `${this.baseUrl}/videos/sample-video-1`,
                embed_url: `${this.baseUrl}/embed/sample-video-1`,
                studio: 'Demo Studio',
                studio_slug: 'demo-studio',
                category: 'Demo Category',
                category_slug: 'demo-category',
                is_premium: false,
                views: 125000,
                rating: '4.2',
                added_date: new Date().toISOString(),
                description: 'Demo FapHouse video for testing',
                tags: ['demo', 'sample', 'hd']
            }
        ];
        demoVideos.forEach(video => {
            this.storage.videos.set(video.video_id, video);
        });
        console.log(`Initialized ${demoVideos.length} fallback videos`);
    }
}
exports.default = new FapHouseService();
