import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://videx.com';

// This runs once to figure out how many XML files to chunk the database into
export async function generateSitemaps() {
  try {
    const res = await fetch(`${BASE_URL}/api/sitemap/count`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch sitemap count");
    
    const { totalPages } = await res.json();
    
    const sitemaps = [];
    const pagesToGenerate = Math.max(1, totalPages || 1);
    
    for (let i = 0; i < pagesToGenerate; i++) {
        sitemaps.push({ id: i });
    }
    return sitemaps;
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return [{ id: 0 }]; // Always generate at least one sitemap
  }
}

// This runs for each ID to generate the actual XML contents for that chunk
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const page = id; // API is 0-indexed
  
  let urls: MetadataRoute.Sitemap = [];
  
  try {
    const res = await fetch(`${BASE_URL}/api/sitemap/videos/${page}`, { next: { revalidate: 3600 } });
    if (res.ok) {
        const { data } = await res.json();
        if (data && Array.isArray(data)) {
            urls = data.map((video: any) => ({
                url: `${FRONTEND_URL}/video/${video.id}`,
                lastModified: video.updatedAt ? new Date(video.updatedAt) : new Date(),
                changeFrequency: 'weekly', // Adult videos don't change often once posted
                priority: 0.8,
            }));
        }
    }
  } catch (error) {
    console.error(`Error fetching sitemap data for page ${page}:`, error);
  }

  // Inject vital static pages into the very first sitemap file (sitemap/0.xml)
  if (id === 0) {
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: `${FRONTEND_URL}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${FRONTEND_URL}/explore`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${FRONTEND_URL}/adult-series`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${FRONTEND_URL}/category/jav`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `${FRONTEND_URL}/category/hentai`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
      {
        url: `${FRONTEND_URL}/category/webseries`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      }
    ];
    return [...staticPages, ...urls];
  }

  return urls;
}
