# Security Vulnerability Fixes - Summary

## Issues Identified

### 1. Content-Security-Policy (CSP) Blocking Ad Iframes ❌
**Problem:** Your nginx CSP header used `iframe-src` but browsers were falling back to `default-src 'self'`, blocking external ad frames from `https://a.adtng.com`.

**Error:**
```
Content-Security-Policy: The page's settings blocked the loading of a resource (frame-src) 
at https://a.adtng.com/get/10001817 because it violates the following directive: "default-src 'self'"
```

**Root Cause:** The CSP directive used `iframe-src` instead of the standard `frame-src`.

**Fix Applied:** Changed `iframe-src` to `frame-src` in `nginx.conf`:
```nginx
frame-src 'self' https://glamournakedemployee.com https://a.adtng.com https://*.adtng.com;
```

---

### 2. Double `/api/api` in API Routes (404 Errors) ❌
**Problem:** API calls were hitting `http://localhost/api/api/videos/...` instead of `http://localhost/api/videos/...`

**Errors:**
```
Fetching popular videos from: http://localhost/api/api/videos/popular?page=1&limit=20
Popular videos failed: Error: Failed to fetch popular videos: Not Found

Fetching top rated videos from: http://localhost/api/api/videos/top-rated?page=1&limit=20
Top rated videos failed: Error: Failed to fetch top rated videos: Not Found
```

**Root Cause:** 
- Environment variable: `NEXT_PUBLIC_API_URL=http://localhost/api`
- API client code: `${BASE_URL}/api/videos`
- Result: `http://localhost/api` + `/api/videos` = `http://localhost/api/api/videos` ❌

**Fix Applied:** Updated environment variables to remove the `/api` suffix:
- `.env`: `NEXT_PUBLIC_API_URL=http://localhost`
- `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://localhost`
- `.env.example`: Updated with correct configuration

Now the API calls work correctly:
- `http://localhost` + `/api/videos` = `http://localhost/api/videos` ✅

---

## Files Modified

1. **nginx.conf** - Fixed CSP `frame-src` directive
2. **.env** - Removed `/api` from `NEXT_PUBLIC_API_URL`
3. **frontend/.env.local** - Removed `/api` from `NEXT_PUBLIC_API_URL`
4. **.env.example** - Updated documentation and default value

---

## Next Steps

### 1. Rebuild and Restart Docker Containers
```bash
# Stop all containers
docker-compose down

# Rebuild with no cache (important for env var changes)
docker-compose build --no-cache

# Start containers
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 2. Verify the Fixes

**Check API Routes:**
```bash
# Test from host machine
curl http://localhost/api/videos?page=1&limit=5
curl http://localhost/api/videos/popular?page=1&limit=5
curl http://localhost/api/videos/top-rated?page=1&limit=5
```

**Check Browser Console:**
- Ad iframes should load without CSP errors
- API calls should hit `http://localhost/api/videos` (not `/api/api/videos`)
- No 404 errors for video endpoints

### 3. Additional Verification

Open browser DevTools and check:
1. **Network Tab:** Verify API calls use correct URLs
2. **Console Tab:** No CSP errors for ad frames
3. **Application Tab:** Check if ads load in iframes

---

## Technical Details

### How Nginx Routing Works
```
Browser Request: http://localhost/api/videos
         ↓
    Nginx (port 80)
         ↓
    location /api/ { proxy_pass http://backend; }
         ↓
    Backend API (port 5002)
         ↓
    Fastify route: /api/videos
```

### Environment Variable Flow
```
.env file → Docker container → Next.js build → Browser runtime
```

**Important:** Environment variables starting with `NEXT_PUBLIC_` are embedded at build time, so you must rebuild the frontend container after changing them.

---

## Security Notes

✅ **Fixed Issues:**
- CSP now properly allows ad iframes from trusted domains
- API routing works correctly without exposing internal structure

⚠️ **Remaining Security Considerations:**
- CSP uses `'unsafe-inline'` and `'unsafe-eval'` for scripts (required for Next.js)
- Consider adding `Subresource Integrity (SRI)` for external scripts
- Monitor ad domains for any suspicious activity
- Keep nginx and Node.js updated for security patches

---

## Troubleshooting

If issues persist after rebuild:

1. **Clear browser cache:** Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
2. **Check container logs:** `docker-compose logs frontend` and `docker-compose logs api`
3. **Verify environment variables inside container:**
   ```bash
   docker exec -it videx-frontend env | grep NEXT_PUBLIC_API_URL
   ```
4. **Test API directly:** `curl http://localhost/api/health`
5. **Check nginx config:** `docker exec -it videx-nginx nginx -t`

---

## Summary

Both critical issues have been resolved:
1. ✅ Ad iframes will now load (CSP `frame-src` fixed)
2. ✅ API routes will work (removed double `/api/api`)

**Action Required:** Rebuild and restart your Docker containers to apply these changes.
