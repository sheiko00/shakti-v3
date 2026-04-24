# ─────────────────────────────────────────────────────────────────────────────
# apps/api/Dockerfile  —  Optimized multi-stage build for NestJS API
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# .npmrc sets legacy-peer-deps=true (needed for React 19 / Next.js 15)
COPY .npmrc* ./
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY . .

# Generate Prisma client and compile TypeScript
RUN npx prisma generate
RUN npm run build -w apps/api

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY .npmrc* ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/packages/types/package.json ./packages/types/
COPY --from=builder /app/packages/ui/package.json ./packages/ui/
COPY --from=builder /app/packages/utils/package.json ./packages/utils/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/prisma ./prisma

# Install production-only dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Copy the pre-generated Prisma client from builder (avoids schema validation at build time)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

RUN addgroup -S shakti && adduser -S shakti -G shakti
USER shakti

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
