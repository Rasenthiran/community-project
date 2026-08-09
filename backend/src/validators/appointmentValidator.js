// src/validators/appointmentValidator.js
// Validation chains for booking, cancelling, and status-updating appointments.
import { body, query } from 'express-validator';
import { DATE_STR_REGEX, TIME_STR_REGEX } from '../utils/timeSlots.js';

export const createAppointmentValidator = [
  body('doctorId').isMongoId().withMessage('A valid doctorId is required'),
  body('appointmentDate')
    .matches(DATE_STR_REGEX)
    .withMessage('appointmentDate must be in YYYY-MM-DD format'),
  body('appointmentStartTime')
    .matches(TIME_STR_REGEX)
    .withMessage('appointmentStartTime must be in HH:mm 24h format'),
  body('reason').optional({ nullable: true }).trim().isLength({ max: 500 }),
];

export const cancelAppointmentValidator = [
  body('cancellationReason').optional({ nullable: true }).trim().isLength({ max: 500 }),
];

export const doctorStatusActionValidator = [
  body('action').isIn(['confirm', 'reject', 'cancel', 'complete']).withMessage('Invalid action'),
  body('note').optional({ nullable: true }).trim().isLength({ max: 500 }),
];

export const adminStatusValidator = [
  body('status')
    .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'rejected'])
    .withMessage('Invalid status'),
  body('note').optional({ nullable: true }).trim().isLength({ max: 500 }),
];

export const listAppointmentsQueryValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled', 'rejected']),
];

export const adminListAppointmentsQueryValidator = [
  ...listAppointmentsQueryValidator,
  query('doctorId').optional().isMongoId(),
  query('patientId').optional().isMongoId(),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
];
