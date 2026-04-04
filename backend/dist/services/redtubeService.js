"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class RedTubeService {
    constructor() {
        this.baseUrl = 'https://api.redtube.com';
    }
    async searchVideos(searchParams = {}) {
        try {
            // Enhanced: Fetch multiple pages for more results
            const maxPages = 3; // Fetch 3 pages for more comprehensive results
            const allVideos = [];
            for (let page = 1; page <= maxPages; page++) {
                const params = {
                    data: 'redtube.Videos.searchVideos',
                    output: 'json',
                    thumbsize: searchParams.thumbsize || 'big',
                    page: page.toString()
                };
                // Add optional search parameters
                if (searchParams.search) {
                    params.search = searchParams.search;
                }
                if (searchParams.tags && searchParams.tags.length > 0) {
                    // Handle multiple tags as separate parameters
                    searchParams.tags.forEach((tag, index) => {
                        params[`tags[${index}]`] = tag;
                    });
                }
                if (searchParams.ordering) {
                    params.ordering = searchParams.ordering;
                }
                if (searchParams.period) {
                    params.period = searchParams.period;
                }
                console.log(`Fetching RedTube videos page ${page} with params:`, params);
                const response = await axios_1.default.get(this.baseUrl, {
                    params,
                    timeout: 30000 // Increased to 30s for reliability
                });
                if (!response.data || !response.data.videos) {
                    console.log(`No videos found in response for page ${page}`);
                    break; // Stop if no more results
                }
                // Handle the nested structure: videos.video can be array or single object
                let videoArray = [];
                if (Array.isArray(response.data.videos)) {
                    videoArray = response.data.videos.map((item) => item.video);
                }
                else if (response.data.videos.video) {
                    const videoData = response.data.videos.video;
                    videoArray = Array.isArray(videoData)
                        ? videoData
                        : [videoData];
                }
                const pageVideos = videoArray.map(video => this.formatVideo(video));
                allVideos.push(...pageVideos);
                console.log(`RedTube page ${page}: ${pageVideos.length} videos (total: ${allVideos.length})`);
                // Add delay between requests to avoid rate limiting
                if (page < maxPages) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                // Stop if we got fewer results than expected (end of results)
                if (pageVideos.length < 20) {
                    console.log(`RedTube: Reached end of results at page ${page}`);
                    break;
                }
            }
            console.log(`Found ${allVideos.length} total videos from RedTube (${maxPages} pages)`);
            return allVideos;
        }
        catch (error) {
            console.error('RedTube API error:', error);
            if (axios_1.default.isAxiosError(error)) {
                console.error('Response data:', error.response?.data);
                console.error('Response status:', error.response?.status);
            }
            return [];
        }
    }
    async getTrendingVideos(page = 1, period = 'weekly') {
        return this.searchVideos({
            page,
            ordering: 'mostviewed',
            period,
            thumbsize: 'big'
        });
    }
    async getVideosByTags(tags, page = 1) {
        return this.searchVideos({
            tags,
            page,
            thumbsize: 'big',
            ordering: 'newest'
        });
    }
    async getNewestVideos(page = 1) {
        return this.searchVideos({
            page,
            ordering: 'newest',
            thumbsize: 'big'
        });
    }
    async getTopRatedVideos(page = 1, period = 'alltime') {
        return this.searchVideos({
            page,
            ordering: 'rating',
            period,
            thumbsize: 'big'
        });
    }
    formatVideo(video) {
        return {
            id: video.video_id,
            title: video.title,
            thumbnail: video.thumb || video.default_thumb,
            url: video.url,
            duration: video.duration,
            views: video.views,
            rating: video.rating,
            embedUrl: video.embed_url,
            tags: video.tags?.map((tag) => tag.tag_name) || [],
            thumbs: video.thumbs || []
        };
    }
}
exports.default = new RedTubeService();
