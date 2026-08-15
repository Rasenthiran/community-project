// src/controllers/doctorAppointmentController.js
// Doctor-facing appointment endpoints — req/res only, delegates to appointmentService.
import * as appointmentService from '../services/appointmentService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getMyDoctorAppointments = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { appointments, pagination } = await appointmentService.listDoctorAppointments(req.user.userId, {
      page,
      limit,
      status,
    });
    return successResponse(res, 200, 'Appointments fetched successfully', appointments, { pagination });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentForDoctor(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Appointment fetched successfully', appointment);
  } catch (error) {
    next(error);
  }
};

// body: { action: 'confirm' | 'reject' | 'cancel' | 'complete', note? }
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { action, note } = req.body;
    const appointment = await appointmentService.updateAppointmentStatusByDoctor(
      req.params.id,
      req.user.userId,
      action,
      note
    );
    return successResponse(res, 200, 'Appointment status updated successfully', appointment);
  } catch (error) {
    next(error);
  }
};
