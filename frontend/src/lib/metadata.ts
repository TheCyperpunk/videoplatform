import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

/**
 * Generate metadata for the Explore page
 */
export function generateExploreMetadata(): Metadata {
  return {
    title: "Explore Free Porn Videos | Desimallu",
    description: "Browse and discover premium porn videos on Desimallu. Filter by category, sort by trending, newest, or most popular XXX content.",
    keywords: ["explore porn", "porn video discovery", "browse XXX videos", "trending porn", "adult categories"],
    openGraph: {
      title: "Explore Free Porn Videos | Desimallu",
      description: "Browse and discover premium porn videos on Desimallu. Filter by category, sort by trending, newest, or most popular XXX content.",
      type: "website",
      url: `${baseUrl}/explore`,
      siteName: "Desimallu",
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
      title: "Explore Free Porn Videos | Desimallu",
      description: "Browse and discover premium porn videos on Desimallu. Filter by category, sort by trending, newest, or most popular XXX content.",
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
    title: "Adult Web Series & XXX | Desimallu",
    description: "Discover exclusive adult web series on Desimallu. Browse the latest explicit web series content, filter by quality, and explore trending 18+ shows.",
    keywords: ["adult web series", "porn series", "XXX episodes", "streaming adult series", "18+ content"],
    openGraph: {
      title: "Adult Web Series & XXX | Desimallu",
      description: "Discover exclusive adult web series on Desimallu. Browse the latest explicit web series content and explore trending 18+ shows.",
      type: "website",
      url: `${baseUrl}/adult-series`,
      siteName: "Desimallu",
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
      title: "Adult Web Series & XXX | Desimallu",
      description: "Discover exclusive adult web series on Desimallu. Browse the latest explicit web series content and explore trending 18+ shows.",
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
  const title = `Free ${query} Porn Videos${categoryText} | Desimallu`;
  const description = `Search results for "${query}"${categoryText} on Desimallu. Discover free porn videos, filter by quality, and explore HD XXX content.`;

  return {
    title,
    description,
    keywords: [query, "porn videos", "search XXX", category || ""].filter(Boolean),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/explore?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ""}`,
      siteName: "Desimallu",
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
  const title = `${categoryName} Porn Videos | Desimallu`;
  const description = `Browse free ${categoryName} porn videos on Desimallu. Discover trending ${categoryName} XXX content, filter by HD quality, and explore top adult videos.`;

  return {
    title,
    description,
    keywords: [categoryName, "porn videos", "XXX category", categorySlug, "adult streaming"],
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/category/${categorySlug}`,
      siteName: "Desimallu",
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
  const title = `${video.title} - Free Porn Video | Desimallu`;
  const description = video.description || `Watch free XXX video ${video.title} on Desimallu. ${video.views ? `${video.views} views.` : ""}`;

  return {
    title,
    description,
    keywords: [video.title, "porn video", "watch free XXX", video.channel?.name || ""].filter(Boolean),
    openGraph: {
      title: video.title,
      description,
      type: "video.other",
      url: `${baseUrl}/video/${video.id}`,
      siteName: "Desimallu",
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
