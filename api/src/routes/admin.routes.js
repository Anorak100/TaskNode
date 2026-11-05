import { Router } from 'express';
import { getAdminOverview, getAdminUsers, loginAdmin } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = Router();

router.post('/login', loginAdmin);
router.get('/session', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});
router.get('/overview', requireAdmin, getAdminOverview);
router.get('/users', requireAdmin, getAdminUsers);

export default router;
