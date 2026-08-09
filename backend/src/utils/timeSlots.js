// src/utils/timeSlots.js
// System timezone is Asia/Colombo (UTC+05:30, fixed — Sri Lanka observes no DST),
// so we don't need a timezone library: a constant offset is correct and exact.
const COLOMBO_OFFSET_MINUTES = 5 * 60 + 30; // +05:30

/**
 * Combine a calendar date ('YYYY-MM-DD') and wall-clock time ('HH:mm', Asia/Colombo)
 * into the exact UTC instant they represent. This is the single source of truth
 * used for conflict indexes, past-appointment checks, and sorting.
 */
export const toUtcSlotDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);

  // Build as if it were UTC, then subtract the Colombo offset to get the true UTC instant.
  const asIfUtc = Date.UTC(year, month - 1, day, hour, minute, 0, 0);
  return new Date(asIfUtc - COLOMBO_OFFSET_MINUTES * 60 * 1000);
};

/** Midnight UTC for the given calendar date — used only for date-range filtering, never for conflict comparison. */
export const dateOnlyUtc = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

/** Day-of-week name (in Asia/Colombo) for a 'YYYY-MM-DD' date string, matching Doctor.availableDays values. */
export const dayOfWeekName = (dateStr) => {
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [year, month, day] = dateStr.split('-').map(Number);
  // Noon UTC avoids any edge-of-day ambiguity when reading back the UTC day-of-week.
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return DAYS[d.getUTCDay()];
};

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

/** True if [startTime, startTime+durationMinutes) fits entirely within [windowStart, windowEnd). */
export const isWithinWindow = (startTime, durationMinutes, windowStart, windowEnd) => {
  const start = timeToMinutes(startTime);
  const end = start + durationMinutes;
  return start >= timeToMinutes(windowStart) && end <= timeToMinutes(windowEnd);
};

/** True if startTime aligns to a slot boundary from windowStart (e.g. 09:00, 09:30, 10:00 for a 30-min grid). */
export const isAlignedToSlotGrid = (startTime, windowStart, slotDurationMinutes) => {
  const diff = timeToMinutes(startTime) - timeToMinutes(windowStart);
  return diff >= 0 && diff % slotDurationMinutes === 0;
};

export const DATE_STR_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_STR_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
