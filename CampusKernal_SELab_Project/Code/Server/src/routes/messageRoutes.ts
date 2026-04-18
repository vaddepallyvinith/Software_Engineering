import express from 'express';
import { getMessages, getContacts, getUnreadCount } from '../controllers/messageController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require user to be logged in for all message routes
router.use(protectRoute);

router.get('/contacts', getContacts);
router.get('/unread', getUnreadCount);
router.get('/:peerId', getMessages);

export default router;
