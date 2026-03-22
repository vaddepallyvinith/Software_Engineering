import express from 'express';
import { register } from '../controllers/authController.js';

const router = express.Router();

// This endpoint will be: POST http://localhost:5001/api/auth/register
router.post('/register', register);

export default router;