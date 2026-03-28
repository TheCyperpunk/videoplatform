import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { SearchProvider } from "@/context/SearchContext";
import { AgeVerificationModal } from "@/components/layout/AgeVerificationModal";

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://videx.com";

export const metadata: Metadata = {
  title: "Videx – Stream. Discover. Explore.",
  description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Videx.",
  authors: [{ name: "Videx Team" }],
  creator: "Videx",
  publisher: "Videx",
  keywords: ["videos", "streaming", "video discovery", "explore", "trending"],
  other: {
    "RATING": "RTA-5042-1996-1400-1577-RTA",
  },
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
        type: "image/png",
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
    name: "Videx",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Videx.",
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
      <body className="bg-[#0A0A0A] text-white min-h-screen antialiased">
        <Providers>
          <SearchProvider>
            <AgeVerificationModal />
            <Navbar />
            <main>
              {children}
            </main>
          </SearchProvider>
        </Providers>
      </body>
    </html>
  );
}
