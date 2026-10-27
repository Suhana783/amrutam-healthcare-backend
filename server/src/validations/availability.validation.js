const { z } = require("zod");

const createAvailabilitySchema = z
  .strictObject({
    starts_at: z.iso.datetime().refine(
      (value) => new Date(value) > new Date(),
      "Start time must be in the future"
    ),
    ends_at: z.iso.datetime(),
  })
  .refine(
    (data) => new Date(data.ends_at) > new Date(data.starts_at),
    {
      message: "End time must be after start time",
      path: ["ends_at"],
    }
  );

module.exports = { createAvailabilitySchema };