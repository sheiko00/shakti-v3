# ─────────────────────────────────────────────────────────────────────────────
# apps/web/Dockerfile  —  Optimized multi-stage build for Next.js Web App
#
# IMPORTANT: Requires  output: 'standalone'  in apps/web/next.config.ts
# This makes the production image tiny (~50 MB) by including only what
# Next.js needs to run, without node_modules or source files.
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only manifests so the install layer is cached independently
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

RUN npm ci

# ── Stage 2: Build Next.js app ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules

# Copy full source
COPY . .

# Build — Next.js will produce .next/standalone when output:'standalone' is set
RUN npm run build -w apps/web

# ── Stage 3: Production runner ────────────────────────────────────────────────
# Uses the ultra-small Next.js standalone output.
# No node_modules, no source — only the compiled server bundle.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Drop root privileges for security
RUN addgroup -S shakti && adduser -S shakti -G shakti

# The standalone directory contains a self-contained server
COPY --from=builder --chown=shakti:shakti /app/apps/web/.next/standalone ./
# Static assets (CSS, JS chunks, images served by Next.js)
COPY --from=builder --chown=shakti:shakti /app/apps/web/.next/static ./apps/web/.next/static
# Public folder (favicons, images, etc.)
COPY --from=builder --chown=shakti:shakti /app/apps/web/public ./apps/web/public

USER shakti

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the standalone Next.js server
CMD ["node", "apps/web/server.js"]
