# External API Timeout Fix Applied

## Problem
External APIs (RedTube, Eporner, APIJAV, FapHouse, HaniAPI, HentaiOcean) were timing out after 15 seconds, causing search failures with error: "External API timeout"

## Root Cause
- Backend services had 15-second timeouts
- Frontend had 15-second timeout for external API calls
- External APIs sometimes take longer than 15s to respond
- This caused frequent timeout errors

## Solution Applied

### 1. Backend Service Timeouts Increased (15s → 30s)

Updated all external API service files:

**✅ backend/src/services/redtubeService.ts**
- Changed `timeout: 15000` to `timeout: 30000`

**✅ backend/src/services/apijavService.ts**
- Changed all `timeout: 15000` to `timeout: 30000` (3 locations)

**✅ backend/src/services/epornerService.ts**
- Changed `timeout: 15000` to `timeout: 30000` (1 location)

**✅ backend/src/services/faphouseService.ts**
- Changed `timeout: 15000` to `timeout: 30000`

**✅ backend/src/services/haniApiService.ts**
- Changed `timeout: 15000` to `timeout: 30000`

**✅ backend/src/services/hentaioceanService.ts**
- Changed all `timeout: 15000` to `timeout: 30000` (3 locations)

### 2. Frontend Timeout Increased (15s → 30s)

**✅ frontend/src/lib/api.ts**
- Updated `searchCombined()` function
- Changed external API timeout from 15000ms to 30000ms
- Comment updated: "30 seconds max - increased for reliability"

## Impact

### Before Fix:
- External APIs frequently timed out after 15 seconds
- Users saw "External API timeout" errors
- Search results showed: `Local=0, External=0, Total=0`

### After Fix:
- External APIs have 30 seconds to respond (2x longer)
- More reliable search results
- Fewer timeout errors
- Better user experience

## Testing

Test that external search now works:

```bash
# Backend should respond within 30s
curl "http://localhost:5002/api/external/search?query=test&page=1"

# Frontend search should show results
# Open browser: http://localhost:3000
# Search for any term
# Should see: "External search: 54 videos found" (or similar)
```

## Notes

- **No breaking changes** - Only increased timeout values
- **Backward compatible** - All APIs work the same, just more patient
- **Fallback still works** - If external APIs fail, local DB search still works
- **Rate limiting unaffected** - 60 req/min limit still applies

## Why 30 seconds?

- External APIs (especially RedTube, Eporner) can be slow
- Network latency varies by location
- Some APIs fetch multiple pages (up to 3 pages)
- 30s is a reasonable balance between reliability and user experience
- Frontend shows loading state, so users know it's working

## Alternative Solutions (if still timing out)

If 30s is still not enough, consider:

1. **Increase to 45s or 60s** - For very slow APIs
2. **Reduce pages fetched** - Currently fetching 3 pages, reduce to 1
3. **Cache results** - Store external API results in Redis/MongoDB
4. **Parallel with timeout** - Fetch all sources in parallel, use whichever responds first
5. **Disable slow sources** - Remove specific APIs that consistently timeout

## Commit Message

```bash
git add backend/src/services/*.ts frontend/src/lib/api.ts EXTERNAL_API_TIMEOUT_FIX.md
git commit -m "fix: increase external API timeouts from 15s to 30s for reliability"
git push
```

---

## Summary

✅ All external API timeouts increased from 15s to 30s
✅ Frontend timeout increased from 15s to 30s  
✅ No breaking changes
✅ More reliable search results
✅ Better user experience
