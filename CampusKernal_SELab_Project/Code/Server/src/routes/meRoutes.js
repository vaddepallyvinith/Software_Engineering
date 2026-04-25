import express from 'express';
import { requireAuth } from '../auth.js';
import { getPublicUserById, updateUser, changeUserPassword } from '../services/userService.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const user = await getPublicUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json({
    message: 'Welcome to your Me Space!',
    user,
  });
});

router.put('/update', requireAuth, async (req, res) => {
  const user = await updateUser(req.user.id, req.body);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json({ message: 'Updated successfully', user });
});

router.put('/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required.' });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters.' });
  }

  try {
    await changeUserPassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
