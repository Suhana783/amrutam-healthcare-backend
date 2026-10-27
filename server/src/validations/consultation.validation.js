const { z } = require("zod");

const bookConsultationSchema = z.strictObject({
  slot_id: z.coerce.number().int().positive(),
  reason: z.string().trim().max(1000).optional(),
});

module.exports = { bookConsultationSchema };
