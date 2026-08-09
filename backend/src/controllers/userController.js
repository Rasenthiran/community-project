// src/controllers/userController.js
// Authenticated user's own profile + password management.
import * as userService from '../services/userService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getOwnProfile(req.user.userId);
    return successResponse(res, 200, 'Profile fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await userService.updateOwnProfile(req.user.userId, req.body);
    return successResponse(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    await userService.changeOwnPassword(req.user.userId, req.body);
    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
