# Video Platform API Integration

This document describes the integration of 4 adult content APIs into the Videx backend platform.

## 🎯 Integrated APIs

1. **RedTube API** - Popular adult video platform
2. **APIJAV API** - Japanese adult video content
3. **Eporner API** - Adult video search and streaming
4. **FapHouse API** - Premium adult content platform

## 📁 File Structure

```
backend/src/
├── types/
│   ├── redtube.ts      # RedTube API type definitions
│   ├── apijav.ts       # APIJAV API type definitions
│   ├── eporner.ts      # Eporner API type definitions
│   └── faphouse.ts     # FapHouse API type definitions
├── services/
│   ├── redtubeService.ts    # RedTube API service
│   ├── apijavService.ts     # APIJAV API service
│   ├── epornerService.ts    # Eporner API service
│   ├── faphouseService.ts   # FapHouse API service
│   └── videoAPIManager.ts   # Unified API manager
└── server.ts           # Main server with integrated endpoints
```

## 🚀 API Endpoints

### RedTube API Endpoints
- `GET /api/redtube/search` - Search videos
- `GET /api/redtube/trending` - Get trending videos
- `GET /api/redtube/newest` - Get newest videos
- `GET /api/redtube/top-rated` - Get top rated videos
- `GET /api/redtube/tags/:tags` - Get videos by tags

### APIJAV API Endpoints
- `GET /api/apijav/search` - Search videos
- `GET /api/apijav/video/:id` - Get video by ID
- `GET /api/apijav/player/:id` - Get player info
- `GET /api/apijav/trending` - Get trending videos
- `GET /api/apijav/newest` - Get newest videos
- `GET /api/apijav/category/:category` - Get videos by category
- `GET /api/apijav/studio/:studio` - Get videos by studio
- `GET /api/apijav/actor/:actor` - Get videos by actor
- `GET /api/apijav/hd` - Get HD videos

### Eporner API Endpoints
- `GET /api/eporner/search` - Search videos
- `GET /api/eporner/video/:id` - Get video by ID
- `GET /api/eporner/latest` - Get latest videos
- `GET /api/eporner/top-rated` - Get top rated videos
- `GET /api/eporner/most-popular` - Get most popular videos
- `GET /api/eporner/top-weekly` - Get top weekly videos
- `GET /api/eporner/top-monthly` - Get top monthly videos
- `GET /api/eporner/longest` - Get longest videos
- `GET /api/eporner/shortest` - Get shortest videos
- `GET /api/eporner/removed` - Get removed video IDs

### FapHouse API Endpoints
- `GET /api/faphouse/search` - Search videos
- `GET /api/faphouse/video/:id` - Get video by ID
- `GET /api/faphouse/latest` - Get latest videos
- `GET /api/faphouse/popular` - Get popular videos
- `GET /api/faphouse/trending` - Get trending videos
- `GET /api/faphouse/premium` - Get premium videos
- `GET /api/faphouse/studio/:studio` - Get videos by studio
- `GET /api/faphouse/category/:category` - Get videos by category
- `GET /api/faphouse/hd` - Get HD videos
- `GET /api/faphouse/4k` - Get 4K videos
- `GET /api/faphouse/studios` - Get all studios
- `GET /api/faphouse/categories` - Get all categories

### Unified Search Endpoint
- `GET /api/external/search` - Search across multiple APIs simultaneously

## 🔧 Usage Examples

### Basic Search
```bash
# Search RedTube
curl "http://localhost:5000/api/redtube/search?search=nurse&page=1"

# Search APIJAV
curl "http://localhost:5000/api/apijav/search?search=nurse&page=1"

# Search Eporner
curl "http://localhost:5000/api/eporner/search?query=nurse&page=1"

# Search FapHouse
curl "http://localhost:5000/api/faphouse/search?query=nurse&page=1"
```

### Unified Search (All APIs)
```bash
# Search all APIs
curl "http://localhost:5000/api/external/search?query=nurse&page=1"

# Search specific APIs only
curl "http://localhost:5000/api/external/search?query=nurse&page=1&sources=redtube,faphouse"
```

### Get Trending Content
```bash
# RedTube trending
curl "http://localhost:5000/api/redtube/trending?page=1&period=weekly"

# APIJAV trending
curl "http://localhost:5000/api/apijav/trending?page=1"

# Eporner most popular
curl "http://localhost:5000/api/eporner/most-popular?page=1"

# FapHouse trending
curl "http://localhost:5000/api/faphouse/trending?page=1"
```

## 💻 Programmatic Usage

### Using Individual Services
```typescript
import redtubeService from './services/redtubeService';
import faphouseService from './services/faphouseService';

// Search RedTube
const redtubeVideos = await redtubeService.searchVideos({ 
  search: 'nurse', 
  page: 1 
});

// Search FapHouse
const faphouseVideos = await faphouseService.searchVideos({ 
  query: 'nurse', 
  page: 1 
});
```

### Using Unified API Manager
```typescript
import videoAPIManager from './services/videoAPIManager';

// Search all APIs
const allResults = await videoAPIManager.searchAllAPIs('nurse', 1);

// Search specific APIs
const selectedResults = await videoAPIManager.searchSelectedAPIs(
  'nurse', 
  ['redtube', 'faphouse'], 
  1
);

// Get trending from all APIs
const trending = await videoAPIManager.getTrendingFromAllAPIs(1);
```

## 📦 Dependencies

The following packages were installed for the API integration:

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12"
  },
  "devDependencies": {
    "@types/cheerio": "^0.22.31"
  }
}
```

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install axios cheerio @types/cheerio
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Start the Server**
   ```bash
   npm run dev
   ```

4. **Test the APIs**
   ```bash
   # Test FapHouse search
   curl "http://localhost:5000/api/faphouse/search?query=nurse&page=1"
   
   # Test unified search
   curl "http://localhost:5000/api/external/search?query=nurse&page=1&sources=faphouse,redtube"
   ```

## 🔍 API Response Format

All endpoints return a consistent response format:

```json
{
  "success": true,
  "data": [...],
  "count": 20
}
```

For the unified search endpoint:

```json
{
  "success": true,
  "data": {
    "redtube": [...],
    "apijav": [...],
    "eporner": [...],
    "faphouse": [...]
  },
  "totalCount": 80,
  "query": "nurse",
  "page": 1,
  "sources": ["redtube", "apijav", "eporner", "faphouse"]
}
```

## 🎯 Key Features

- **Unified Search**: Search across all 4 APIs simultaneously
- **Individual API Access**: Direct access to each API service
- **Error Handling**: Robust error handling with fallback responses
- **TypeScript Support**: Full type definitions for all APIs
- **Consistent Response Format**: Standardized response structure
- **Flexible Filtering**: Support for various search parameters
- **Performance Optimized**: Parallel API calls for better performance

## 🚀 Next Steps

1. **Frontend Integration**: Connect these APIs to your frontend application
2. **Caching**: Implement Redis caching for better performance
3. **Rate Limiting**: Add rate limiting to prevent API abuse
4. **Authentication**: Add API key authentication if needed
5. **Monitoring**: Add logging and monitoring for API usage
6. **Testing**: Add comprehensive unit and integration tests

## 📝 Notes

- FapHouse service includes comprehensive fallback data with 200+ videos
- All services include proper error handling and logging
- The unified search endpoint allows searching multiple APIs simultaneously
- Each API has its own specific parameters and response formats
- The VideoAPIManager provides a clean interface for programmatic usage