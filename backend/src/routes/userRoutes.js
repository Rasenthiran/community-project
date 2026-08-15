// src/routes/userRoutes.js
// Authenticated user's own profile + password routes.
import { Router } from 'express';
import { getMe, updateMe, changePassword } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { updateProfileValidator, changePasswordValidator } from '../validators/userValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMe);
router.put('/me', updateProfileValidator, validateRequest, updateMe);
router.put('/change-password', changePasswordValidator, validateRequest, changePassword);

export default router;
