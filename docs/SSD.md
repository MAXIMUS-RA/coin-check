# System Specification Document — CoinCheck

## 1. Overview
CoinCheck — a web application for tracking cryptocurrency exchange rates, built with Next.js server routes, Prisma ORM, and NextAuth authentication.

## 2. Technology Stack
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (server components)
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **Package Manager:** pnpm

## 3. System Architecture
Monolithic architecture based on Next.js App Router. Client and server components are located in a single project. API endpoints are implemented through `app/api/` route handlers.

## 4. Core Modules
| Module | Description |
|--------|-------------|
| Auth | User registration and login via NextAuth |
| Coins | Display coin list and exchange rates |
| Watchlist | Add coins to watchlist |
| Database | Prisma schema with User, Coin, and WatchlistItem tables |

## 5. Environment Requirements
- Node.js >= 18
- PostgreSQL >= 14
- pnpm >= 8

## 6. Security
- Passwords are hashed using bcrypt
- Sessions are managed via NextAuth JWT
- Environment variables are stored in `.env`

