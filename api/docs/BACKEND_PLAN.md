# Task Manager Backend Learning Plan

A step-by-step guide to building a REST API for managing users, projects, and tasks. This document is designed to teach core backend concepts through hands-on implementation.

---

## Table of Contents

1. [Introduction and Learning Goals](#1-introduction-and-learning-goals)
2. [Core Concepts Explained](#2-core-concepts-explained)
3. [Target Stack](#3-target-stack)
4. [Data Model](#4-data-model)
5. [Project Structure](#5-project-structure)
6. [Environment Setup](#6-environment-setup)
7. [Build Steps](#7-build-steps)
8. [API Reference](#8-api-reference)
9. [Auth Flow Diagram](#9-auth-flow-diagram)
10. [Common Pitfalls and Debugging Tips](#10-common-pitfalls-and-debugging-tips)
11. [Phase 2 Preview (Frontend)](#11-phase-2-preview-frontend)
12. [Stretch Goals](#12-stretch-goals)

---

## 1. Introduction and Learning Goals

### What You Will Build

A **Task Manager REST API** that lets authenticated users:

- Register and log in securely
- Create and manage **projects**
- Create and manage **tasks** inside each project

There is no frontend in Phase 1. You will test everything with **Thunder Client** (VS Code extension) or **Postman**.

### What You Will Learn

| Concept | Where You'll See It |
|---------|---------------------|
| **CRUD** | Creating, reading, updating, and deleting projects and tasks |
| **REST** | HTTP verbs and URL design for resources |
| **Relational database modeling** | Users, projects, and tasks linked by foreign keys |
| **Password hashing** | Storing passwords safely with bcrypt |
| **JWT authentication** | Stateless login tokens |
| **Authorization** | Ensuring users only access their own data |
| **Validation** | Rejecting bad input before it hits the database |
| **Error handling** | Consistent error responses across the API |

### Prerequisites

Before starting, you should have:

- **Node.js** (LTS version) — [https://nodejs.org](https://nodejs.org)
- **pnpm** — install with `corepack enable` (built into Node.js) or [https://pnpm.io/installation](https://pnpm.io/installation)
- **PostgreSQL** installed locally, or Docker to run it in a container
- Basic understanding of **HTTP** (GET, POST, PUT, DELETE)
- A code editor (VS Code recommended)
- A terminal / command line

Helpful but not required: JavaScript basics, SQL basics.

### Phase Overview

| Phase | Focus | Deliverable |
|-------|-------|-------------|
| **Phase 1** (this guide) | Backend API | Working REST API with auth, projects, and tasks |
| **Phase 2** (later) | Frontend | Simple web UI that consumes the API |

Work through Phase 1 completely before starting Phase 2. A solid API makes frontend development much easier.

---

## 2. Core Concepts Explained

Read this section before writing any code. Each concept maps directly to something you will implement.

### REST and CRUD

**REST** (Representational State Transfer) is a style for designing web APIs around **resources** — things like users, projects, and tasks. Each resource has a URL, and you use **HTTP verbs** to perform actions on it.

**CRUD** stands for the four basic operations on data:

| Operation | HTTP Verb | Example |
|-----------|-----------|---------|
| **C**reate | `POST` | `POST /api/projects` — create a new project |
| **R**ead | `GET` | `GET /api/projects` — list all projects |
| **U**pdate | `PUT` | `PUT /api/projects/:id` — replace/update a project |
| **D**elete | `DELETE` | `DELETE /api/projects/:id` — remove a project |

**You'll see this when:** You build routes for projects and tasks. Each route handler corresponds to one CRUD operation.

**REST conventions to follow:**

- Use nouns in URLs, not verbs: `/api/projects` not `/api/createProject`
- Use plural resource names: `/projects`, `/tasks`
- Use HTTP status codes meaningfully:
  - `200` — success (GET, PUT)
  - `201` — created (POST)
  - `204` — deleted successfully, no body (DELETE)
  - `400` — bad request (validation failed)
  - `401` — not authenticated (missing or invalid token)
  - `404` — resource not found
  - `500` — server error

### Relational Database Modeling

A **relational database** stores data in **tables** (like spreadsheets) that can be linked together.

Key terms:

- **Primary Key (PK)** — unique identifier for each row (e.g., `id`)
- **Foreign Key (FK)** — a column that references another table's primary key, creating a relationship
- **One-to-many** — one user has many projects; one project has many tasks

```
User (1) ──→ (many) Project (1) ──→ (many) Task
```

**You'll see this when:** You define the Prisma schema with `User`, `Project`, and `Task` models connected by foreign keys.

**Why relational?**

- Data stays organized and consistent
- You avoid duplicating user info on every task
- Deleting a project can automatically delete its tasks (cascade)
- Queries can join tables: "get all tasks for user X"

### Password Hashing

**Never store plain-text passwords.** If your database is breached, every user's password is exposed.

Instead, use **hashing** — a one-way function that turns a password into a fixed-length string. You cannot reverse a hash back to the password.

**bcrypt** is the standard choice for Node.js:

- Automatically adds a **salt** (random data) so identical passwords produce different hashes
- Is intentionally **slow**, making brute-force attacks harder
- Uses **cost rounds** (e.g., 10) — higher = slower but more secure

```javascript
// Register: hash before saving
const passwordHash = await bcrypt.hash(password, 10);

// Login: compare input against stored hash
const isValid = await bcrypt.compare(inputPassword, user.passwordHash);
```

**You'll see this when:** You implement `POST /api/auth/register` and `POST /api/auth/login`.

### JWT Authentication

**JWT** (JSON Web Token) is a compact, signed string that proves a user is logged in. The server creates it on login; the client sends it with every subsequent request.

A JWT has three parts: `header.payload.signature`

The payload contains claims like:

```json
{
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "iat": 1710000000,
  "exp": 1710086400
}
```

**Flow:**

1. User registers or logs in
2. Server verifies credentials and signs a JWT with a secret key
3. Client stores the token (memory, localStorage, or cookie)
4. Client sends `Authorization: Bearer <token>` on protected requests
5. Server middleware verifies the token and extracts the user ID

**You'll see this when:** You build the `authenticate` middleware that guards all project and task routes.

**Important:** The JWT secret (`JWT_SECRET`) must live in `.env`, never in source code. Anyone with the secret can forge tokens.

### Authorization vs Authentication

These are often confused:

| Term | Question | Example |
|------|----------|---------|
| **Authentication** | *Who are you?* | Valid JWT → you are user `abc-123` |
| **Authorization** | *Can you do this?* | User `abc-123` tries to read project owned by user `xyz-789` → **403 Forbidden** |

**You'll see this when:** Every database query for projects and tasks includes `WHERE userId = req.user.id`. Without this, any logged-in user could access anyone's data.

---

## 3. Target Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Node.js (LTS) | Widely used for REST APIs; same language as frontend if you add one later |
| Framework | Express | Minimal; teaches HTTP fundamentals without heavy abstraction |
| Database | PostgreSQL | True relational DB; great for learning joins, constraints, and migrations |
| ORM | Prisma | Type-safe schema, easy migrations, beginner-friendly |
| Auth | JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`) | Industry-standard patterns |
| Validation | Zod | Clear request body validation with helpful error messages |
| Package manager | pnpm | Fast installs, efficient disk use, strict dependency resolution |
| Dev tools | nodemon, dotenv, Thunder Client | Fast iteration and API testing |

---

## 4. Data Model

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Project : owns
    Project ||--o{ Task : contains
    User {
        uuid id PK
        string email UK
        string passwordHash
        string name
        datetime createdAt
    }
    Project {
        uuid id PK
        uuid userId FK
        string name
        string description
        datetime createdAt
    }
    Task {
        uuid id PK
        uuid projectId FK
        string title
        string description
        enum status
        datetime dueDate
        datetime createdAt
    }
```

### Key Modeling Decisions

- **User → Project**: one-to-many. Each project belongs to exactly one user.
- **Project → Task**: one-to-many. Each task belongs to exactly one project.
- **Cascade delete**: deleting a project deletes all its tasks automatically.
- **Task status enum**: `TODO`, `IN_PROGRESS`, `DONE`.
- **Ownership scoping**: to access a task, verify its project belongs to the authenticated user.

### Prisma Schema

Create this file at `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  name         String
  createdAt    DateTime  @default(now())
  projects     Project[]
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  userId      String
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  tasks       Task[]

  @@index([userId])
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  dueDate     DateTime?
  projectId   String
  createdAt   DateTime   @default(now())
  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

---

## 5. Project Structure

```
Task Manager/
├── docs/
│   └── BACKEND_PLAN.md          ← this file
├── prisma/
│   └── schema.prisma
├── src/
│   ├── index.js                 ← app entry, server start
│   ├── app.js                   ← express app setup
│   ├── config/
│   │   └── env.js               ← env validation
│   ├── middleware/
│   │   ├── auth.js              ← JWT verify
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── projects.routes.js
│   │   └── tasks.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── projects.controller.js
│   │   └── tasks.controller.js
│   └── utils/
│       ├── jwt.js
│       └── password.js
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
```

---

## 6. Environment Setup

Complete these steps once before starting the build steps.

### 6.1 Initialize the Node Project

If you don't already have a `package.json`, create one:

```bash
pnpm init
```

Install dependencies:

```bash
pnpm add express prisma @prisma/client bcryptjs jsonwebtoken zod dotenv
pnpm add -D nodemon
```

This creates `pnpm-lock.yaml` — commit that file to git so installs are reproducible across machines.

Add scripts to `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js"
  }
}
```

### 6.2 Set Up PostgreSQL

**Option A — Local install**

Install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/), then create a database:

```sql
CREATE DATABASE task_manager;
```

**Option B — Docker (recommended for simplicity)**

```bash
docker run --name task-manager-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=task_manager -p 5432:5432 -d postgres:16
```

### 6.3 Configure Environment Variables

Create `.env` in the project root (never commit this file):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager"
JWT_SECRET="change-this-to-a-long-random-string-in-production"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Create `.env.example` (safe to commit — no real secrets):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/task_manager"
JWT_SECRET="your-secret-here"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Add to `.gitignore`:

```
node_modules/
.env
```

### 6.4 Initialize Prisma

```bash
pnpm exec prisma init
```

Replace the generated `prisma/schema.prisma` with the schema from [Section 4](#prisma-schema), then run:

```bash
pnpm exec prisma migrate dev --name init
```

Verify tables were created:

```bash
pnpm exec prisma studio
```

Prisma Studio opens a browser UI at `http://localhost:5555` where you can view your empty tables.

---

## 7. Build Steps

Work through these steps in order. Each step has a **goal**, **implementation notes**, and a **checkpoint** to confirm it works before moving on.

All backend code in this section uses **ES modules** (`import` / `export`). Ensure `"type": "module"` is set in `package.json` (see [Section 6.1](#61-initialize-the-node-project)). Use `.js` extensions on local import paths (e.g. `'./app.js'`).

---

### Step 1 — Project Scaffold

**Goal:** A running Express server with a health-check endpoint.

**Create `src/app.js`:**

```javascript
import express from 'express';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
```

**Create `src/index.js`:**

```javascript
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Checkpoint:**

```bash
pnpm dev
```

Visit `http://localhost:3000/health` or run:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "status": "ok" }
```

---

### Step 2 — Database Schema and Migrations

**Goal:** PostgreSQL tables for User, Project, and Task exist.

This was mostly done in [Section 6.4](#64-initialize-prisma). If you haven't run the migration yet, do it now:

```bash
pnpm exec prisma migrate dev --name init
```

**Create a Prisma client singleton** at `src/config/db.js`:

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

Using a single instance avoids connection pool exhaustion during development with nodemon.

**Checkpoint:**

```bash
pnpm exec prisma studio
```

Confirm you see three tables: `User`, `Project`, `Task`.

---

### Step 3 — Auth: Register and Login

**Goal:** Users can create an account and receive a JWT on login.

**Create `src/utils/password.js`:**

```javascript
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export { hashPassword, comparePassword };
```

**Create `src/utils/jwt.js`:**

```javascript
import jwt from 'jsonwebtoken';

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { signToken, verifyToken };
```

**Create `src/controllers/auth.controller.js`:**

```javascript
import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

async function register(req, res, next) {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ sub: user.id, email: user.email });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
}

export { register, login };
```

**Create `src/routes/auth.routes.js`:**

```javascript
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
```

**Wire routes in `src/app.js`:**

```javascript
import authRoutes from './routes/auth.routes.js';

// ... existing middleware ...

app.use('/api/auth', authRoutes);
```

**Checkpoint:**

Register a user:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected: a JSON response with a `token` field. Save this token for the next steps.

---

### Step 4 — Auth Middleware

**Goal:** Protected routes reject requests without a valid JWT.

**Create `src/middleware/auth.js`:**

```javascript
import { verifyToken } from '../utils/jwt.js';

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export { authenticate };
```

Add a temporary test route in `src/app.js` to verify middleware works:

```javascript
import { authenticate } from './middleware/auth.js';

app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

**Checkpoint:**

Without token (should return 401):

```bash
curl http://localhost:3000/api/me
```

With token (should return 200):

```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Remove the `/api/me` test route once confirmed, or keep it as a useful debug endpoint.

---

### Step 5 — Projects CRUD

**Goal:** Authenticated users can create, list, read, update, and delete their own projects.

**Create `src/controllers/projects.controller.js`:**

```javascript
import prisma from '../config/db.js';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

async function listProjects(req, res, next) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function createProject(req, res, next) {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = await prisma.project.create({
      data: { ...data, userId: req.user.id },
    });

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const data = updateProjectSchema.parse(req.body);

    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data,
    });

    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({ where: { id: req.params.id } });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
```

**Create `src/routes/projects.routes.js`:**

```javascript
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projects.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', listProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
```

**Wire in `src/app.js`:**

```javascript
import projectRoutes from './routes/projects.routes.js';

app.use('/api/projects', projectRoutes);
```

**Checkpoint:**

```bash
# Create a project
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My First Project","description":"Learning backend dev"}'

# List projects
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update a project (replace PROJECT_ID)
curl -X PUT http://localhost:3000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Renamed Project"}'

# Delete a project
curl -X DELETE http://localhost:3000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Step 6 — Tasks CRUD

**Goal:** Authenticated users can manage tasks within their own projects.

**Create `src/controllers/tasks.controller.js`:**

```javascript
import prisma from '../config/db.js';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

async function verifyProjectOwnership(projectId, userId) {
  return prisma.project.findFirst({
    where: { id: projectId, userId },
  });
}

async function listTasks(req, res, next) {
  try {
    const project = await verifyProjectOwnership(req.params.projectId, req.user.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id },
      include: { project: { select: { userId: true } } },
    });

    if (!task || task.project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const project = await verifyProjectOwnership(req.params.projectId, req.user.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        projectId: req.params.projectId,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id },
      include: { project: { select: { userId: true } } },
    });

    if (!task || task.project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const data = updateTaskSchema.parse(req.body);

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...data,
        dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id },
      include: { project: { select: { userId: true } } },
    });

    if (!task || task.project.userId !== req.user.id) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({ where: { id: req.params.id } });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
```

**Create `src/routes/tasks.routes.js`:**

```javascript
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/tasks.controller.js';

// Nested routes: /api/projects/:projectId/tasks
const projectTasksRouter = Router({ mergeParams: true });

projectTasksRouter.use(authenticate);
projectTasksRouter.get('/', listTasks);
projectTasksRouter.post('/', createTask);

// Direct task routes: /api/tasks/:id
const taskRouter = Router();

taskRouter.use(authenticate);
taskRouter.get('/:id', getTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);

export { projectTasksRouter, taskRouter };
```

**Wire in `src/app.js`:**

```javascript
import { projectTasksRouter, taskRouter } from './routes/tasks.routes.js';

app.use('/api/projects/:projectId/tasks', projectTasksRouter);
app.use('/api/tasks', taskRouter);
```

**Checkpoint:**

```bash
# Create a task (replace PROJECT_ID)
curl -X POST http://localhost:3000/api/projects/PROJECT_ID/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn JWT","description":"Understand token-based auth","status":"IN_PROGRESS"}'

# List tasks in a project
curl http://localhost:3000/api/projects/PROJECT_ID/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update task status (replace TASK_ID)
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Step 7 — Error Handling and Validation

**Goal:** All errors return a consistent JSON shape; invalid input returns 400 with clear messages.

**Create `src/middleware/errorHandler.js`:**

```javascript
function errorHandler(err, req, res, next) {
  console.error(err);

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  res.status(500).json({ error: 'Internal server error' });
}

export { errorHandler };
```

**Add to the bottom of `src/app.js`** (must be last middleware):

```javascript
import { errorHandler } from './middleware/errorHandler.js';

// ... all routes above ...

app.use(errorHandler);
```

**Checkpoint:**

Send invalid data to trigger validation:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"not-an-email","password":"short","name":""}'
```

Expected response (400):

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email" },
    { "field": "password", "message": "Password must be at least 8 characters" },
    { "field": "name", "message": "Name is required" }
  ]
}
```

---

### Step 8 — Testing the API

**Goal:** Manually verify the full API lifecycle works end-to-end.

#### Recommended Test Order

1. `GET /health` — server is running
2. `POST /api/auth/register` — create account
3. `POST /api/auth/login` — get JWT token
4. `POST /api/projects` — create a project (save the `id`)
5. `GET /api/projects` — list projects
6. `GET /api/projects/:id` — get single project
7. `PUT /api/projects/:id` — update project
8. `POST /api/projects/:projectId/tasks` — create tasks
9. `GET /api/projects/:projectId/tasks` — list tasks
10. `PUT /api/tasks/:id` — mark task as DONE
11. `DELETE /api/tasks/:id` — delete a task
12. `DELETE /api/projects/:id` — delete project (cascades remaining tasks)

#### Using Thunder Client (VS Code)

1. Install the **Thunder Client** extension
2. Create a new collection called "Task Manager API"
3. Add an environment variable `token` — set it after login
4. For protected routes, add header: `Authorization: Bearer {{token}}`

#### Security Checks to Verify

- Request without token → `401`
- Request with expired/invalid token → `401`
- Access another user's project by ID → `404` (not 403, to avoid leaking existence)
- Register with duplicate email → `409`
- Login with wrong password → `401`

---

## 8. API Reference

### Auth Endpoints

| Method | Path | Auth | Request Body | Success Response |
|--------|------|------|--------------|------------------|
| POST | `/api/auth/register` | No | `{ email, password, name }` | `201` — `{ id, email, name, createdAt }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `200` — `{ token, user: { id, email, name } }` |

### Project Endpoints

| Method | Path | Auth | Request Body | Success Response |
|--------|------|------|--------------|------------------|
| GET | `/api/projects` | Yes | — | `200` — `[{ id, name, description, userId, createdAt }]` |
| POST | `/api/projects` | Yes | `{ name, description? }` | `201` — `{ id, name, description, userId, createdAt }` |
| GET | `/api/projects/:id` | Yes | — | `200` — `{ id, name, description, userId, createdAt }` |
| PUT | `/api/projects/:id` | Yes | `{ name?, description? }` | `200` — updated project |
| DELETE | `/api/projects/:id` | Yes | — | `204` — no body |

### Task Endpoints

| Method | Path | Auth | Request Body | Success Response |
|--------|------|------|--------------|------------------|
| GET | `/api/projects/:projectId/tasks` | Yes | — | `200` — `[{ id, title, description, status, dueDate, projectId, createdAt }]` |
| POST | `/api/projects/:projectId/tasks` | Yes | `{ title, description?, status?, dueDate? }` | `201` — task object |
| GET | `/api/tasks/:id` | Yes | — | `200` — task object |
| PUT | `/api/tasks/:id` | Yes | `{ title?, description?, status?, dueDate? }` | `200` — updated task |
| DELETE | `/api/tasks/:id` | Yes | — | `204` — no body |

### Utility Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Server health check |

### Error Response Shape

All errors follow this format:

```json
{
  "error": "Human-readable message"
}
```

Validation errors include details:

```json
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email" }
  ]
}
```

---

## 9. Auth Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB

    Client->>API: POST /api/auth/register (email, password, name)
    API->>API: bcrypt hash password
    API->>DB: INSERT user
    API-->>Client: 201 user created

    Client->>API: POST /api/auth/login (email, password)
    API->>DB: SELECT user by email
    API->>API: bcrypt compare password
    API->>API: sign JWT with JWT_SECRET
    API-->>Client: 200 { token, user }

    Client->>API: GET /api/projects (Authorization: Bearer token)
    API->>API: verify JWT middleware
    API->>DB: SELECT projects WHERE userId = token.sub
    API-->>Client: 200 [projects]
```

---

## 10. Common Pitfalls and Debugging Tips

### Forgetting to hash passwords on register

**Symptom:** Passwords stored as plain text in the database.

**Fix:** Always call `hashPassword()` before `prisma.user.create()`. Never save `req.body.password` directly.

### Not scoping queries by userId

**Symptom:** User A can read or modify User B's projects by guessing UUIDs.

**Fix:** Every query must include `where: { userId: req.user.id }` or verify ownership through a join. Returning `404` (not `403`) for unauthorized access prevents leaking whether a resource exists.

### JWT secret in source code

**Symptom:** Secret committed to Git; anyone with repo access can forge tokens.

**Fix:** Store in `.env`, add `.env` to `.gitignore`, provide `.env.example` without real values.

### Confusing 401 vs 403

| Code | Meaning | When to use |
|------|---------|-------------|
| `401 Unauthorized` | Not logged in | Missing, invalid, or expired token |
| `403 Forbidden` | Logged in but not allowed | User lacks permission for this action |

For this project, use `404` when a resource exists but belongs to another user — this avoids confirming the resource ID is valid.

### Prisma connection errors

**Symptom:** `Can't reach database server at localhost:5432`

**Fixes:**

- Ensure PostgreSQL is running: `docker ps` or check Windows Services
- Verify `DATABASE_URL` in `.env` matches your credentials
- Run `pnpm exec prisma generate` after schema changes

### Zod errors not caught

**Symptom:** Server crashes with unhandled `ZodError`.

**Fix:** Wrap controller logic in `try/catch` with `next(err)`, and ensure the error handler middleware is registered last in `app.js`.

### Nodemon creating too many DB connections

**Symptom:** `Too many database connections` after several restarts.

**Fix:** Use a Prisma client singleton (see Step 2). In production, call `prisma.$disconnect()` on shutdown.

---

## 11. Phase 2 Preview (Frontend)

Once Phase 1 is complete and all checkpoints pass, you can build a simple frontend. This section is a roadmap, not implementation steps.

### Goals

- Login / register forms
- Dashboard showing the user's projects
- Task list inside each project with status toggling
- Create, edit, and delete projects and tasks from the UI

### Suggested Approach

| Option | Pros | Cons |
|--------|------|------|
| **Vanilla HTML + JS** | No build step; focuses on fetch API | More manual DOM work |
| **React (Vite)** | Component-based; popular ecosystem | Requires pnpm build tooling |

### Frontend Architecture

```mermaid
flowchart LR
    Browser -->|fetch with JWT| ExpressAPI
    ExpressAPI --> PostgreSQL
    Browser -->|store token| LocalStorage
```

### Key Frontend Tasks

1. **Auth pages** — forms that call `/api/auth/register` and `/api/auth/login`
2. **Token storage** — save JWT in memory or `localStorage`; attach to every request
3. **Project list page** — `GET /api/projects` on load
4. **Project detail page** — `GET /api/projects/:projectId/tasks`
5. **CRUD forms** — create/edit modals or inline forms for projects and tasks
6. **Error display** — show API validation errors to the user

### CORS Note

When the frontend runs on a different port (e.g., `localhost:5173`), add CORS to Express:

```javascript
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173' }));
```

Install: `pnpm add cors`

---

## 12. Stretch Goals

Optional extensions once the core API is working. Tackle these to deepen your backend knowledge.

| Goal | What You'll Learn |
|------|-------------------|
| **Refresh tokens** | Short-lived access tokens + long-lived refresh tokens stored securely |
| **Pagination** | `?page=1&limit=20` query params; `skip` and `take` in Prisma |
| **Task filtering** | `?status=TODO` query param; dynamic Prisma `where` clauses |
| **Docker Compose** | Single `docker-compose.yml` running Postgres + API together |
| **Unit tests** | Jest + Supertest for automated endpoint testing |
| **Rate limiting** | `express-rate-limit` to prevent brute-force login attempts |
| **Request logging** | `morgan` middleware for HTTP request logs |
| **API documentation** | Swagger / OpenAPI auto-generated docs |

---

## Quick Start Checklist

Use this checklist to track your progress through Phase 1:

- [ ] Node project initialized with dependencies
- [ ] PostgreSQL running and connected
- [ ] Prisma schema migrated
- [ ] Step 1: Health check returns `{ status: "ok" }`
- [ ] Step 3: Can register and login
- [ ] Step 4: Protected routes reject unauthenticated requests
- [ ] Step 5: Full project CRUD works
- [ ] Step 6: Full task CRUD works
- [ ] Step 7: Validation errors return 400 with details
- [ ] Step 8: End-to-end manual test passes

When every box is checked, Phase 1 is complete. You have a production-pattern REST API and the backend fundamentals to build on.
