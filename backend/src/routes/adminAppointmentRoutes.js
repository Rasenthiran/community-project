// src/routes/adminAppointmentRoutes.js
// Admin appointment management — mounted at /api/v1/admin/appointments.
import { Router } from 'express';
import {
  getAllAppointments,
  getAppointmentById,
  setAppointmentStatus,
} from '../controllers/adminAppointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  adminListAppointmentsQueryValidator,
  adminStatusValidator,
} from '../validators/appointmentValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/', adminListAppointmentsQueryValidator, validateRequest, getAllAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/status', adminStatusValidator, validateRequest, setAppointmentStatus);

export default router;
