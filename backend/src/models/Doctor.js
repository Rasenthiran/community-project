// src/models/Doctor.js
// Mongoose schema only — no business logic here.
import mongoose from 'mongoose';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    qualifications: {
      type: [String],
      default: [],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      default: 0,
    },
    consultationFee: {
      type: Number,
      min: [0, 'Consultation fee cannot be negative'],
      default: 0,
    },
    biography: {
      type: String,
      default: '',
    },
    languages: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      default: '',
    },
    availableDays: {
      type: [String],
      enum: DAYS_OF_WEEK,
      default: [],
    },
    availableTime: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

doctorSchema.index({ fullName: 'text', specialization: 'text', department: 'text' });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
