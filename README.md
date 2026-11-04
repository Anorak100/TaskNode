# TaskNode

TaskNode is a task and project management application for organizing work, tracking progress, and handling deadlines in one place.

## Overview

This project combines a React frontend with an Express API and a Prisma-backed PostgreSQL database. It supports:

- project-based task organization
- status tracking for work items
- due-date visibility
- user authentication and account settings
- password reset through secure one-time codes

## Tech stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express
- Database: PostgreSQL with Prisma
- Auth: JWT + bcrypt
- Email: Sendliberty (Gmail inbox connected through OAuth)

## Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database access
- Sendliberty API key and a Gmail inbox connected in Sendliberty

## Environment setup

Create `api/.env` with values like:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=3000
SENDLIBERTY_API_KEY="replace-with-your-sendliberty-api-key"
SENDLIBERTY_FROM="your-connected-gmail-address"
```

Connect your Gmail or Google Workspace inbox in Sendliberty, generate an API key in its dashboard, and put the key and connected sender address in `api/.env`. Sendliberty uses the connected inbox as the sender; the backend sends `from`, `to`, `subject`, and `html` to `https://sendliberty.com/api/send`.

Keep all secrets in environment variables and never commit real credentials. `api/.env.example` lists the required email settings.

## Local setup

```bash
cd api && pnpm install
cd ../frontend && pnpm install
```

Generate the Prisma client and sync the schema:

```bash
cd api
pnpm exec prisma generate
pnpm exec prisma db push
```

## Run the app

Backend:

```bash
cd api
pnpm run dev
```

Frontend:

```bash
cd frontend
pnpm run dev
```

Typical local URLs:

- API: http://localhost:3000
- Frontend: http://localhost:5173

## Features

- project and task management
- due-date tracking
- authentication and protected routes
- password reset flow
- dashboard and settings experience

## Notes

This README is intentionally concise and focused on setup and project purpose. It does not include boilerplate content or duplicated details from the subproject READMEs.
