import express from 'express';
import { requireAuth } from '../auth.js';
import { acceptRequest, getMatches, getNetwork, sendRequest } from '../services/synergyService.js';

const router = express.Router();

router.use(requireAuth);

router.get('/matches', async (req, res) => {
  const matches = await getMatches(req.user.id);
  if (!matches) return res.status(404).json({ message: 'User not found' });
  return res.status(200).json(matches);
});

router.get('/network', async (req, res) => {
  return res.status(200).json(await getNetwork(req.user.id));
});

router.post('/connect/:userId', async (req, res) => {
  const result = await sendRequest(req.user.id, req.params.userId);
  return res.status(result.status).json(
    result.connection
      ? { message: 'Request sent successfully', connection: result.connection }
      : { message: result.message }
  );
});

router.put('/accept/:userId', async (req, res) => {
  const result = await acceptRequest(req.user.id, req.params.userId);
  return res.status(result.status).json(
    result.connection
      ? { message: 'Connection accepted', connection: result.connection }
      : { message: result.message }
  );
});

export default router;
