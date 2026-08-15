// src/routes/adminRoutes.js
// Admin-only user management routes. All routes require authenticate + requireRole('admin').
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  resetUserPassword,
  deactivateUser,
  activateUser,
} from '../controllers/adminUserController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import {
  adminUpdateUserValidator,
  resetPasswordValidator,
  listUsersQueryValidator,
} from '../validators/userValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/users', listUsersQueryValidator, validateRequest, getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', adminUpdateUserValidator, validateRequest, updateUser);
router.put('/users/:id/reset-password', resetPasswordValidator, validateRequest, resetUserPassword);
router.put('/users/:id/deactivate', deactivateUser);
router.put('/users/:id/activate', activateUser);

export default router;
