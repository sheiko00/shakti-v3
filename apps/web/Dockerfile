# ─────────────────────────────────────────────────────────────────────────────
# apps/web/Dockerfile  —  Optimized multi-stage build for Next.js Web App
#
# IMPORTANT: Requires  output: 'standalone'  in apps/web/next.config.ts
# This makes the production image tiny by including only what Next.js needs.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install ALL workspace dependencies ────────────────────────────────
# We must copy ALL workspace package.json files so that npm workspaces
# can resolve symlinks correctly before building.
FROM node:20-alpine AS deps
WORKDIR /app

COPY .npmrc* ./
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# npm ci respects workspaces and installs all deps including React
RUN npm ci --legacy-peer-deps

# ── Stage 2: Build Next.js app ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy ALL source so workspace package resolution works
COPY . .

# Build Next.js — produces .next/standalone when output:'standalone' is set
RUN npm run build -w apps/web

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S shakti && adduser -S shakti -G shakti

# Standalone server bundle
COPY --from=builder --chown=shakti:shakti /app/apps/web/.next/standalone ./
# Static assets (JS chunks, CSS)
COPY --from=builder --chown=shakti:shakti /app/apps/web/.next/static ./apps/web/.next/static
# Public folder (favicons, images)
COPY --from=builder --chown=shakti:shakti /app/apps/web/public ./apps/web/public

USER shakti

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
