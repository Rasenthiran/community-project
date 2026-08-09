// src/validators/doctorValidator.js
// Validation chains for doctor creation, update, and listing.
import { body, query } from 'express-validator';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const createDoctorValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('email').optional({ nullable: true }).trim().isEmail().withMessage('Invalid email address'),
  body('phoneNumber').optional({ nullable: true }).trim(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('qualifications').optional().isArray().withMessage('Qualifications must be an array'),
  body('yearsOfExperience').optional().isFloat({ min: 0 }).withMessage('Years of experience cannot be negative'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee cannot be negative'),
  body('languages').optional().isArray().withMessage('Languages must be an array'),
  body('availableDays')
    .optional()
    .isArray()
    .withMessage('Available days must be an array')
    .custom((days) => days.every((d) => DAYS_OF_WEEK.includes(d)))
    .withMessage('Available days must be valid weekday names'),
];

export const updateDoctorValidator = [
  body('fullName').optional().trim().notEmpty(),
  body('specialization').optional().trim().notEmpty(),
  body('email').optional({ nullable: true }).trim().isEmail().withMessage('Invalid email address'),
  body('yearsOfExperience').optional().isFloat({ min: 0 }).withMessage('Years of experience cannot be negative'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee cannot be negative'),
  body('availableDays')
    .optional()
    .isArray()
    .custom((days) => days.every((d) => DAYS_OF_WEEK.includes(d)))
    .withMessage('Available days must be valid weekday names'),
];

export const doctorStatusValidator = [
  body('isActive').isBoolean().withMessage('isActive must be boolean'),
];

export const listDoctorsQueryValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];
