import express from 'express';
import authRoutes from './routes/auth.routes.js'
import { authenticate } from './middleware/auth.js';
import projectRoutes from './routes/projects.routes.js'
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler.js';

import { projectTasksRouter, taskRouter } from './routes/tasks.routes.js';

app.use('/api/projects/:projectId/tasks', projectTasksRouter);
app.use('/api/tasks', taskRouter);


const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler)

app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;