// src/services/appointmentService.js
// Business logic for booking, conflict prevention, and the appointment status
// lifecycle. This is the module referenced throughout Section 8 of the brief.
//
// CONCURRENCY-SAFE BOOKING STRATEGY (read this before touching booking logic):
//
// We do NOT rely on "findOne() to check availability, then create() if free."
// That sequence has a race window: two concurrent requests can both read
// "no conflict found" before either has written anything, and both then
// succeed in creating an appointment for the same doctor+slot.
//
// Instead, the guarantee lives at the database level: Appointment has two
// partial unique indexes (see models/Appointment.js) on
// {doctorId, slotDateTime} and {patientId, slotDateTime}, scoped to
// status in ['pending', 'confirmed']. MongoDB enforces uniqueness at the
// moment of insert, atomically, regardless of how many requests race each
// other — there is no gap between "check" and "write" because there is no
// separate check; the write itself is the check.
//
// We still run pre-validation (doctor/patient active, availability window,
// not in the past) before attempting the insert, both for a fast/clear error
// message and to avoid unnecessary writes — but the actual conflict
// guarantee is the unique index, not this pre-check. If the pre-check says
// "free" but a concurrent request wins the race, the insert throws a Mongo
// duplicate-key error (code 11000), which we catch here and translate into
// a 409 Conflict. A cancelled/rejected appointment doesn't hold the index
// entry (it falls outside the partial filter), so cancelling a slot
// immediately frees it for rebooking.
import mongoose from 'mongoose';
import Appointment, { ACTIVE_STATUSES } from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { ApiError } from './authService.js';
import {
  toUtcSlotDateTime,
  dateOnlyUtc,
  dayOfWeekName,
  isWithinWindow,
  isAlignedToSlotGrid,
  DATE_STR_REGEX,
  TIME_STR_REGEX,
} from '../utils/timeSlots.js';

const CANCELLATION_WINDOW_MS = 2 * 60 * 60 * 1000; // patients may cancel up to 2 hours before the slot

// Centralized transition table: from-status -> to-status -> roles allowed to trigger it.
// Nothing outside this table is a legal transition, for any role.
const TRANSITIONS = {
  pending: {
    confirmed: ['doctor', 'admin'],
    rejected: ['doctor', 'admin'],
    cancelled: ['patient', 'doctor', 'admin'],
  },
  confirmed: {
    completed: ['doctor', 'admin'],
    cancelled: ['patient', 'doctor', 'admin'],
  },
  completed: {},
  cancelled: {},
  rejected: {},
};

const assertTransitionAllowed = (role, fromStatus, toStatus) => {
  const allowedRoles = TRANSITIONS[fromStatus]?.[toStatus];
  if (!allowedRoles || !allowedRoles.includes(role)) {
    throw new ApiError(400, `Cannot transition appointment from '${fromStatus}' to '${toStatus}'`);
  }
};

const loadActiveDoctorAndUser = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, 'Doctor not found');

  const doctorUser = await User.findById(doctor.userId);
  if (!doctorUser) throw new ApiError(404, 'Doctor account not found');

  return { doctor, doctorUser };
};

const validateBookingWindow = (doctor, dateStr, timeStr) => {
  const day = dayOfWeekName(dateStr);
  if (!doctor.availableDays.includes(day)) {
    throw new ApiError(409, `Doctor is not available on ${day}`);
  }

  const { startTime, endTime } = doctor.workingHours || {};
  if (!startTime || !endTime) {
    throw new ApiError(409, 'Doctor has not configured working hours');
  }

  if (!isWithinWindow(timeStr, doctor.slotDurationMinutes, startTime, endTime)) {
    throw new ApiError(409, `Requested time is outside doctor's working hours (${startTime}-${endTime})`);
  }

  if (!isAlignedToSlotGrid(timeStr, startTime, doctor.slotDurationMinutes)) {
    throw new ApiError(
      409,
      `Requested time does not align to the doctor's ${doctor.slotDurationMinutes}-minute slot grid`
    );
  }
};

export const createAppointment = async (patientId, payload) => {
  const { doctorId, appointmentDate, appointmentStartTime, reason } = payload;

  if (!DATE_STR_REGEX.test(appointmentDate)) {
    throw new ApiError(400, 'appointmentDate must be in YYYY-MM-DD format');
  }
  if (!TIME_STR_REGEX.test(appointmentStartTime)) {
    throw new ApiError(400, 'appointmentStartTime must be in HH:mm 24h format');
  }

  const patient = await User.findById(patientId);
  if (!patient) throw new ApiError(404, 'Patient not found');
  if (!patient.isActive) throw new ApiError(403, 'Inactive accounts cannot book appointments');

  const { doctor, doctorUser } = await loadActiveDoctorAndUser(doctorId);
  if (!doctor.isActive || !doctorUser.isActive) {
    throw new ApiError(409, 'This doctor is not currently accepting appointments');
  }

  validateBookingWindow(doctor, appointmentDate, appointmentStartTime);

  const slotDateTime = toUtcSlotDateTime(appointmentDate, appointmentStartTime);
  if (slotDateTime.getTime() <= Date.now()) {
    throw new ApiError(409, 'Cannot book an appointment in the past');
  }

  try {
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      appointmentDate: dateOnlyUtc(appointmentDate),
      appointmentStartTime,
      durationMinutes: doctor.slotDurationMinutes,
      slotDateTime,
      status: 'pending',
      reason: reason || '',
    });
    return appointment;
  } catch (err) {
    // Duplicate-key error from one of the two partial unique indexes = a genuine
    // conflict, either lost to a concurrent request or missed by the pre-check above.
    if (err.code === 11000) {
      const key = Object.keys(err.keyPattern || {});
      if (key.includes('doctorId')) {
        throw new ApiError(409, 'This doctor already has an appointment at that time');
      }
      if (key.includes('patientId')) {
        throw new ApiError(409, 'You already have another appointment booked at that time');
      }
      throw new ApiError(409, 'This slot is no longer available');
    }
    throw err;
  }
};

export const getMyAppointments = async (patientId, { page = 1, limit = 20, status }) => {
  const filter = { patientId };
  if (status) filter.status = status;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate({ path: 'doctorId', select: 'specialization department consultationFee' })
      .sort({ slotDateTime: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Appointment.countDocuments(filter),
  ]);

  return { appointments, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } };
};

const loadOwnedAppointment = async (appointmentId, patientId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  if (appointment.patientId.toString() !== patientId.toString()) {
    throw new ApiError(403, 'You do not have access to this appointment');
  }
  return appointment;
};

export const getAppointmentForPatient = async (appointmentId, patientId) => {
  return loadOwnedAppointment(appointmentId, patientId);
};

export const cancelAppointmentByPatient = async (appointmentId, patientId, cancellationReason) => {
  const appointment = await loadOwnedAppointment(appointmentId, patientId);

  assertTransitionAllowed('patient', appointment.status, 'cancelled');

  const msUntilSlot = appointment.slotDateTime.getTime() - Date.now();
  if (msUntilSlot < CANCELLATION_WINDOW_MS) {
    throw new ApiError(409, 'Appointments can only be cancelled at least 2 hours in advance');
  }

  appointment.status = 'cancelled';
  appointment.cancellationReason = cancellationReason || '';
  appointment.lastUpdatedByRole = 'patient';
  await appointment.save();
  return appointment;
};

// --- Doctor-side ---

export const getDoctorProfileByUserId = async (userId) => {
  const doctor = await Doctor.findOne({ userId });
  if (!doctor) throw new ApiError(404, 'Doctor profile not found for this account');
  return doctor;
};

export const listDoctorAppointments = async (doctorUserId, { page = 1, limit = 20, status }) => {
  const doctor = await getDoctorProfileByUserId(doctorUserId);

  const filter = { doctorId: doctor._id };
  if (status) filter.status = status;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate({ path: 'patientId', select: 'fullName email phoneNumber' })
      .sort({ slotDateTime: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Appointment.countDocuments(filter),
  ]);

  return { appointments, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } };
};

const loadDoctorOwnedAppointment = async (appointmentId, doctorUserId) => {
  const doctor = await getDoctorProfileByUserId(doctorUserId);
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  if (appointment.doctorId.toString() !== doctor._id.toString()) {
    throw new ApiError(403, 'You do not have access to this appointment');
  }
  return appointment;
};

export const getAppointmentForDoctor = async (appointmentId, doctorUserId) => {
  return loadDoctorOwnedAppointment(appointmentId, doctorUserId);
};

// action: 'confirm' | 'reject' | 'cancel' | 'complete'
const DOCTOR_ACTION_TO_STATUS = {
  confirm: 'confirmed',
  reject: 'rejected',
  cancel: 'cancelled',
  complete: 'completed',
};

export const updateAppointmentStatusByDoctor = async (appointmentId, doctorUserId, action, note) => {
  const toStatus = DOCTOR_ACTION_TO_STATUS[action];
  if (!toStatus) throw new ApiError(400, `Unknown action '${action}'`);

  const appointment = await loadDoctorOwnedAppointment(appointmentId, doctorUserId);
  assertTransitionAllowed('doctor', appointment.status, toStatus);

  appointment.status = toStatus;
  if (toStatus === 'cancelled' || toStatus === 'rejected') {
    appointment.cancellationReason = note || '';
  }
  appointment.lastUpdatedByRole = 'doctor';
  await appointment.save();
  return appointment;
};

// --- Admin-side ---

export const listAllAppointmentsAdmin = async ({ page = 1, limit = 20, status, doctorId, patientId, from, to }) => {
  const filter = {};
  if (status) filter.status = status;
  if (doctorId) filter.doctorId = doctorId;
  if (patientId) filter.patientId = patientId;
  if (from || to) {
    filter.slotDateTime = {};
    if (from) filter.slotDateTime.$gte = new Date(from);
    if (to) filter.slotDateTime.$lte = new Date(to);
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate({ path: 'patientId', select: 'fullName email phoneNumber' })
      .populate({ path: 'doctorId', select: 'specialization department' })
      .sort({ slotDateTime: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Appointment.countDocuments(filter),
  ]);

  return { appointments, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } };
};

export const getAppointmentForAdmin = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate({ path: 'patientId', select: 'fullName email phoneNumber' })
    .populate({ path: 'doctorId', select: 'specialization department' });
  if (!appointment) throw new ApiError(404, 'Appointment not found');
  return appointment;
};

// Admin can force any status per the confirmed business rule ("admin can override
// any appointment status at any time") — bypasses the transition table, but the
// target status must still be one of the valid enum values (enforced by the schema).
export const setAppointmentStatusByAdmin = async (appointmentId, status, note) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new ApiError(404, 'Appointment not found');

  appointment.status = status;
  if (status === 'cancelled' || status === 'rejected') {
    appointment.cancellationReason = note || '';
  }
  appointment.lastUpdatedByRole = 'admin';
  await appointment.save();
  return appointment;
};
