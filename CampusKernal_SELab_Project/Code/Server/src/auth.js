import jwt from 'jsonwebtoken';
import { config } from './config.js';

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
