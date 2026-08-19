import api from "../api/axiosInstance";
import { ENDPOINTS } from "../api/endpoints";
import { mapAppointment, mapDoctor, mapUser } from "../mappers";

const listResult = (response, mapper) => ({
  items: (response.data?.data || []).map(mapper),
  pagination: response.data?.pagination || null,
});

export const authService = {
  login: async (payload) => {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    return {
      token: data.token || "",
      user: {
        id: data.user?.id || "",
        fullName: data.user?.fullName || "",
        email: data.user?.email || "",
        role: data.user?.role || "",
      },
    };
  },
  register: async (payload) => (await api.post(ENDPOINTS.AUTH.REGISTER, payload)).data?.data,
};

export const userService = {
  me: async () => mapUser((await api.get(ENDPOINTS.USERS.ME)).data?.data),
  update: async (payload) => mapUser((await api.put(ENDPOINTS.USERS.ME, payload)).data?.data),
  changePassword: async (payload) => (await api.put(ENDPOINTS.USERS.CHANGE_PASSWORD, payload)).data,
};

export const doctorService = {
  list: async (params = {}) => listResult(await api.get(ENDPOINTS.DOCTORS.LIST, { params }), mapDoctor),
  get: async (id) => mapDoctor((await api.get(ENDPOINTS.DOCTORS.BY_ID(id))).data?.data),
  me: async () => mapDoctor((await api.get(ENDPOINTS.DOCTORS.ME)).data?.data),
  updateMe: async (payload) => mapDoctor((await api.put(ENDPOINTS.DOCTORS.ME, payload)).data?.data),
  create: async (payload) => mapDoctor((await api.post(ENDPOINTS.DOCTORS.LIST, payload)).data?.data),
  update: async (id, payload) => mapDoctor((await api.put(ENDPOINTS.DOCTORS.BY_ID(id), payload)).data?.data),
  setStatus: async (id, isActive) => mapDoctor((await api.put(ENDPOINTS.DOCTORS.STATUS(id), { isActive })).data?.data),
  remove: async (id) => (await api.delete(ENDPOINTS.DOCTORS.BY_ID(id))).data,
};

export const patientAppointmentService = {
  list: async (params={}) => listResult(await api.get(ENDPOINTS.PATIENT_APPOINTMENTS.MY, { params }), mapAppointment),
  get: async (id) => mapAppointment((await api.get(ENDPOINTS.PATIENT_APPOINTMENTS.BY_ID(id))).data?.data),
  create: async (payload) => mapAppointment((await api.post(ENDPOINTS.PATIENT_APPOINTMENTS.CREATE, payload)).data?.data),
  cancel: async (id, cancellationReason="") => mapAppointment((await api.put(ENDPOINTS.PATIENT_APPOINTMENTS.CANCEL(id), { cancellationReason })).data?.data),
};

export const doctorAppointmentService = {
  list: async (params={}) => listResult(await api.get(ENDPOINTS.DOCTOR_APPOINTMENTS.LIST, { params }), mapAppointment),
  get: async (id) => mapAppointment((await api.get(ENDPOINTS.DOCTOR_APPOINTMENTS.BY_ID(id))).data?.data),
  action: async (id, action, note="") => mapAppointment((await api.put(ENDPOINTS.DOCTOR_APPOINTMENTS.STATUS(id), { action, note })).data?.data),
};

export const adminService = {
  users: async (params={}) => listResult(await api.get(ENDPOINTS.ADMIN.USERS, { params }), mapUser),
  user: async (id) => mapUser((await api.get(ENDPOINTS.ADMIN.USER_BY_ID(id))).data?.data),
  updateUser: async (id, payload) => mapUser((await api.put(ENDPOINTS.ADMIN.USER_BY_ID(id), payload)).data?.data),
  activate: async (id) => mapUser((await api.put(ENDPOINTS.ADMIN.USER_ACTIVATE(id))).data?.data),
  deactivate: async (id) => mapUser((await api.put(ENDPOINTS.ADMIN.USER_DEACTIVATE(id))).data?.data),
  resetPassword: async (id, newPassword) => (await api.put(ENDPOINTS.ADMIN.USER_RESET_PASSWORD(id), { newPassword })).data,
  appointments: async (params={}) => listResult(await api.get(ENDPOINTS.ADMIN.APPOINTMENTS, { params }), mapAppointment),
  appointment: async (id) => mapAppointment((await api.get(ENDPOINTS.ADMIN.APPOINTMENT_BY_ID(id))).data?.data),
  setAppointmentStatus: async (id, status, note="") => mapAppointment((await api.put(ENDPOINTS.ADMIN.APPOINTMENT_STATUS(id), { status, note })).data?.data),
};
