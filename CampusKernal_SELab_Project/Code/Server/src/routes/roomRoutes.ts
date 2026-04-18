import express from 'express';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protectRoute);
router.get('/', getRooms);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
