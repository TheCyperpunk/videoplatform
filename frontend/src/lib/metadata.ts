import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

/**
 * Generate metadata for the Explore page
 */
export function generateExploreMetadata(): Metadata {
  return {
    title: "Explore Videos | Videx – Stream. Discover. Explore.",
    description: "Browse and discover videos on Videx. Filter by category, sort by trending, newest, or most popular. Find your next favorite video.",
    keywords: ["explore videos", "video discovery", "browse videos", "trending videos", "video categories"],
    openGraph: {
      title: "Explore Videos | Videx",
      description: "Browse and discover videos on Videx. Filter by category, sort by trending, newest, or most popular.",
      type: "website",
      url: `${baseUrl}/explore`,
      siteName: "Videx",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Explore Videos on Videx",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Explore Videos | Videx",
      description: "Browse and discover videos on Videx. Filter by category, sort by trending, newest, or most popular.",
      images: [`${baseUrl}/twitter-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/explore`,
    },
  };
}

/**
 * Generate metadata for the Adult Series page
 */
export function generateAdultSeriesMetadata(): Metadata {
  return {
    title: "Adult Web Series | Videx – Stream. Discover. Explore.",
    description: "Discover adult web series on Videx. Browse the latest web series content, filter by quality, and explore trending shows.",
    keywords: ["adult web series", "web series", "adult content", "streaming series"],
    openGraph: {
      title: "Adult Web Series | Videx",
      description: "Discover adult web series on Videx. Browse the latest web series content and explore trending shows.",
      type: "website",
      url: `${baseUrl}/adult-series`,
      siteName: "Videx",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Adult Web Series on Videx",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Adult Web Series | Videx",
      description: "Discover adult web series on Videx. Browse the latest web series content and explore trending shows.",
      images: [`${baseUrl}/twitter-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/adult-series`,
    },
  };
}

/**
 * Generate metadata for search results
 */
export function generateSearchMetadata(query: string, category?: string): Metadata {
  const categoryText = category ? ` in ${category}` : "";
  const title = `${query} Videos${categoryText} | Videx`;
  const description = `Search results for "${query}"${categoryText} on Videx. Discover videos, filter by quality, and explore more.`;

  return {
    title,
    description,
    keywords: [query, "videos", "search", category || ""].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/explore?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ""}`,
      siteName: "Videx",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${query} Videos on Videx`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/twitter-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(categoryName: string, categorySlug: string): Metadata {
  const title = `${categoryName} Videos | Videx`;
  const description = `Browse ${categoryName} videos on Videx. Discover trending ${categoryName} content, filter by quality, and explore more.`;

  return {
    title,
    description,
    keywords: [categoryName, "videos", "category", categorySlug],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/category/${categorySlug}`,
      siteName: "Videx",
      locale: "en_US",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${categoryName} Videos on Videx`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/twitter-image.png`],
    },
    alternates: {
      canonical: `${baseUrl}/category/${categorySlug}`,
    },
  };
}

/**
 * Generate metadata for video detail pages
 */
export function generateVideoMetadata(video: {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  channel?: { name: string };
  views?: number;
  duration?: string;
}): Metadata {
  const title = `${video.title} | Videx`;
  const description = video.description || `Watch ${video.title} on Videx. ${video.views ? `${video.views} views.` : ""}`;

  return {
    title,
    description,
    keywords: [video.title, "video", "watch", video.channel?.name || ""].filter(Boolean),
    openGraph: {
      title: video.title,
      description,
      type: "video.other",
      url: `${baseUrl}/video/${video.id}`,
      siteName: "Videx",
      locale: "en_US",
      images: [
        {
          url: video.thumbnail,
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: "player",
      title: video.title,
      description,
      images: [video.thumbnail],
    },
    alternates: {
      canonical: `${baseUrl}/video/${video.id}`,
    },
  };
}
