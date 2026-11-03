import prisma from '../config/db.js';

export async function searchProjectsAndTasks(req, res, next) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.json({ projects: [], tasks: [] });
    }

    const query = q.trim();
    if (!query) {
      return res.json({ projects: [], tasks: [] });
    }

    const userId = req.user.id;

    // Search projects matching name or description
    const projects = await prisma.project.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
      take: 10,
    });

    // Search tasks belonging to the user's projects matching title or description
    const tasks = await prisma.task.findMany({
      where: {
        project: { userId },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { title: 'asc' },
      take: 20,
    });

    res.json({ projects, tasks });
  } catch (err) {
    next(err);
  }
}
