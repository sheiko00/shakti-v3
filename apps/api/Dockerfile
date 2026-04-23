# ─────────────────────────────────────────────────────────────────────────────
# apps/api/Dockerfile  —  Optimized multi-stage build for NestJS API
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ─────────────────────────────────────────────
# Isolating the install step lets Docker reuse this layer as long as
# package*.json files don't change (fastest possible caching).
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only manifests first so the "npm ci" layer is cached independently
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY prisma ./prisma/

# Install ALL deps (including devDeps needed to build)
RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Bring installed modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copy source code
COPY . .

# Generate Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build -w apps/api

# ── Stage 3: Production runner ────────────────────────────────────────────────
# Uses a fresh, minimal image — no devDependencies, no source files.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy what the runtime needs
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/prisma ./prisma

# Install production-only dependencies (smaller image)
RUN npm ci --omit=dev

# Re-generate Prisma client in the production stage so native binaries match
RUN npx prisma generate

# Drop root privileges for security
RUN addgroup -S shakti && adduser -S shakti -G shakti
USER shakti

EXPOSE 3001

# NestJS production start: node dist/main
CMD ["node", "apps/api/dist/main"]
