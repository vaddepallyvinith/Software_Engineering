import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST http://localhost:5001/api/auth/register
// Anyone can call this — no auth required (it's how you GET a token!)
router.post('/register', register);

// POST http://localhost:5001/api/auth/login
// Anyone can call this — submits email + password, receives a JWT
router.post('/login', login);

export default router;