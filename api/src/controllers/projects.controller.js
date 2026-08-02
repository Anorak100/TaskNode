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