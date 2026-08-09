// src/middleware/roleMiddleware.js
// Factory that returns middleware restricting access to specific roles.
// Usage: requireRole('admin')
import { errorResponse } from '../utils/apiResponse.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 403, 'Forbidden: Insufficient permissions');
    }
    next();
  };
};
