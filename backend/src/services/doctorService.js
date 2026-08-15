// src/services/doctorService.js
// Business logic for public + admin doctor management, and a doctor's own profile.
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { ApiError } from './authService.js';
import { hashPassword } from '../utils/hashPassword.js';

const DOCTOR_PUBLIC_POPULATE = { path: 'userId', select: 'fullName email phoneNumber gender' };

const ADMIN_UPDATABLE_FIELDS = [
  'specialization',
  'qualifications',
  'yearsOfExperience',
  'consultationFee',
  'biography',
  'languages',
  'department',
  'availableDays',
  'workingHours',
  'slotDurationMinutes',
  'profileImage',
];

// A doctor may tune their own bookable details, but not their own credentialing
// fields (specialization, registrationNumber, department) — those are admin-controlled.
const SELF_UPDATABLE_FIELDS = [
  'biography',
  'languages',
  'consultationFee',
  'availableDays',
  'workingHours',
  'slotDurationMinutes',
  'profileImage',
];

export const listDoctors = async ({ page = 1, limit = 20, search, specialization, department }) => {
  const filter = { isActive: true };

  if (search) filter.$text = { $search: search };
  if (specialization) filter.specialization = { $regex: specialization, $options: 'i' };
  if (department) filter.department = { $regex: department, $options: 'i' };

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).populate(DOCTOR_PUBLIC_POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Doctor.countDocuments(filter),
  ]);

  return {
    doctors,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  };
};

export const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id).populate(DOCTOR_PUBLIC_POPULATE);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

export const getDoctorProfileByUserId = async (userId) => {
  const doctor = await Doctor.findOne({ userId }).populate(DOCTOR_PUBLIC_POPULATE);
  if (!doctor) throw new ApiError(404, 'Doctor profile not found for this account');
  return doctor;
};

export const updateOwnDoctorProfile = async (userId, payload) => {
  const updates = {};
  for (const field of SELF_UPDATABLE_FIELDS) {
    if (payload[field] !== undefined) updates[field] = payload[field];
  }

  const doctor = await Doctor.findOneAndUpdate({ userId }, updates, { new: true, runValidators: true }).populate(
    DOCTOR_PUBLIC_POPULATE
  );
  if (!doctor) throw new ApiError(404, 'Doctor profile not found for this account');
  return doctor;
};

// Doctor creation provisions TWO documents (User + Doctor) that must succeed or
// fail together — an orphan User with role 'doctor' but no Doctor profile (or
// vice versa) is a broken account. We use a MongoDB transaction (requires the
// replica set that Atlas already gives us) so a failure in either half rolls
// back both: if Doctor.create() fails after User.create() already ran, the
// transaction aborts and the User insert is undone too, instead of a
// findOne()+create()+create() sequence that can leave a half-created account
// behind if the process crashes between the two writes.
export const createDoctor = async (payload) => {
  const {
    fullName,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    address,
    city,
    password,
    registrationNumber,
    specialization,
    qualifications,
    yearsOfExperience,
    consultationFee,
    biography,
    languages,
    department,
    availableDays,
    workingHours,
    slotDurationMinutes,
    profileImage,
  } = payload;

  const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email or phone number already exists');
  }
  const existingDoctor = await Doctor.findOne({ registrationNumber });
  if (existingDoctor) {
    throw new ApiError(409, 'A doctor with this registration number already exists');
  }

  const session = await mongoose.startSession();
  try {
    let createdDoctor;
    await session.withTransaction(async () => {
      const hashedPassword = await hashPassword(password);

      const [user] = await User.create(
        [
          {
            fullName,
            email,
            phoneNumber,
            gender,
            dateOfBirth,
            address,
            city,
            password: hashedPassword,
            role: 'doctor',
          },
        ],
        { session }
      );

      const [doctor] = await Doctor.create(
        [
          {
            userId: user._id,
            registrationNumber,
            specialization,
            qualifications,
            yearsOfExperience,
            consultationFee,
            biography,
            languages,
            department,
            availableDays,
            workingHours,
            slotDurationMinutes,
            profileImage,
          },
        ],
        { session }
      );

      createdDoctor = doctor;
    });

    return await Doctor.findById(createdDoctor._id).populate(DOCTOR_PUBLIC_POPULATE);
  } finally {
    await session.endSession();
  }
};

export const updateDoctor = async (id, payload) => {
  const updates = {};
  for (const field of ADMIN_UPDATABLE_FIELDS) {
    if (payload[field] !== undefined) updates[field] = payload[field];
  }

  const doctor = await Doctor.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate(
    DOCTOR_PUBLIC_POPULATE
  );
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

// Deleting a doctor account also deletes the linked User (they're one account).
// Both go together in a transaction for the same reason creation does.
export const deleteDoctor = async (id) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Doctor.findByIdAndDelete(id, { session });
      await User.findByIdAndDelete(doctor.userId, { session });
    });
  } finally {
    await session.endSession();
  }
  return doctor;
};

// Deactivating a doctor blocks NEW bookings only — existing confirmed
// appointments are left as-is per the confirmed business rule; admin handles
// those case-by-case rather than the system auto-cancelling them.
export const setDoctorStatus = async (id, isActive) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');

  doctor.isActive = isActive;
  await doctor.save();

  // Keep the underlying User's active flag in lockstep so a deactivated doctor
  // also can't log in, without introducing a second independent on/off switch.
  await User.findByIdAndUpdate(doctor.userId, { isActive });

  return Doctor.findById(id).populate(DOCTOR_PUBLIC_POPULATE);
};
