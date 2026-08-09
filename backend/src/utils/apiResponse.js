// src/utils/apiResponse.js
// Small helpers to keep API responses consistent across all controllers.

export const successResponse = (res, statusCode, message, data = null, extra = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
    ...extra,
  });
};

export const errorResponse = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};
