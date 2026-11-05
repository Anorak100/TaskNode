import { verifyToken } from '../utils/jwt.js';

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || !process.env.ADMIN_PASSWORD_HASH) {
    return res.status(503).json({ error: 'Admin authentication is not configured' });
  }

  try {
    const payload = verifyToken(header.slice(7));
    if (payload.role !== 'admin' || payload.sub !== adminEmail) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = { email: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired admin session' });
  }
}

export { requireAdmin };
