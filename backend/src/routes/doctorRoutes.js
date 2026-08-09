// src/routes/doctorRoutes.js
// Public doctor browsing + admin doctor management routes.
import { Router } from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  setDoctorStatus,
} from '../controllers/doctorController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  createDoctorValidator,
  updateDoctorValidator,
  doctorStatusValidator,
  listDoctorsQueryValidator,
} from '../validators/doctorValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

// Public
router.get('/', listDoctorsQueryValidator, validateRequest, getAllDoctors);
router.get('/:id', getDoctorById);

// Admin only
router.post('/', authenticate, requireRole('admin'), createDoctorValidator, validateRequest, createDoctor);
router.put('/:id', authenticate, requireRole('admin'), updateDoctorValidator, validateRequest, updateDoctor);
router.delete('/:id', authenticate, requireRole('admin'), deleteDoctor);
router.put(
  '/:id/status',
  authenticate,
  requireRole('admin'),
  doctorStatusValidator,
  validateRequest,
  setDoctorStatus
);

export default router;
