import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

export const metadata: Metadata = {
  title: "Desimallu – Stream. Discover. Explore.",
  description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Desimallu.",
  keywords: ["videos", "streaming", "video discovery", "explore", "trending", "categories"],
  openGraph: {
    title: "Desimallu – Stream. Discover. Explore.",
    description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Desimallu.",
    type: "website",
    url: baseUrl,
    siteName: "Desimallu",
    locale: "en_US",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Desimallu Video Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desimallu – Stream. Discover. Explore.",
    description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Desimallu.",
    images: [`${baseUrl}/twitter-image.png`],
    creator: "@desimallu",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function HomePage() {
  return <HomeClient />;
}
