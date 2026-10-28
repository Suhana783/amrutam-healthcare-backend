const { z } = require("zod");

const createPrescriptionSchema = z.strictObject({
  consultation_id: z.coerce.number().int().positive(),
  doctor_notes: z.string().trim().max(5000).optional(),
  medicines: z
    .array(
      z.strictObject({
        name: z.string().trim().min(1).max(200),
        dosage: z.string().trim().min(1).max(100),
        frequency: z.string().trim().min(1).max(100),
        duration: z.string().trim().min(1).max(100),
      })
    )
    .min(1)
    .max(50),
  instructions: z.string().trim().max(5000).optional(),
});

module.exports = { createPrescriptionSchema };
