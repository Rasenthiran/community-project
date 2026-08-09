// src/middleware/rateLimiter.js
// Blunts brute-force/credential-stuffing attempts against auth endpoints.
// In-memory store is fine for a single-instance deployment; swap for a shared
// store (e.g. Redis) if this ever runs behind a load balancer with multiple instances.
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window across login+register combined
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});
