# ─────────────────────────────────────────────────────────────────────────────
# apps/api/Dockerfile  —  Optimized multi-stage build for NestJS API
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy .npmrc first (contains legacy-peer-deps=true to resolve React 19 conflicts)
COPY .npmrc* ./
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY . .

RUN npx prisma generate
RUN npm run build -w apps/api

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY .npmrc* ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/prisma ./prisma

# Install production-only dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Re-generate Prisma client in production stage
RUN npx prisma generate

RUN addgroup -S shakti && adduser -S shakti -G shakti
USER shakti

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
