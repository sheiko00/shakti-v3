#!/bin/bash

# SHAKTI V3 Deployment Script
# Run this on the VM to deploy new changes

echo "🚀 Starting Deployment Process for SHAKTI V3..."

# 1. Pull latest code
echo "📦 Pulling latest changes from Git..."
# git pull origin main

# 2. Build and restart containers
echo "🏗️ Building Docker images..."
docker-compose -f docker-compose.yml build

echo "🔄 Recreating containers (Zero-downtime approach for DB/Nginx)..."
docker-compose -f docker-compose.yml up -d --remove-orphans

# 3. Apply Prisma migrations
echo "🗄️ Applying database migrations..."
docker exec shakti_api npx prisma migrate deploy

echo "✅ Deployment completed successfully!"
