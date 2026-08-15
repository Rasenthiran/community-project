// src/seeders/adminSeeder.js
// Creates the first admin account from environment variables. This is the ONLY
// way an admin account should ever come into existence — there is no public or
// authenticated endpoint that can create/promote to role: 'admin'.
//
// Safe to run multiple times: it checks for an existing admin (by email) first
// and exits without changes if one is already there.
//
// Usage: node src/seeders/adminSeeder.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { hashPassword } from '../utils/hashPassword.js';

const run = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_PHONE) {
    console.error(
      'Missing one or more required env vars: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE'
    );
    process.exitCode = 1;
    return;
  }

  await connectDB();

  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existing) {
      console.log(`Admin with email ${ADMIN_EMAIL} already exists — skipping (safe to re-run).`);
      return;
    }

    const hashedPassword = await hashPassword(ADMIN_PASSWORD);

    await User.create({
      fullName: ADMIN_NAME,
      email: ADMIN_EMAIL,
      phoneNumber: ADMIN_PHONE,
      gender: 'other',
      dateOfBirth: new Date('1990-01-01'),
      address: 'N/A',
      city: 'N/A',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    console.log(`Admin account created for ${ADMIN_EMAIL}.`);
  } finally {
    await mongoose.connection.close();
  }
};

run().catch((err) => {
  console.error('Admin seeder failed:', err);
  process.exitCode = 1;
});
