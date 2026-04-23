# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json files
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Web (Next.js)
# Next.js standalone output needs to be enabled in next.config.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build -w apps/web

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy standalone build
# Note: Ensure `output: 'standalone'` is set in apps/web/next.config.js
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the standalone server
CMD ["node", "apps/web/server.js"]
