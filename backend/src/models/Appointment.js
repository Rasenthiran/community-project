// src/models/Appointment.js
// Mongoose schema + the concurrency-safe indexes that guarantee no double-booking.
// See services/appointmentService.js for the full explanation of the strategy.
import mongoose from 'mongoose';

const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'];

// Statuses that "hold" a slot / hold a patient's time. Only these participate
// in the uniqueness constraints below. A cancelled or rejected appointment
// must NOT block someone else from booking that same slot.
export const ACTIVE_STATUSES = ['pending', 'confirmed'];

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    // Calendar date the appointment falls on, in system timezone (Asia/Colombo),
    // stored as a UTC midnight Date purely for date-range querying/filtering.
    appointmentDate: {
      type: Date,
      required: true,
    },
    // Wall-clock start time in system timezone, 'HH:mm' 24h. Human-readable,
    // used for display and for re-deriving slotDateTime.
    appointmentStartTime: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
        message: 'appointmentStartTime must be in HH:mm 24h format',
      },
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
    },
    // The single source of truth for conflict detection and past/future checks:
    // the exact UTC instant the appointment starts. Derived from
    // appointmentDate + appointmentStartTime + the fixed Asia/Colombo offset
    // (see utils/timeSlots.js). Everything in Section 8 conflict logic keys off
    // this field, not off the human-readable date/time strings.
    slotDateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: 'pending',
    },
    reason: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    cancellationReason: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500,
    },
    // Who last changed the status — useful for audit/debugging, not authorization.
    lastUpdatedByRole: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: null,
    },
  },
  { timestamps: true }
);

// --- CONFLICT A: same doctor, same slot, two active appointments ---
// A partial unique index: only documents whose status is pending/confirmed
// participate. This means:
//   - The DB itself rejects a second active booking for {doctorId, slotDateTime}
//     no matter how many requests arrive concurrently — the insert is atomic,
//     there is no read-then-write gap.
//   - A cancelled/rejected/completed appointment at that same slot does NOT
//     count against the index, so the slot becomes bookable again once the
//     conflicting appointment leaves the active set.
appointmentSchema.index(
  { doctorId: 1, slotDateTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ACTIVE_STATUSES } },
    name: 'uniq_active_doctor_slot',
  }
);

// --- CONFLICT B: same patient, same slot, booked against two different doctors ---
// Same mechanism, keyed on patientId instead of doctorId.
appointmentSchema.index(
  { patientId: 1, slotDateTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ACTIVE_STATUSES } },
    name: 'uniq_active_patient_slot',
  }
);

// Query-pattern indexes (list "my appointments", list "doctor's appointments", admin filters)
appointmentSchema.index({ patientId: 1, slotDateTime: -1 });
appointmentSchema.index({ doctorId: 1, slotDateTime: -1 });
appointmentSchema.index({ status: 1 });

export { APPOINTMENT_STATUSES };

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
