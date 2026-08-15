// src/routes/appointmentRoutes.js
// Patient-facing appointment routes. All require authentication; role is
// implicitly "patient" since only patients book on their own behalf here
// (admins/doctors have their own dedicated appointment routes/permissions).
import { Router } from 'express';
import {
  createAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  createAppointmentValidator,
  cancelAppointmentValidator,
  listAppointmentsQueryValidator,
} from '../validators/appointmentValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate, requireRole('patient'));

router.post('/', createAppointmentValidator, validateRequest, createAppointment);
router.get('/my', listAppointmentsQueryValidator, validateRequest, getMyAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/cancel', cancelAppointmentValidator, validateRequest, cancelAppointment);

export default router;
