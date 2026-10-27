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

module.exports = { createAvailabilitySchema };