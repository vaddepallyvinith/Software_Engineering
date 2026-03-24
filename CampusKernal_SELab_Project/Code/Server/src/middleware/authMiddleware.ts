import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ─────────────────────────────────────────────────────────────────────────────
// Extend Express's Request type so TypeScript knows 'req.user' can exist.
// Without this, TypeScript would throw a type error when you do req.user = ...
// ─────────────────────────────────────────────────────────────────────────────
export interface AuthRequest extends Request {
  user?: { id: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// protectRoute — JWT Guard Middleware
//
// HOW MIDDLEWARE WORKS IN EXPRESS:
//   Every request flows through a chain: middleware1 → middleware2 → controller
//   Each function receives (req, res, next).
//   Calling next() says "I'm done, pass to the next function in the chain."
//   NOT calling next() (and sending a response instead) terminates the chain.
//
// WHAT THIS MIDDLEWARE DOES:
//   1. Reads the 'Authorization' header from the incoming request
//   2. Expects it in the format:  Authorization: Bearer eyJhbGci...
//   3. Extracts the token (everything after "Bearer ")
//   4. Verifies the token's signature using JWT_SECRET
//   5. If valid → attaches the decoded payload to req.user and calls next()
//   6. If invalid / missing → sends 401 Unauthorized and stops the chain
// ─────────────────────────────────────────────────────────────────────────────
export const protectRoute = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // ── Step 1: Get the Authorization header ─────────────────────────────────

  const authHeader = req.headers.authorization;

  // ── Step 2: Check header exists and starts with 'Bearer ' ────────────────
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message: 'Access denied. No token provided. Please log in.',
    });
    return; 
  }

  // ── Step 3: Extract the token string ─────────────────────────────────────
  // "Bearer eyJhbG..." → split on space → ["Bearer", "eyJhbG..."] → take index 1
  const token = authHeader.split(' ')[1];

  // ── Step 4: Verify the token ──────────────────────────────────────────────
  // jwt.verify() does three things:
  //   a) Checks the signature (was this token signed with OUR JWT_SECRET?)
  //   b) Checks expiry (has 7 days passed since it was issued?)
  //   c) Returns the decoded payload  { id: "...", iat: ..., exp: ... }
  // If any check fails, it throws an error caught by the catch block.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // ── Step 5: Attach user identity to the request ───────────────────────
    // Every subsequent handler in the chain can now read req.user.id
    // to know WHO is making the request — without hitting the DB again.
    req.user = { id: decoded.id };

    next(); //  token is valid — proceed to the actual route handler
  } catch (error) {
    // Token is expired, tampered with, or just garbage
    res.status(401).json({
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};
