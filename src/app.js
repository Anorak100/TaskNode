import express from 'express';
import authRoutes from './routes/auth.routes.js'
import { authenticate } from './middleware/auth.js';
import projectRoutes from './routes/projects.routes.js'
import morgan from 'morgan';


const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;