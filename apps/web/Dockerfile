# ─────────────────────────────────────────────────────────────────────────────
# apps/web/Dockerfile  —  Next.js Web App (production)
#
# IMPORTANT: Requires  output: 'standalone'  in apps/web/next.config.ts
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build (install + compile in one stage) ───────────────────────────
# We install and build in the same stage to avoid npm workspace symlink issues.
# Layer caching is still effective because package files are copied first.
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copy .npmrc (legacy-peer-deps=true for React 19 / Next.js 15 compatibility)
COPY .npmrc* ./

# Copy ALL workspace manifests first — Docker caches this layer until any
# package.json changes, so 'npm ci' only re-runs when dependencies change.
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Install all workspace dependencies (including React, Next.js, etc.)
RUN npm ci --legacy-peer-deps

# Copy full source code
COPY . .

# Build Next.js standalone output
RUN npm run build -w apps/web

# ── Stage 2: Production runner ────────────────────────────────────────────────
# Only the compiled standalone bundle is included — no source, no node_modules.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S shakti && adduser -S shakti -G shakti

COPY --from=builder --chown=shakti:shakti /app/apps/web/.next/standalone ./
COPY --from=builder --chown=shakti:shakti /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=shakti:shakti /app/apps/web/public ./apps/web/public

USER shakti

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
