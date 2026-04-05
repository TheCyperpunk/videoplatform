import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

export const metadata: Metadata = {
  title: "Desimallu – Free Porn Videos & Streaming",
  description: "Watch the best free porn, adult videos, and premium XXX content. Find trending pornstars and explore HD videos on Desimallu.",
  keywords: ["porn", "adult videos", "desimallu", "XXX", "free porn", "streaming", "HD porn", "categories"],
  openGraph: {
    title: "Desimallu – Free Porn Videos & Streaming",
    description: "Watch the best free porn, adult videos, and premium XXX content. Find trending pornstars and explore HD videos on Desimallu.",
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
    title: "Desimallu – Free Porn Videos & Streaming",
    description: "Watch the best free porn, adult videos, and premium XXX content. Find trending pornstars and explore HD videos on Desimallu.",
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
