import express from 'express';
import { requireAuth } from '../auth.js';
import { createRoom, deleteRoom, getRooms, updateRoom } from '../services/roomService.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (_req, res) => {
  return res.status(200).json(await getRooms());
});

router.post('/', async (req, res) => {
  const room = await createRoom({ ...req.body, createdBy: req.user.id });
  return res.status(201).json(room);
});

router.put('/:id', async (req, res) => {
  const result = await updateRoom(req.params.id, req.user.id, req.body);
  if (result.status === 404) return res.status(404).json({ message: 'Room not found' });
  if (result.status === 403) return res.status(403).json({ message: 'Not authorized' });
  return res.status(200).json(result.room);
});

router.delete('/:id', async (req, res) => {
  const result = await deleteRoom(req.params.id, req.user.id);
  if (result.status === 404) return res.status(404).json({ message: 'Room not found' });
  if (result.status === 403) return res.status(403).json({ message: 'Not authorized' });
  return res.status(200).json({ message: 'Room removed successfully' });
});

export default router;
