import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import meRoutes from './routes/meRoutes.js';

// ── Load .env variables ───────────────────────────────────────────────────────
// Must be called before reading process.env anywhere in this file.
dotenv.config();

const app = express();

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors());          // Allow cross-origin requests (React frontend on a different port)
app.use(express.json());  // Parse incoming JSON request bodies (req.body)

// ── Routes ────────────────────────────────────────────────────────────────────
// All auth endpoints live under /api/auth  (public — no login needed)
app.use('/api/auth', authRoutes);

// All "Me Space" endpoints live under /api/me  (protected — JWT required)
app.use('/api/me', meRoutes);

// Root health-check — useful to confirm the server is alive
app.get('/', (_req, res) => {
  res.send('Campus Kernel API is running ');
});

// ── Startup Checks ────────────────────────────────────────────────────────────
const mongoURI = process.env.MONGO_URI || '';
if (!mongoURI) {
  console.error(' MONGO_URI is missing from .env — cannot start server.');
  process.exit(1); // Exit with error code 1 (non-zero = failure)
}

const jwtSecret = process.env.JWT_SECRET || '';
if (!jwtSecret) {
  console.error(' JWT_SECRET is missing from .env — cannot start server.');
  process.exit(1);
}

// ── Connect to MongoDB Atlas ──────────────────────────────────────────────────
// mongoose.connect() returns a Promise.
// .then() runs when connection succeeds; .catch() runs on failure.
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log(' Connected to MongoDB Atlas');

    // Only start the HTTP server AFTER the DB is connected.
    // If we started listening first and DB failed, API calls would crash.
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  });