# SHAKTI OS V3 🚀 [Verified Stabilized]

Shakti OS V3 is an Enterprise-Grade ERP built to manage every aspect of the Shakti business, from the moment a product is conceptualized to the moment it is delivered to the customer, and finally, accurately tracked in the financial books.

## 🏗️ Architecture Stack
- **Web App:** Next.js 15 (React, Tailwind CSS, Server Actions)
- **API Engine:** NestJS (Node.js, TypeScript)
- **Database:** PostgreSQL (via Prisma ORM 5)
- **Deployment:** Docker, Docker Compose, Nginx (Reverse Proxy)

## 📦 Core Modules Included
1. **Identity Core:** Role-based access control (RBAC), JWT HttpOnly auth.
2. **Products Core:** Intelligent SKU generator, Variant mapping.
3. **Order Lifecycle Engine:** Strict state machine validating transitions (`NEW` -> `APPROVED` -> `READY`).
4. **Production Engine:** Supplier portal, batch auto-sync with orders.
5. **Shipping Engine:** Fulfillment tracking and carrier management.
6. **Assets Engine (DAM):** Structured digital asset management for marketing.
7. **Marketing Engine:** Campaign tracking, Promo codes, and channel ROAS.
8. **Finance Engine (Source of Truth):** Auto-sync expenses from production and shipping, tracking net profit and cashflow.
9. **Analytics Layer:** Fast, on-the-fly aggregations of all company KPIs.

## ⚙️ How to Setup (Local Development)

### Prerequisites
- Node.js (v20+)
- PostgreSQL
- Docker (optional for local, required for prod)

### 1. Installation
```bash
git clone <repo-url>
cd shakti-v3
npm install
```

### 2. Environment Setup
Copy the `.env.example` to `.env` and fill in your local Postgres URL and secret keys.
```bash
cp .env.example .env
```

### 3. Database Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Running the Development Servers
You can run the API and Web apps simultaneously:
```bash
# Run NestJS API (Port 3001)
npm run start:dev -w apps/api

# Run Next.js Web App (Port 3000)
npm run dev -w apps/web
```

## 🚀 Production Deployment
The repository includes a robust Docker-Compose configuration for deploying on a single VM.
- Refer to `scripts/deploy.sh` and `docker-compose.yml` for automated setup.
- Designed for Google Compute Engine VM (`e2-medium`, Ubuntu 22.04).

---
*Built meticulously for ultimate scalability.*
