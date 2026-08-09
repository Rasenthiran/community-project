// src/routes/doctorAppointmentRoutes.js
// Doctor-facing appointment routes — mounted at /api/v1/doctor/appointments.
import { Router } from 'express';
import {
  getMyDoctorAppointments,
  getDoctorAppointmentById,
  updateAppointmentStatus,
} from '../controllers/doctorAppointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  doctorStatusActionValidator,
  listAppointmentsQueryValidator,
} from '../validators/appointmentValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate, requireRole('doctor'));

router.get('/', listAppointmentsQueryValidator, validateRequest, getMyDoctorAppointments);
router.get('/:id', getDoctorAppointmentById);
router.put('/:id/status', doctorStatusActionValidator, validateRequest, updateAppointmentStatus);

export default router;
