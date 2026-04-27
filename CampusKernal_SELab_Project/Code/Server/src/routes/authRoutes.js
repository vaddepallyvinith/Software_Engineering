import express from 'express';
import crypto from 'crypto';
import { config } from '../config.js';
import { createUser, getUserByEmail, resetPasswordWithToken, setResetToken, verifyUserPassword } from '../services/userService.js';
import { signToken } from '../auth.js';
import { canSendMail, sendPasswordResetMail } from '../mailer.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const password = String(req.body.password || '');
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.' });
    }

    const user = await createUser(req.body);
    return res.status(201).json({
      message: 'Account created successfully!',
      token: signToken(user._id),
      user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const user = await getUserByEmail(email);
    if (!user || !(await verifyUserPassword(user, password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      token: signToken(user.id),
      user: {
        _id: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Login failed.' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
      return res.status(200).json({ message: 'If an account with that email exists, we sent a password reset link.' });
    }

    if (!canSendMail()) {
      return res.status(500).json({
        message: 'Password reset email is not configured yet. Set the SMTP_* variables on the server first.',
      });
    }

    const token = crypto.randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await setResetToken(user.email, token, expiresAt);
    const resetUrl = `${config.clientUrl}/reset-password/${token}`;

    await sendPasswordResetMail({
      to: user.email,
      name: user.name,
      resetUrl,
      expiresAt,
    });

    return res.status(200).json({
      message: 'Password reset link sent to your email.',
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Failed to send password reset email.',
    });
  }
});

router.post('/reset-password/:token', async (req, res) => {
  const password = String(req.body.password || '');
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const user = await resetPasswordWithToken(req.params.token, password);
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  return res.status(200).json({ message: 'Password reset successful' });
});

export default router;
