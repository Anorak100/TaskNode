# TaskNode

TaskNode is a full-stack task and project management app built with a React + TypeScript frontend and an Express + Prisma backend. It helps users manage projects, track task status, handle due dates, and maintain account-level settings with secure authentication.

## Overview

- Project-based organization for work and personal planning
- Task lifecycle tracking: To do, In progress, and Done
- Due-date visibility and project summaries
- Secure authentication with JWT
- Password reset flow with OTP and Resend email delivery
- Theme-aware dashboard and responsive UI
- Prisma-powered PostgreSQL data layer

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn-inspired UI primitives
- Lucide icons

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt hashing
- Zod validation
- Resend for transactional emails

## Repository Structure

```text
Task Manager/
├── api/
│   ├── prisma/
│   ├── src/
│   ├── .env
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── README.md
├── README.md
└── .gitignore
```

## Prerequisites

Before starting, make sure you have:

- Node.js 18 or newer
- pnpm 9+ recommended
- PostgreSQL database (or a managed Postgres provider such as Neon)
- A Resend API key for password-reset emails

## Environment Setup

Create an environment file in the API app at `api/.env` with the following values:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require&channel_binding=require"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3000
RESEND_API_KEY="your_resend_api_key"
```

### Notes
- `DATABASE_URL` must point to a live PostgreSQL database.
- `JWT_SECRET` should be a long random value.
- `RESEND_API_KEY` is used for password reset emails.
- `PORT` is the backend port for the API server.

## Install Dependencies

From the root of the project:

```bash
cd api && pnpm install
cd ../frontend && pnpm install
```

## Database Setup

Generate the Prisma client and sync the database schema:

```bash
cd api
pnpm exec prisma generate
pnpm exec prisma db push
```

If you are using migrations instead of push, use:

```bash
pnpm exec prisma migrate dev
```

## Run the App

### Start the backend

```bash
cd api
pnpm run dev
```

The API runs on:

```text
http://localhost:3000
```

### Start the frontend

In a separate terminal:

```bash
cd frontend
pnpm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Available Scripts

### API scripts

```bash
pnpm run dev
pnpm run start
pnpm run build
pnpm run prisma:generate
pnpm run studio
```

### Frontend scripts

```bash
pnpm run dev
pnpm run build
pnpm run preview
```

## Core Features

### Authentication
- User signup and login
- JWT-based session handling
- Password reset via OTP email code
- Remember-me session persistence in the browser

### Projects and Tasks
- Create projects and assign tasks
- Track task status across workflow stages
- Add due dates and project summaries
- Search and browse project task data

### User management
- Profile name updates persisted to the database
- Account settings page
- Theme preference controls
- Data export and sign-out flows

## API Highlights

Main API routes include:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/me
PUT  /api/me
GET  /api/projects
POST /api/projects
GET  /api/projects/:projectId/tasks
POST /api/tasks
PUT  /api/tasks/:taskId
DELETE /api/tasks/:taskId
```

## Production Notes

- Use a strong, unique `JWT_SECRET` in production.
- Store secrets only in environment variables, not in source control.
- Use a managed PostgreSQL service for production data persistence.
- Ensure Resend is configured correctly for outbound email delivery.
- Consider enabling HTTPS and additional security hardening before deployment.

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Verify the frontend build and backend logic.
4. Commit with a clear message.
5. Open a pull request for review.

## License

This project is currently configured for internal development use. Update the license before production deployment if required.

## Support

For local troubleshooting, check:

- backend logs in the API terminal
- frontend console output in the browser dev tools
- Prisma connection status and database URL validity
- Resend API key validity for password reset emails

---

Built with Next-generation task management workflows in mind, TaskNode is designed to be straightforward to run locally while remaining scalable enough for a real product workflow.
