import express from 'express';
import authRoutes from './routes/auth.routes.js'
import morgan from 'morgan';


const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;