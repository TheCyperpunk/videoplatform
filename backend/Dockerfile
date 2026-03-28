# ============================================
# Multi-stage Dockerfile for Backend API
# Optimized for production deployment
# ============================================

# ── Stage 1: Dependencies ──────────────────
FROM node:20-alpine AS deps

# Install security updates
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (production only)
RUN npm ci --only=production && \
    npm cache clean --force

# ── Stage 2: Builder ───────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ── Stage 3: Runner (Production) ───────────
FROM node:20-alpine AS runner

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 fastify

WORKDIR /app

# Copy production dependencies from deps stage
COPY --from=deps --chown=fastify:nodejs /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder --chown=fastify:nodejs /app/dist ./dist
COPY --from=builder --chown=fastify:nodejs /app/package.json ./

# Switch to non-root user
USER fastify

# Expose port
EXPOSE 5002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5002/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/server.js"]
