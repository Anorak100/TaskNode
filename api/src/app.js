import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'
import { authenticate } from './middleware/auth.js';
import projectRoutes from './routes/projects.routes.js'
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';
import prisma from './config/db.js';

import { projectTasksRouter, taskRouter } from './routes/tasks.routes.js';
import searchRoutes from './routes/search.routes.js';
import { updateUserProfile } from './controllers/auth.controller.js';

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://tasknode.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/projects/:projectId/tasks', projectTasksRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/search', searchRoutes);

app.use(errorHandler)

app.get('/api/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, avatar: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

app.put('/api/me', authenticate, updateUserProfile);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;