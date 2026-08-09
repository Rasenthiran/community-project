// src/models/Doctor.js
// Mongoose schema only — no business logic here.
// A Doctor is a professional profile attached 1:1 to a User (role: 'doctor').
// Identity fields (name, email, phone, gender) live on User — not duplicated here.
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
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
      trim: true,
    },
    // Availability: a single working window applied to each available day.
    // Kept intentionally simple (no per-day overrides / recurring schedule engine)
    // per the "don't over-engineer" constraint — this is the first iteration.
    availableDays: {
      type: [String],
      enum: DAYS_OF_WEEK,
      default: [],
    },
    workingHours: {
      startTime: {
        type: String, // 'HH:mm', 24h, in system timezone (Asia/Colombo)
        default: null,
        validate: {
          validator: (v) => v === null || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
          message: 'startTime must be in HH:mm 24h format',
        },
      },
      endTime: {
        type: String,
        default: null,
        validate: {
          validator: (v) => v === null || /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
          message: 'endTime must be in HH:mm 24h format',
        },
      },
    },
    slotDurationMinutes: {
      type: Number,
      default: 30,
      min: [5, 'Slot duration must be at least 5 minutes'],
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

doctorSchema.index({ specialization: 'text', department: 'text' });

export const DAYS = DAYS_OF_WEEK;

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
