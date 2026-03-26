/**
 * Schema.org JSON-LD generation utilities for SEO
 */

export interface SchemaOrganization {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

export interface SchemaVideoObject {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
  interactionCount?: string;
}

export interface SchemaSearchAction {
  "@context": string;
  "@type": string;
  url: string;
  potentialAction: {
    "@type": string;
    target: {
      "@type": string;
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface SchemaBreadcrumb {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate Organization schema for the website
 */
export function generateOrganizationSchema(baseUrl: string): SchemaOrganization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Videx",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Videx.",
    sameAs: [
      "https://twitter.com/videx",
      "https://facebook.com/videx",
    ],
  };
}

/**
 * Generate SearchAction schema for search functionality
 */
export function generateSearchActionSchema(baseUrl: string): SchemaSearchAction {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/explore?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate VideoObject schema for individual videos
 */
export function generateVideoObjectSchema(
  video: {
    id: string;
    title: string;
    description?: string;
    thumbnail: string;
    publishedAt?: string;
    duration?: string;
    views?: number;
  },
  baseUrl: string
): SchemaVideoObject {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description || video.title,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.publishedAt || new Date().toISOString(),
    duration: formatDurationToISO(video.duration || "0:00"),
    contentUrl: `${baseUrl}/video/${video.id}`,
    interactionCount: video.views ? `${video.views}` : "0",
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>,
  baseUrl: string
): SchemaBreadcrumb {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

/**
 * Convert duration string (MM:SS or H:MM:SS) to ISO 8601 format (PT format)
 */
function formatDurationToISO(duration: string): string {
  if (!duration) return "PT0S";

  const parts = duration.split(":").map(Number);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 2) {
    [minutes, seconds] = parts;
  } else if (parts.length === 3) {
    [hours, minutes, seconds] = parts;
  }

  let iso = "PT";
  if (hours > 0) iso += `${hours}H`;
  if (minutes > 0) iso += `${minutes}M`;
  if (seconds > 0) iso += `${seconds}S`;

  return iso || "PT0S";
}

/**
 * Generate AggregateOffer schema for video collections
 */
export function generateAggregateOfferSchema(
  title: string,
  description: string,
  videoCount: number,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: title,
    description: description,
    priceCurrency: "USD",
    price: "0",
    availability: "https://schema.org/InStock",
    url: baseUrl,
    offerCount: videoCount,
  };
}
