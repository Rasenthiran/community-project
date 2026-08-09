// src/validators/doctorValidator.js
// Validation chains for doctor creation (User + Doctor), updates, and listing.
import { body, query } from 'express-validator';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const workingHoursValidators = (prefix = '') => [
  body(`${prefix}workingHours.startTime`).optional({ nullable: true }).matches(TIME_REGEX).withMessage('workingHours.startTime must be HH:mm'),
  body(`${prefix}workingHours.endTime`).optional({ nullable: true }).matches(TIME_REGEX).withMessage('workingHours.endTime must be HH:mm'),
  body(`${prefix}slotDurationMinutes`).optional().isInt({ min: 5 }).withMessage('slotDurationMinutes must be at least 5'),
  body(`${prefix}availableDays`)
    .optional()
    .isArray()
    .withMessage('availableDays must be an array')
    .custom((days) => days.every((d) => DAYS_OF_WEEK.includes(d)))
    .withMessage('availableDays must contain valid weekday names'),
];

// Admin creating a doctor: this creates BOTH the User account and the Doctor profile,
// so it validates identity/credential fields as well as professional fields.
export const createDoctorValidator = [
  body('fullName').trim().isLength({ min: 3, max: 100 }).withMessage('Full name must be 3-100 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phoneNumber').trim().matches(/^\d{10,15}$/).withMessage('Phone number must be 10-15 digits'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  body('dateOfBirth').isISO8601().toDate().withMessage('A valid date of birth is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain a special character'),

  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('qualifications').optional().isArray().withMessage('Qualifications must be an array'),
  body('yearsOfExperience').optional().isFloat({ min: 0 }).withMessage('Years of experience cannot be negative'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee cannot be negative'),
  body('languages').optional().isArray().withMessage('Languages must be an array'),
  body('department').optional().trim(),
  ...workingHoursValidators(),
];

export const updateDoctorValidator = [
  body('specialization').optional().trim().notEmpty(),
  body('department').optional().trim(),
  body('yearsOfExperience').optional().isFloat({ min: 0 }).withMessage('Years of experience cannot be negative'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee cannot be negative'),
  body('qualifications').optional().isArray(),
  body('languages').optional().isArray(),
  ...workingHoursValidators(),
];

// A doctor updating their own profile — same shape minus credentialing fields
// (enforced by which fields the service actually reads, not by this validator).
export const updateOwnDoctorValidator = [
  body('biography').optional().trim().isLength({ max: 2000 }),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee cannot be negative'),
  body('languages').optional().isArray(),
  body('profileImage').optional({ nullable: true }).trim(),
  ...workingHoursValidators(),
];

export const doctorStatusValidator = [body('isActive').isBoolean().withMessage('isActive must be boolean')];

export const listDoctorsQueryValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];
