# ─────────────────────────────────────────────────────────────────────────────
# apps/web/Dockerfile  —  Next.js Web App (production)
#
# IMPORTANT: Requires  output: 'standalone'  in apps/web/next.config.ts
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build (install + compile) ────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copy .npmrc (legacy-peer-deps=true for React 19 / Next.js 15 compatibility)
COPY .npmrc* ./

# Copy workspace manifests for cache layer
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Install all workspace deps at root level
RUN npm ci --legacy-peer-deps

# After hoisted install, Next.js 15 needs react to be resolvable from apps/web.
# Create a local node_modules link so Next.js module check passes.
RUN mkdir -p apps/web/node_modules && \
    ln -sf /app/node_modules/react apps/web/node_modules/react && \
    ln -sf /app/node_modules/react-dom apps/web/node_modules/react-dom && \
    ln -sf /app/node_modules/react/jsx-runtime apps/web/node_modules/react/jsx-runtime 2>/dev/null || true

# Copy full source
COPY . .

# Build Next.js standalone output
RUN npm run build -w apps/web

# ── Stage 2: Production runner ────────────────────────────────────────────────
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
