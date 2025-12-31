# COH Internal ERP System

Internal ERP system for Creatures of Habit - sustainable clothing brand.

## Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS + React Query + React Table
- **Backend**: Node.js + Express + PostgreSQL + Prisma ORM
- **Infrastructure**: Railway/Vercel + Supabase

## Project Structure

```
coh-erp/
├── apps/
│   ├── web/                 # React frontend
│   └── api/                 # Express backend
├── packages/
│   └── db/                  # Prisma schema & migrations
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
pnpm install

# Set up database
cd packages/db
cp .env.example .env
# Edit .env with your database URL

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### Development

```bash
# Run both frontend and backend
pnpm dev

# Run frontend only
pnpm dev:web

# Run backend only
pnpm dev:api

# Open Prisma Studio
pnpm db:studio
```

## Modules

- Products & Variations
- Inventory Management
- Fabric Management
- Orders & Fulfillment
- Production Planning
- Returns & Exchanges
- Customer Feedback
- Customer Analytics

## Environment Variables

### Backend (`apps/api/.env`)

```
DATABASE_URL=postgresql://user:password@localhost:5432/coh_erp
PORT=3001
NODE_ENV=development
```

### Frontend (`apps/web/.env`)

```
VITE_API_URL=http://localhost:3001
```
