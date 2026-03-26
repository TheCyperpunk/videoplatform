import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/adult-series`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Category pages
  const categories = [
    { slug: "jav", name: "JAV" },
    { slug: "hentai", name: "Hentai" },
    { slug: "webseries", name: "Web Series" },
    { slug: "technology", name: "Technology" },
    { slug: "travel", name: "Travel" },
    { slug: "food", name: "Food" },
    { slug: "music", name: "Music" },
    { slug: "fitness", name: "Fitness" },
    { slug: "science", name: "Science" },
    { slug: "business", name: "Business" },
    { slug: "lifestyle", name: "Lifestyle" },
    { slug: "history", name: "History" },
    { slug: "gaming", name: "Gaming" },
    { slug: "art", name: "Art" },
    { slug: "sports", name: "Sports" },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages];
}
