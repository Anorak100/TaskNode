import prisma from '../config/db.js';
import { comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const usersQuerySchema = z.object({
  q: z.string().trim().max(100).default(''),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

async function loginAdmin(req, res, next) {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !passwordHash) {
      return res.status(503).json({ error: 'Admin authentication is not configured' });
    }

    const passwordIsValid = await comparePassword(password, passwordHash);
    if (email.trim().toLowerCase() !== adminEmail || !passwordIsValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ sub: adminEmail, role: 'admin' }, '4h');
    res.json({ token, admin: { email: adminEmail } });
  } catch (error) {
    next(error);
  }
}

async function getAdminOverview(req, res, next) {
  try {
    const [users, projects, tasks, tasksByStatus] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.task.count(),
      prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ]);

    res.json({
      users,
      projects,
      tasks,
      tasksByStatus: Object.fromEntries(
        tasksByStatus.map(({ status, _count }) => [status, _count._all]),
      ),
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminUsers(req, res, next) {
  try {
    const { q, page, pageSize } = usersQuerySchema.parse(req.query);
    const where = q
      ? {
          OR: [
            { email: { contains: q, mode: 'insensitive' } },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const [totalUsers, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          projects: {
            select: {
              _count: { select: { tasks: true } },
            },
          },
        },
      }),
    ]);

    res.json({
      users: users.map(({ projects, ...user }) => ({
        ...user,
        projectCount: projects.length,
        taskCount: projects.reduce((total, project) => total + project._count.tasks, 0),
      })),
      page,
      pageSize,
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize),
    });
  } catch (error) {
    next(error);
  }
}

export { loginAdmin, getAdminOverview, getAdminUsers };
