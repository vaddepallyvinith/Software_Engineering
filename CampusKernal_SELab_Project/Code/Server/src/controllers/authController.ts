import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: signToken
//   Creates a signed JWT (JSON Web Token) containing the user's MongoDB _id.
//   The token is valid for 7 days. After that the user must log in again.
//
//   JWT = three base64 parts joined by dots:  header.payload.signature
//     • header  → { alg: "HS256", typ: "JWT" }
//     • payload → { id: "...", iat: ..., exp: ... }  (NOT encrypted — don't put secrets here!)
//     • signature → HMAC-SHA256(header + payload, JWT_SECRET)
// ─────────────────────────────────────────────────────────────────────────────
const signToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET!;
  // The '!' tells TypeScript "I guarantee this won't be undefined"
  // We check for its existence in index.ts at startup, so this is safe.
  return jwt.sign(
    { id: userId },   // payload — what data to embed in the token
    secret,           // secret key — only the server knows this
    { expiresIn: '7d' } // token lifetime
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
//   1. Check email isn't already taken
//   2. Hash the password (never store plain text!)
//   3. Save the new user to MongoDB with full profile
//   4. Sign a JWT and send it back so the user is immediately logged in
// ─────────────────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    // Destructure everything the frontend sends in req.body (the JSON body)
    const {
      name,
      email,
      password,
      universityName,
      country,
      course,
      currentYear,
      yearOfGraduation,
      enrollmentNo,   // optional
    } = req.body;

    // ── Step 1: Check if email is already taken ──────────────────────────
    // User.findOne searches MongoDB for ONE document matching the filter.
    // If it finds one, we stop and tell the client to log in instead.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
      return; // stop executing — we already sent a response
    }

    // ── Step 2: Hash the password ────────────────────────────────────────
    // bcrypt.genSalt(10) generates a random "salt" with complexity factor 10.
    // The salt means two users with the same password will have DIFFERENT hashes.
    // bcrypt.hash() runs the password + salt through the bcrypt algorithm.
    // Result looks like: "$2b$10$..." — this is what we store in MongoDB.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ── Step 3: Create the User document ─────────────────────────────────
    // 'new User({...})' constructs a Mongoose document in memory (not saved yet).
    // '.save()' sends the INSERT command to MongoDB Atlas.
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // store the hash, never the original!
      profile: {
        universityName,
        country,
        course,
        currentYear,
        yearOfGraduation,
        enrollmentNo,    // undefined is fine — schema marks it optional
      },
    });
    await newUser.save();

    // ── Step 4: Sign and return JWT ──────────────────────────────────────
    // We cast _id to string because Mongoose types it as 'unknown' internally.
    const token = signToken(newUser._id.toString());

    // 201 = "Created" — the standard HTTP status for a successful resource creation
    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error: unknown) {
    // Mongoose validation errors (e.g. missing required field) arrive here
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
//   1. Find the user by email (and pull password back in — it's excluded by default)
//   2. Compare the submitted plain-text password against the stored bcrypt hash
//   3. If correct, sign a new JWT and return it
// ─────────────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ── Basic validation ──────────────────────────────────────────────────
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide both email and password.' });
      return;
    }

    // ── Step 1: Find user by email ────────────────────────────────────────
    // '.select("+password")' is required because the schema has 'select: false'
    // on the password field — without this, password would be undefined!
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      // Use a vague message on purpose — don't reveal whether the EMAIL exists
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    // ── Step 2: Compare passwords ─────────────────────────────────────────
    // bcrypt.compare() hashes the incoming 'password' with the same salt that
    // was used during registration and checks if the result matches 'user.password'.
    // This is the ONLY correct way to verify bcrypt hashes.
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    // ── Step 3: Sign and return JWT ───────────────────────────────────────
    const token = signToken(user._id.toString());

    // 200 = "OK" — the standard HTTP status for a successful request
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        isVerified: user.isVerified,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};