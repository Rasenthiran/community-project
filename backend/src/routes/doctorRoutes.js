// src/routes/doctorRoutes.js
// Public doctor browsing + a doctor's own profile + admin doctor management.
import { Router } from 'express';
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  setDoctorStatus,
  getMyDoctorProfile,
  updateMyDoctorProfile,
} from '../controllers/doctorController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  createDoctorValidator,
  updateDoctorValidator,
  updateOwnDoctorValidator,
  doctorStatusValidator,
  listDoctorsQueryValidator,
} from '../validators/doctorValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

// Doctor's own profile — must come before '/:id' so 'me' isn't parsed as an ObjectId.
router.get('/me', authenticate, requireRole('doctor'), getMyDoctorProfile);
router.put(
  '/me',
  authenticate,
  requireRole('doctor'),
  updateOwnDoctorValidator,
  validateRequest,
  updateMyDoctorProfile
);

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
