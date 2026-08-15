// src/controllers/adminAppointmentController.js
// Admin-facing appointment management — req/res only, delegates to appointmentService.
import * as appointmentService from '../services/appointmentService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAllAppointments = async (req, res, next) => {
  try {
    const { page, limit, status, doctorId, patientId, from, to } = req.query;
    const { appointments, pagination } = await appointmentService.listAllAppointmentsAdmin({
      page,
      limit,
      status,
      doctorId,
      patientId,
      from,
      to,
    });
    return successResponse(res, 200, 'Appointments fetched successfully', appointments, { pagination });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentForAdmin(req.params.id);
    return successResponse(res, 200, 'Appointment fetched successfully', appointment);
  } catch (error) {
    next(error);
  }
};

// body: { status, note? } — admin can force any valid status per the confirmed override rule.
export const setAppointmentStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const appointment = await appointmentService.setAppointmentStatusByAdmin(req.params.id, status, note);
    return successResponse(res, 200, 'Appointment status updated successfully', appointment);
  } catch (error) {
    next(error);
  }
};
