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
    const projectId = req.params.projectId;

    if (projectId) {
      const project = await verifyProjectOwnership(projectId, req.user.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const tasks = await prisma.task.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(tasks);
    }

    // If no projectId, fetch all tasks for the current user
    const tasks = await prisma.task.findMany({
      where: { project: { userId: req.user.id } },
      include: { project: { select: { name: true } } },
      orderBy: { dueDate: 'asc' },
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
        completedAt: data.status === 'DONE' ? new Date() : undefined,
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
        ...(data.status !== undefined
          ? {
              completedAt:
                data.status === 'DONE'
                  ? (task.status === 'DONE' && task.completedAt) || new Date()
                  : null,
            }
          : {}),
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
