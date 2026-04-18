import express from 'express';
import { getMatches, sendRequest, acceptRequest, getNetwork } from '../controllers/synergyController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// All synergy endpoints require authentication
router.use(protectRoute);

router.get('/matches', getMatches);
router.get('/network', getNetwork);
router.post('/connect/:userId', sendRequest);
router.put('/accept/:userId', acceptRequest);

export default router;
