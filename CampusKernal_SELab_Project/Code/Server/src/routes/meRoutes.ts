import express from 'express';
import { protectRoute, AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { Response } from 'express';

const router = express.Router();

router.get('/', protectRoute, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json({
      message: 'Welcome to your Me Space!',
      user,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// New endpoint for updating tasks, events, records, cgpa
router.put('/update', protectRoute, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    if (req.body.tasks !== undefined) user.tasks = req.body.tasks;
    if (req.body.events !== undefined) user.events = req.body.events;
    if (req.body.records !== undefined) user.records = req.body.records;
    if (req.body.cgpa !== undefined) user.cgpa = req.body.cgpa;
    if (req.body.skills !== undefined) user.profile.skills = req.body.skills;
    if (req.body.location !== undefined) user.profile.location = req.body.location;

    await user.save();
    
    res.status(200).json({ message: 'Updated successfully', user });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

export default router;
