// src/controllers/doctorController.js
// Public + admin doctor endpoints.
import * as doctorService from '../services/doctorService.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAllDoctors = async (req, res, next) => {
  try {
    const { page, limit, search, specialization, department } = req.query;
    const { doctors, pagination } = await doctorService.listDoctors({
      page,
      limit,
      search,
      specialization,
      department,
    });
    return successResponse(res, 200, 'Doctors fetched successfully', doctors, { pagination });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    return successResponse(res, 200, 'Doctor fetched successfully', doctor);
  } catch (error) {
    next(error);
  }
};

export const createDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctor(req.body);
    return successResponse(res, 201, 'Doctor added successfully', doctor);
  } catch (error) {
    next(error);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateDoctor(req.params.id, req.body);
    return successResponse(res, 200, 'Doctor updated successfully', doctor);
  } catch (error) {
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    await doctorService.deleteDoctor(req.params.id);
    return successResponse(res, 200, 'Doctor deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const setDoctorStatus = async (req, res, next) => {
  try {
    const doctor = await doctorService.setDoctorStatus(req.params.id, req.body.isActive);
    return successResponse(res, 200, 'Doctor status updated successfully', doctor);
  } catch (error) {
    next(error);
  }
};
