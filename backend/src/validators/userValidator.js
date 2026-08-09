// src/validators/userValidator.js
// Validation chains for self-service profile updates and admin user updates.
import { body, query } from 'express-validator';

export const updateProfileValidator = [
  body('fullName').optional().trim().isLength({ min: 3, max: 100 }).matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name must be 3-100 letters/spaces'),
  body('phoneNumber').optional().trim().matches(/^\d{10,15}$/).withMessage('Phone number must be 10-15 digits'),
  body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('emergencyContactName').optional({ nullable: true }).trim(),
  body('emergencyContactPhone').optional({ nullable: true }).trim(),
];

export const adminUpdateUserValidator = [
  body('fullName').optional().trim().isLength({ min: 3, max: 100 }),
  body('phoneNumber').optional().trim().matches(/^\d{10,15}$/).withMessage('Phone number must be 10-15 digits'),
  body('address').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('role').optional().isIn(['patient', 'admin']).withMessage('Role must be patient or admin'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

export const resetPasswordValidator = [
  body('newPassword')
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
];

export const listUsersQueryValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('role').optional().isIn(['patient', 'admin']).withMessage('role must be patient or admin'),
  query('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/\\d/)
    .withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain a special character'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Confirm password does not match new password');
      }
      return true;
    }),
];