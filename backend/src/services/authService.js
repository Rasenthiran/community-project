// src/services/authService.js
// Business logic for registration and login. No req/res here.
import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/generateToken.js';

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const registerUser = async (payload) => {
  const { confirmPassword, ...rest } = payload;

  const existing = await User.findOne({
    $or: [{ email: rest.email }, { phoneNumber: rest.phoneNumber }],
  });

  if (existing) {
    const field = existing.email === rest.email ? 'email' : 'phone number';
    throw new ApiError(409, `An account with this ${field} already exists`);
  }

  const hashedPassword = await hashPassword(rest.password);

  const user = await User.create({
    ...rest,
    password: hashedPassword,
    role: 'patient', // role is never accepted from the public registration payload
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated. Contact an administrator.');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  return { token, user };
};

export { ApiError };
