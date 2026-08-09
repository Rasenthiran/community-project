// src/services/doctorService.js
// Business logic for public + admin doctor management.
import Doctor from '../models/Doctor.js';
import { ApiError } from './authService.js';

const ALLOWED_UPDATE_FIELDS = [
  'fullName',
  'gender',
  'email',
  'phoneNumber',
  'specialization',
  'qualifications',
  'yearsOfExperience',
  'consultationFee',
  'biography',
  'languages',
  'department',
  'availableDays',
  'availableTime',
  'profileImage',
];

export const listDoctors = async ({ page = 1, limit = 20, search, specialization, department }) => {
  const filter = { isActive: true };

  if (search) filter.fullName = { $regex: search, $options: 'i' };
  if (specialization) filter.specialization = { $regex: specialization, $options: 'i' };
  if (department) filter.department = { $regex: department, $options: 'i' };

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Doctor.countDocuments(filter),
  ]);

  return {
    doctors,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

export const getDoctorById = async (id) => {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

export const createDoctor = async (payload) => {
  const existing = await Doctor.findOne({ registrationNumber: payload.registrationNumber });
  if (existing) {
    throw new ApiError(409, 'A doctor with this registration number already exists');
  }
  return Doctor.create(payload);
};

export const updateDoctor = async (id, payload) => {
  const updates = {};
  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (payload[field] !== undefined) updates[field] = payload[field];
  }

  const doctor = await Doctor.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

export const deleteDoctor = async (id) => {
  const doctor = await Doctor.findByIdAndDelete(id);
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};

export const setDoctorStatus = async (id, isActive) => {
  const doctor = await Doctor.findByIdAndUpdate(id, { isActive }, { new: true });
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
};
