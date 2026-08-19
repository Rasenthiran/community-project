export const ENDPOINTS = {
  AUTH: { LOGIN: "/auth/login", REGISTER: "/auth/register" },
  USERS: { ME: "/users/me", CHANGE_PASSWORD: "/users/change-password" },
  DOCTORS: {
    LIST: "/doctors",
    BY_ID: (id) => `/doctors/${id}`,
    ME: "/doctors/me",
    STATUS: (id) => `/doctors/${id}/status`,
  },
  PATIENT_APPOINTMENTS: {
    CREATE: "/appointments",
    MY: "/appointments/my",
    BY_ID: (id) => `/appointments/${id}`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
  },
  DOCTOR_APPOINTMENTS: {
    LIST: "/doctor/appointments",
    BY_ID: (id) => `/doctor/appointments/${id}`,
    STATUS: (id) => `/doctor/appointments/${id}/status`,
  },
  ADMIN: {
    USERS: "/admin/users",
    USER_BY_ID: (id) => `/admin/users/${id}`,
    USER_RESET_PASSWORD: (id) => `/admin/users/${id}/reset-password`,
    USER_ACTIVATE: (id) => `/admin/users/${id}/activate`,
    USER_DEACTIVATE: (id) => `/admin/users/${id}/deactivate`,
    APPOINTMENTS: "/admin/appointments",
    APPOINTMENT_BY_ID: (id) => `/admin/appointments/${id}`,
    APPOINTMENT_STATUS: (id) => `/admin/appointments/${id}/status`,
  },
};
