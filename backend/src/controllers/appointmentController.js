// src/controllers/appointmentController.js
// Patient-facing appointment endpoints — req/res only, delegates to appointmentService.
import * as appointmentService from '../services/appointmentService.js';
import { successResponse } from '../utils/apiResponse.js';

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment(req.user.userId, req.body);
    return successResponse(res, 201, 'Appointment booked successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { appointments, pagination } = await appointmentService.getMyAppointments(req.user.userId, {
      page,
      limit,
      status,
    });
    return successResponse(res, 200, 'Appointments fetched successfully', appointments, { pagination });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentForPatient(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Appointment fetched successfully', appointment);
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.cancelAppointmentByPatient(
      req.params.id,
      req.user.userId,
      req.body.cancellationReason
    );
    return successResponse(res, 200, 'Appointment cancelled successfully', appointment);
  } catch (error) {
    next(error);
  }
};
