// src/middleware/validateRequest.js
// Runs after express-validator chains; collects errors into a consistent shape.
import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
