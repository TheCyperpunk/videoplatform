import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Original patterns
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
      { protocol: "https", hostname: "*.ytimg.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.ttcache.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      // Scraped site thumbnails
      { protocol: "https", hostname: "*.assoass.com" },
      { protocol: "https", hostname: "assoass.com" },
      { protocol: "https", hostname: "*.uncutmaza.com.co" },
      { protocol: "https", hostname: "uncutmaza.com.co" },
      { protocol: "https", hostname: "*.dinotube.com" },
      { protocol: "https", hostname: "dinotube.com" },
      { protocol: "https", hostname: "*.desihub.org" },
      { protocol: "https", hostname: "desihub.org" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "*.ibb.co" },
      { protocol: "https", hostname: "*.desixnxx.net" },
      { protocol: "https", hostname: "desixnxx.net" },
      { protocol: "https", hostname: "*.xvideos.com" },
      { protocol: "https", hostname: "*.xnxx.com" },
      { protocol: "https", hostname: "*.pornhub.com" },
      { protocol: "https", hostname: "*.xhamster.com" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
      // Additional fallback image sources
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      { protocol: "https", hostname: "m3.imgdf.shop" },
      { protocol: "https", hostname: "imggen.eporner.com" },
      { protocol: "https", hostname: "masafun.io.in" },
      { protocol: "https", hostname: "area51.porn" },
      { protocol: "https", hostname: "*.jilkatha.com" },
      { protocol: "https", hostname: "jilkatha.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
