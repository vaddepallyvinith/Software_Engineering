import express from 'express';
import { protectRoute, AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { Response } from 'express';

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/me
//
// This is the "gateway" to the Me Space.
// The route has TWO handlers chained together:
//
//   1. protectRoute  — runs FIRST. Verifies the JWT.
//      • If token is bad → sends 401, stops here (next() never called).
//      • If token is good → sets req.user = { id: "..." }, calls next().
//
//   2. The async callback — runs SECOND (only if protectRoute passed).
//      Fetches the full user from MongoDB using the ID from the token.
//      Returns the user's profile data — this is what the frontend will
//      display in the "Me Space" dashboard.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', protectRoute, async (req: AuthRequest, res: Response) => {
  try {
    // req.user.id was set by protectRoute after verifying the JWT.
    // User.findById fetches the full document from MongoDB by its _id.
    // .select('-password') explicitly excludes the password hash from the result
    // (even though 'select:false' already does this, being explicit is good practice).
    const user = await User.findById(req.user!.id).select('-password');

    if (!user) {
      // Edge case: token was valid but user was deleted from DB after token was issued
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // 200 = OK — return the user's full profile to the frontend
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

export default router;
