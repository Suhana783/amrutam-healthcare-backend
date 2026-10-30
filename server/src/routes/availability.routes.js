const express = require("express");
const availabilityController = require("../controllers/availability.controller");
const validate = require("../middleware/validation.middleware");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");
const {
  createAvailabilitySchema,
} = require("../validations/availability.validation");

const router = express.Router();

/**
 * @openapi
 * /availability:
 *   post:
 *     summary: Create doctor availability
 *     description: Allows an authenticated doctor to create an availability slot.
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - starts_at
 *               - ends_at
 *             properties:
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-05T10:00:00.000Z"
 *               ends_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-05T10:30:00.000Z"
 *     responses:
 *       201:
 *         description: Availability slot created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only doctors can create availability
 *       409:
 *         description: Availability slot overlaps with an existing slot
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("doctor"),
  validate(createAvailabilitySchema),
  availabilityController.createAvailability
);

module.exports = router;
