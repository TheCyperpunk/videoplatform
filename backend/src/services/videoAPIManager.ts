import redtubeService from './redtubeService';
import apijavService from './apijavService';
import epornerService from './epornerService';
import faphouseService from './faphouseService';

export interface UnifiedVideoResult {
  source: string;
  videos: any[];
  error?: string;
}

export interface UnifiedSearchResult {
  redtube: any[];
  apijav: any[];
  eporner: any[];
  faphouse: any[];
  totalCount: number;
  query: string;
  page: number;
}

export class VideoAPIManager {
  /**
   * Search all APIs simultaneously and return organized results
   */
  async searchAllAPIs(query: string, page: number = 1): Promise<UnifiedSearchResult> {
    const results = await Promise.allSettled([
      redtubeService.searchVideos({ search: query, page }),
      apijavService.searchVideos({ search: query, page }),
      epornerService.searchVideos({ query, page }),
      faphouseService.searchVideos({ query, page })
    ]);

    const redtube = results[0].status === 'fulfilled' ? results[0].value : [];
    const apijav = results[1].status === 'fulfilled' ? results[1].value : [];
    const eporner = results[2].status === 'fulfilled' ? results[2].value : [];
    const faphouse = results[3].status === 'fulfilled' ? results[3].value : [];

    const totalCount = redtube.length + apijav.length + eporner.length + faphouse.length;

    return {
      redtube,
      apijav,
      eporner,
      faphouse,
      totalCount,
      query,
      page
    };
  }

  /**
   * Search specific APIs only
   */
  async searchSelectedAPIs(query: string, sources: string[], page: number = 1): Promise<Record<string, any[]>> {
    const searchPromises = sources.map(async (source) => {
      try {
        switch (source.toLowerCase()) {
          case 'redtube':
            return { source: 'redtube', data: await redtubeService.searchVideos({ search: query, page }) };
          case 'apijav':
            return { source: 'apijav', data: await apijavService.searchVideos({ search: query, page }) };
          case 'eporner':
            return { source: 'eporner', data: await epornerService.searchVideos({ query, page }) };
          case 'faphouse':
            return { source: 'faphouse', data: await faphouseService.searchVideos({ query, page }) };
          default:
            return { source, data: [] };
        }
      } catch (error) {
        console.error(`Error searching ${source}:`, error);
        return { source, data: [] };
      }
    });

    const searchResults = await Promise.all(searchPromises);
    
    const results: Record<string, any[]> = {};
    searchResults.forEach(result => {
      results[result.source] = result.data;
    });

    return results;
  }

  /**
   * Get trending videos from all APIs
   */
  async getTrendingFromAllAPIs(page: number = 1): Promise<UnifiedSearchResult> {
    const results = await Promise.allSettled([
      redtubeService.getTrendingVideos(page),
      apijavService.getTrendingVideos(page),
      epornerService.getMostPopularVideos(page),
      faphouseService.getTrendingVideos(page)
    ]);

    const redtube = results[0].status === 'fulfilled' ? results[0].value : [];
    const apijav = results[1].status === 'fulfilled' ? results[1].value : [];
    const eporner = results[2].status === 'fulfilled' ? results[2].value : [];
    const faphouse = results[3].status === 'fulfilled' ? results[3].value : [];

    const totalCount = redtube.length + apijav.length + eporner.length + faphouse.length;

    return {
      redtube,
      apijav,
      eporner,
      faphouse,
      totalCount,
      query: 'trending',
      page
    };
  }

  /**
   * Get latest videos from all APIs
   */
  async getLatestFromAllAPIs(page: number = 1): Promise<UnifiedSearchResult> {
    const results = await Promise.allSettled([
      redtubeService.getNewestVideos(page),
      apijavService.getNewestVideos(page),
      epornerService.getLatestVideos(page),
      faphouseService.getLatestVideos(page)
    ]);

    const redtube = results[0].status === 'fulfilled' ? results[0].value : [];
    const apijav = results[1].status === 'fulfilled' ? results[1].value : [];
    const eporner = results[2].status === 'fulfilled' ? results[2].value : [];
    const faphouse = results[3].status === 'fulfilled' ? results[3].value : [];

    const totalCount = redtube.length + apijav.length + eporner.length + faphouse.length;

    return {
      redtube,
      apijav,
      eporner,
      faphouse,
      totalCount,
      query: 'latest',
      page
    };
  }

  /**
   * Get API service instances for direct access
   */
  getServices() {
    return {
      redtube: redtubeService,
      apijav: apijavService,
      eporner: epornerService,
      faphouse: faphouseService
    };
  }
}

export default new VideoAPIManager();