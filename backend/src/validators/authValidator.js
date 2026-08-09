// src/validators/authValidator.js
// express-validator chains for registration, login, and password change.
import { body } from 'express-validator';

export const registerValidator = [
  body('fullName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Full name must be between 3 and 100 characters')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),

  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),

  body('phoneNumber')
    .trim()
    .matches(/^\d{10,15}$/)
    .withMessage('Phone number must be 10-15 digits'),

  body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),

  body('dateOfBirth').isISO8601().toDate().withMessage('A valid date of birth is required'),

  body('nationalId').optional({ nullable: true }).trim(),

  body('address').trim().notEmpty().withMessage('Address is required'),

  body('city').trim().notEmpty().withMessage('City is required'),

  body('emergencyContactName').optional({ nullable: true }).trim(),
  body('emergencyContactPhone').optional({ nullable: true }).trim(),

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

  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('New password must contain a lowercase letter')
    .matches(/\d/)
    .withMessage('New password must contain a number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('New password must contain a special character'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];
