import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

export const metadata: Metadata = {
  title: "Videx – Stream. Discover. Explore.",
  description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Videx.",
  keywords: ["videos", "streaming", "video discovery", "explore", "trending", "categories"],
  openGraph: {
    title: "Videx – Stream. Discover. Explore.",
    description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Videx.",
    type: "website",
    url: baseUrl,
    siteName: "Videx",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Videx Video Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Videx – Stream. Discover. Explore.",
    description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Videx.",
    images: [`${baseUrl}/twitter-image.png`],
    creator: "@videx",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function HomePage() {
  return <HomeClient />;
}
