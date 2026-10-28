const { z } = require("zod");

const createAvailabilitySchema = z
  .object({
    starts_at: z.string().datetime({ offset: true }),
    ends_at: z.string().datetime({ offset: true }),
  })
  .refine(
    (data) => new Date(data.ends_at) > new Date(data.starts_at),
    {
      message: "End time must be later than start time",
      path: ["ends_at"],
    }
  );

const searchDoctorsSchema = z.strictObject({
  specialization: z.string().trim().min(1).max(150).optional(),
  min_experience: z.coerce.number().int().min(0).optional(),
  max_fee: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

module.exports = { createAvailabilitySchema, searchDoctorsSchema };