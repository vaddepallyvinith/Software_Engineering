import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { User } from './models/User.js';

export const signToken = (userId) => jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '7d' });

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided. Please log in.' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { id: decoded.id };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

export const requireAdmin = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided. Please log in.' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select('_id role');

    if (!user) {
      return res.status(401).json({ message: 'User not found for this token.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    req.user = { id: user._id.toString(), role: user.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};
