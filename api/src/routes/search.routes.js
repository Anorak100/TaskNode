import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { searchProjectsAndTasks } from '../controllers/search.controller.js';

const router = Router();

router.get('/', authenticate, searchProjectsAndTasks);

export default router;
