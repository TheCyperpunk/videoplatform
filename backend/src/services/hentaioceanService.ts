import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  HentaiOceanApiResponse,
  HentaiOceanVideoData,
  HentaiOceanSearchParams,
} from '../types/hentaiocean';

class HentaiOceanService {
  private readonly baseUrl = 'https://hentaiocean.com';
  private readonly rssUrl = 'https://hentaiocean.com/rss.xml';

  // Extract slug from a HentaiOcean URL like https://hentaiocean.com/watch/my-mother-1/
  private extractSlug(url: string): string {
    return url.replace(/\/$/, '').split('/').pop() || '';
  }

  // Build thumbnail URL from slug
  private thumbnailUrl(slug: string): string {
    return `${this.baseUrl}/thumbnail/${slug}.webp`;
  }

  // Build embed/watch URL from slug
  private watchUrl(slug: string): string {
    return `${this.baseUrl}/watch/${slug}/`;
  }

  // Fetch metadata for a single slug via the Hentai Ocean API
  async getVideoBySlug(slug: string): Promise<HentaiOceanVideoData | null> {
    try {
      const response = await axios.get<HentaiOceanApiResponse>(
        `${this.baseUrl}/api`,
        {
          params: { action: 'hentai', slug },
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
        }
      );

      const info = response.data?.info?.[0];
      if (!info) return null;

      return {
        id: info.urlname,
        title: info.videoname,
        thumbnail: this.thumbnailUrl(info.urlname),
        url: this.watchUrl(info.urlname),
        releaseDate: info.releasedate,
        description: info.description,
        genres: (response.data.genres || []).map((g: any) => g.genre),
        coverUrl: `${this.baseUrl}/assets/cover/${info.coverimg}`,
      };
    } catch (error) {
      console.error(`HentaiOcean getVideoBySlug error for "${slug}":`, error);
      return null;
    }
  }

  // Fetch the latest videos from the RSS feed - Enhanced with higher limits
  async getLatestVideos(page: number = 1, perPage: number = 50): Promise<HentaiOceanVideoData[]> {
    try {
      console.log(`HentaiOcean: fetching RSS feed (page ${page}, perPage ${perPage})`);
      const response = await axios.get<string>(this.rssUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
        responseType: 'text',
      });

      const $ = cheerio.load(response.data, { xmlMode: true });
      const items = $('item').toArray();

      // Simple pagination over RSS items with higher limits
      const start = (page - 1) * perPage;
      const pageItems = items.slice(start, start + perPage);

      const videos: HentaiOceanVideoData[] = pageItems.map((el: any) => {
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
    } catch (error) {
      console.error('HentaiOcean getLatestVideos error:', error);
      return [];
    }
  }

  // Search via HTML scraping and RSS feed - Enhanced strategy
  async searchVideos(params: HentaiOceanSearchParams = {}): Promise<HentaiOceanVideoData[]> {
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
      const uniqueVideos = allVideos.filter((video, index, self) => 
        index === self.findIndex(v => v.id === video.id)
      );

      console.log(`HentaiOcean: HTML=${htmlResults.length}, RSS=${rssResults.length}, unique=${uniqueVideos.length}`);
      return uniqueVideos;
    } catch (error) {
      console.error('HentaiOcean searchVideos error:', error);
      return [];
    }
  }

  // New method to search through RSS feed
  private async searchRSSFeed(query: string, limit: number = 50): Promise<HentaiOceanVideoData[]> {
    try {
      console.log(`HentaiOcean: searching RSS feed for "${query}"`);
      const response = await axios.get<string>(this.rssUrl, {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; VideoSearchBot/1.0)' },
        responseType: 'text',
      });

      const $ = cheerio.load(response.data, { xmlMode: true });
      const items = $('item').toArray();

      // Filter RSS items by query and take more items
      const matchingItems = items.filter((el: any) => {
        const title = $(el).find('title').text().trim().toLowerCase();
        const description = $(el).find('description').text().trim().toLowerCase();
        const queryLower = query.toLowerCase();
        
        return title.includes(queryLower) || description.includes(queryLower);
      }).slice(0, limit);

      const videos: HentaiOceanVideoData[] = matchingItems.map((el: any) => {
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
    } catch (error) {
      console.error('HentaiOcean searchRSSFeed error:', error);
      return [];
    }
  }

  // Helper method to search a single page
  private async searchSinglePage(query: string, page: number, per_page: number): Promise<HentaiOceanVideoData[]> {
    const searchUrl = `${this.baseUrl}/`;
    const response = await axios.get<string>(searchUrl, {
      params: { s: query, paged: page },
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      responseType: 'text',
    });

    const $ = cheerio.load(response.data);
    const videos: HentaiOceanVideoData[] = [];

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
        items.slice(0, per_page).each((_: any, el: any) => {
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
      $('a[href*="/watch/"]').slice(0, per_page).each((_: any, el: any) => {
        const href = $(el).attr('href') || '';
        const slug = this.extractSlug(href);
        if (!slug) return;

        // Avoid duplicates
        if (videos.find((v) => v.id === slug)) return;

        const title =
          $(el).attr('title') ||
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
  private async getMultiPageLatest(maxPages: number = 3, perPage: number = 50): Promise<HentaiOceanVideoData[]> {
    try {
      console.log(`HentaiOcean: fetching ${maxPages} pages of latest videos`);
      
      const pagePromises = [];
      for (let p = 1; p <= maxPages; p++) {
        pagePromises.push(
          this.getLatestVideos(p, perPage).catch(error => {
            console.error(`HentaiOcean latest page ${p} error:`, error);
            return [];
          })
        );
      }

      const pageResults = await Promise.all(pagePromises);
      const allVideos: HentaiOceanVideoData[] = [];

      pageResults.forEach((videos, pageIndex) => {
        console.log(`HentaiOcean: latest page ${pageIndex + 1} returned ${videos.length} results`);
        allVideos.push(...videos);
      });

      // Remove duplicates
      const uniqueVideos = allVideos.filter((video, index, self) => 
        index === self.findIndex(v => v.id === video.id)
      );

      console.log(`HentaiOcean: total ${uniqueVideos.length} unique latest videos`);
      return uniqueVideos;
    } catch (error) {
      console.error('HentaiOcean getMultiPageLatest error:', error);
      return [];
    }
  }
}

export default new HentaiOceanService();