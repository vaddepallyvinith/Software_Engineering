import express from 'express';
import { requireAuth } from '../auth.js';
import { getContactsForUser, getMessagesBetweenUsers, getUnreadCount } from '../services/messageService.js';

const router = express.Router();

router.use(requireAuth);

router.get('/contacts', async (req, res) => {
  return res.status(200).json(await getContactsForUser(req.user.id));
});

router.get('/unread', async (req, res) => {
  return res.status(200).json({ unread: await getUnreadCount(req.user.id) });
});

router.get('/:peerId', async (req, res) => {
  return res.status(200).json(await getMessagesBetweenUsers(req.user.id, req.params.peerId));
});

export default router;
