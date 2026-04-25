import express from 'express';
import { requireAuth } from '../auth.js';
import { acceptRequest, getMatches, getNetwork, sendRequest } from '../services/synergyService.js';

const router = express.Router();

router.use(requireAuth);

router.get('/matches', async (req, res) => {
  try {
    const matches = await getMatches(req.user.id);
    if (!matches) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(matches);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load matches' });
  }
});

router.get('/network', async (req, res) => {
  try {
    return res.status(200).json(await getNetwork(req.user.id));
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load network' });
  }
});

router.post('/connect/:userId', async (req, res) => {
  try {
    const result = await sendRequest(req.user.id, req.params.userId);
    return res.status(result.status).json(
      result.connection
        ? { message: 'Request sent successfully', connection: result.connection }
        : { message: result.message }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to send request' });
  }
});

router.put('/accept/:userId', async (req, res) => {
  try {
    const result = await acceptRequest(req.user.id, req.params.userId);
    return res.status(result.status).json(
      result.connection
        ? { message: 'Connection accepted', connection: result.connection }
        : { message: result.message }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to accept request' });
  }
});

export default router;
