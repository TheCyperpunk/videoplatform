import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/layout/Providers";
import { SearchProvider } from "@/context/SearchContext";

export const metadata: Metadata = {
  title: "Videx – Stream. Discover. Explore.",
  description: "A modern video discovery platform. Find trending, browse categories, and explore videos on Videx.",
  openGraph: {
    title: "Videx – Stream. Discover. Explore.",
    description: "A modern video discovery platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="bg-[#0A0A0A] text-white min-h-screen antialiased">
        <Providers>
          <SearchProvider>
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
