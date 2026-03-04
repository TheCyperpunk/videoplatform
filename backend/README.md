# Videx Backend

Backend API server for the Videx video platform.

## Structure

```
backend/
  api/         ← Copied API route handlers from Next.js
    videos/    ← /api/videos
    search/    ← /api/search
    trending/  ← /api/trending
    categories/← /api/categories
    scraper/   ← /api/scraper
  data/        ← Static JSON data files (videos.json, categories.json)
  lib/         ← Shared utilities (videos.ts, utils.ts, validations.ts)
  types/       ← TypeScript type definitions
  package.json
  server.js    ← Express server entry point (to be created)
```

## Getting Started

```bash
npm install
npm run dev
```

The server runs on `http://localhost:4000` by default.
