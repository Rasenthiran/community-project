import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  fullName: z.string().min(3).max(100).regex(/^[A-Za-z\s]+$/, "Letters and spaces only"),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^\d{10,15}$/, "Use 10-15 digits"),
  gender: z.enum(["male","female","other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationalId: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  password: z.string().min(8).regex(/[A-Z]/,"Add an uppercase letter").regex(/[a-z]/,"Add a lowercase letter").regex(/\d/,"Add a number").regex(/[^A-Za-z0-9]/,"Add a special character"),
  confirmPassword: z.string(),
}).refine(v=>v.password===v.confirmPassword,{ path:["confirmPassword"], message:"Passwords do not match" });

export const profileSchema = z.object({
  fullName: z.string().min(3),
  phoneNumber: z.string().regex(/^\d{10,15}$/),
  address: z.string().min(1),
  city: z.string().min(1),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/).regex(/[^A-Za-z0-9]/),
  confirmPassword: z.string(),
}).refine(v=>v.newPassword===v.confirmPassword,{ path:["confirmPassword"], message:"Passwords do not match" });

export const appointmentSchema = z.object({
  appointmentDate: z.string().min(1, "Choose a date"),
  appointmentStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use HH:mm"),
  reason: z.string().max(500).optional(),
});
