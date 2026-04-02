import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { SearchProvider } from "@/context/SearchContext";
import { AgeVerificationWrapper } from "@/components/layout/AgeVerificationWrapper";
import { PopupAd } from "@/components/ads/PopupAd";
import { RotatingLeaderboard } from "@/components/ads/RotatingLeaderboard";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

export const metadata: Metadata = {
  title: "Desimallu – Stream. Discover. Explore.",
  description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Desimallu.",
  authors: [{ name: "Desimallu Team" }],
  creator: "Desimallu",
  publisher: "Desimallu",
  keywords: ["videos", "streaming", "video discovery", "explore", "trending"],
  other: {
    "RATING": "RTA-5042-1996-1400-1577-RTA",
  },
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
        type: "image/png",
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
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization and SearchAction schemas
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Desimallu",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Desimallu.",
    sameAs: [
      "https://twitter.com/videx",
      "https://facebook.com/videx",
    ],
  };

  const searchActionSchema = {
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

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0A0A0A" />
        {/* RTA Label - Restricted To Adults */}
        <meta name="RATING" content="RTA-5042-1996-1400-1577-RTA" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
        />
      </head>
      <body className="bg-[#0A0A0A] text-white min-h-screen antialiased flex flex-col">
        <Providers>
          <SearchProvider>
            <AgeVerificationWrapper />
            <PopupAd />
            <Navbar />
            <RotatingLeaderboard />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </SearchProvider>
        </Providers>
      </body>
    </html>
  );
}
