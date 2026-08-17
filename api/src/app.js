import express from 'express';
import authRoutes from './routes/auth.routes.js'
import { authenticate } from './middleware/auth.js';
import projectRoutes from './routes/projects.routes.js'
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';

import { projectTasksRouter, taskRouter } from './routes/tasks.routes.js';
import searchRoutes from './routes/search.routes.js';

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/projects/:projectId/tasks', projectTasksRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/search', searchRoutes);

app.use(errorHandler)

app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;