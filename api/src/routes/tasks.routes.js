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
taskRouter.get('/', listTasks);
taskRouter.get('/:id', getTask);
taskRouter.put('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);

export { projectTasksRouter, taskRouter };
