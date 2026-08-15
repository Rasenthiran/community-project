// src/services/adminUserService.js
// Business logic for admin-only user management operations.
import User from '../models/User.js';
import { hashPassword } from '../utils/hashPassword.js';
import { ApiError } from './authService.js';

// Deliberately excludes 'role': role is never changed through this generic update path.
// It's set once at creation — 'patient' by public registration, 'doctor' only via the
// transactional createDoctor flow, 'admin' only via the seeder. This closes off the
// otherwise-easy path of promoting any user to admin through a routine profile edit.
const ALLOWED_ADMIN_UPDATE_FIELDS = ['fullName', 'phoneNumber', 'address', 'city', 'isActive'];

export const listUsers = async ({ page = 1, limit = 20, search, role, isActive }) => {
  const filter = {};

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true' || isActive === true;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateUserByAdmin = async (id, payload) => {
  const updates = {};
  for (const field of ALLOWED_ADMIN_UPDATE_FIELDS) {
    if (payload[field] !== undefined) updates[field] = payload[field];
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const resetUserPassword = async (id, newPassword) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');

  user.password = await hashPassword(newPassword);
  await user.save();
  return user;
};

export const setUserActiveStatus = async (id, isActive) => {
  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
