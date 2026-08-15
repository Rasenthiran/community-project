// src/controllers/adminUserController.js
// Admin-only user management endpoints.
import * as adminUserService from '../services/adminUserService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, isActive } = req.query;
    const { users, pagination } = await adminUserService.listUsers({ page, limit, search, role, isActive });
    return successResponse(res, 200, 'Users fetched successfully', users, { pagination });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await adminUserService.getUserById(req.params.id);
    return successResponse(res, 200, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await adminUserService.updateUserByAdmin(req.params.id, req.body);
    return successResponse(res, 200, 'User updated successfully', user);
  } catch (error) {
    next(error);
  }
};

export const resetUserPassword = async (req, res, next) => {
  try {
    await adminUserService.resetUserPassword(req.params.id, req.body.newPassword);
    return successResponse(res, 200, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await adminUserService.setUserActiveStatus(req.params.id, false);
    return successResponse(res, 200, 'User deactivated successfully', user);
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (req, res, next) => {
  try {
    const user = await adminUserService.setUserActiveStatus(req.params.id, true);
    return successResponse(res, 200, 'User activated successfully', user);
  } catch (error) {
    next(error);
  }
};
