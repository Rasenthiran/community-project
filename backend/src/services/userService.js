// src/services/userService.js
// Business logic for the authenticated user's own profile and password.
import User from '../models/User.js';
import { comparePassword, hashPassword } from '../utils/hashPassword.js';
import { ApiError } from './authService.js';

const ALLOWED_SELF_UPDATE_FIELDS = [
  'fullName',
  'phoneNumber',
  'address',
  'city',
  'emergencyContactName',
  'emergencyContactPhone',
];

export const getOwnProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateOwnProfile = async (userId, payload) => {
  const updates = {};
  for (const field of ALLOWED_SELF_UPDATE_FIELDS) {
    if (payload[field] !== undefined) updates[field] = payload[field];
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const changeOwnPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

  user.password = await hashPassword(newPassword);
  await user.save();
  return user;
};
