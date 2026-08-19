// src/app.js
// Express app setup: global middleware + route registration.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import doctorAppointmentRoutes from './routes/doctorAppointmentRoutes.js';
import adminAppointmentRoutes from './routes/adminAppointmentRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Global middleware
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Health check (unversioned — infra/uptime checks shouldn't depend on API version)
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

// Routes — all versioned under /api/v1
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/admin/appointments`, adminAppointmentRoutes);
app.use(`${API_PREFIX}/doctors`, doctorRoutes);
app.use(`${API_PREFIX}/doctor/appointments`, doctorAppointmentRoutes);
app.use(`${API_PREFIX}/appointments`, appointmentRoutes);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
