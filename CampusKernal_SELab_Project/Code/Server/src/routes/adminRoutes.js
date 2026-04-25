import express from 'express';
import { requireAdmin } from '../auth.js';
import { deleteUserAndReferences, getDuplicateEmailReport, listUsersForAdmin, updateUserRole } from '../services/adminService.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/users', async (_req, res) => {
  try {
    return res.status(200).json(await listUsersForAdmin());
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load users' });
  }
});

router.get('/duplicates', async (_req, res) => {
  try {
    return res.status(200).json(await getDuplicateEmailReport());
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load duplicate email report' });
  }
});

router.put('/users/:userId/role', async (req, res) => {
  try {
    const user = await updateUserRole(req.params.userId, req.body.role);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'Role updated', user });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to update role' });
  }
});

router.delete('/users/:userId', async (req, res) => {
  try {
    await deleteUserAndReferences(req.params.userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to delete user' });
  }
});

export default router;
