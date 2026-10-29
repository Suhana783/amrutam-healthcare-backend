const { z } = require("zod");

const createDoctorSchema = z.strictObject({
  full_name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(20).optional(),
  password: z.string().min(12).max(128),
  specialization: z.string().trim().min(2).max(150),
  qualification: z.string().trim().max(500).optional(),
  experience_years: z.coerce.number().int().min(0).max(80).optional(),
  consultation_fee: z.coerce.number().min(0).max(1000000).optional(),
});

const searchDoctorsSchema = z.strictObject({
  specialization: z.string().trim().min(1).max(150).optional(),
  min_experience: z.coerce.number().int().min(0).optional(),
  max_fee: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

module.exports = { createDoctorSchema, searchDoctorsSchema };
