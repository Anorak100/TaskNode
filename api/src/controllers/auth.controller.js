import prisma from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { sendPasswordResetOtp } from '../utils/email.js';
import { z } from 'zod';
import { randomInt } from 'node:crypto';

const RESET_CODE_TTL_MS = 10 * 60 * 1000;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

async function register(req, res, next) {
  try {
    const { email, password, name } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ sub: user.id, email: user.email });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
}

async function requestPasswordReset(req, res, next) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });

    // Return the same response whether the account exists or not to avoid account enumeration.
    if (user) {
      const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
      const codeHash = await hashPassword(code);
      const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MS);

      await prisma.passwordResetCode.upsert({
        where: { userId: user.id },
        create: { userId: user.id, codeHash, expiresAt },
        update: { codeHash, expiresAt, createdAt: new Date() },
      });

      try {
        await sendPasswordResetOtp({ email: user.email, code, expiresInMinutes: 10 });
      } catch (error) {
        console.error('Failed to send password reset email:', error);
      }
    }

    res.json({ message: 'If an account exists for that email, a reset code has been sent.' });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { email, code, password } = resetPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      include: { passwordReset: true },
    });

    const reset = user?.passwordReset;
    const codeIsValid = reset && reset.expiresAt > new Date() && await comparePassword(code, reset.codeHash);
    if (!user || !reset || !codeIsValid) {
      return res.status(400).json({ error: 'The reset code is invalid or has expired.' });
    }

    const passwordHash = await hashPassword(password);
    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
      prisma.passwordResetCode.delete({ where: { userId: user.id } }),
    ]);

    res.json({ message: 'Your password has been reset. You can now sign in.' });
  } catch (err) {
    next(err);
  }
}

export { register, login, requestPasswordReset, resetPassword }
