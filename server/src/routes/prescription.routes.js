const express = require("express");
const prescriptionController = require("../controllers/prescription.controller");
const validate = require("../middleware/validation.middleware");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");
const {
  createPrescriptionSchema,
} = require("../validations/prescription.validation");

const router = express.Router();

/**
 * @openapi
 * /prescriptions:
 *   post:
 *     summary: Create a prescription
 *     description: Allows an authenticated doctor to create a prescription for a completed consultation assigned to them.
 *     tags:
 *       - Prescriptions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - consultation_id
 *               - medicines
 *             properties:
 *               consultation_id:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               doctor_notes:
 *                 type: string
 *                 maxLength: 5000
 *                 example: Patient should follow the prescribed treatment.
 *               medicines:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 50
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - dosage
 *                     - frequency
 *                     - duration
 *                   properties:
 *                     name:
 *                       type: string
 *                       maxLength: 200
 *                       example: Paracetamol
 *                     dosage:
 *                       type: string
 *                       maxLength: 100
 *                       example: 500mg
 *                     frequency:
 *                       type: string
 *                       maxLength: 100
 *                       example: Twice a day
 *                     duration:
 *                       type: string
 *                       maxLength: 100
 *                       example: 5 days
 *               instructions:
 *                 type: string
 *                 maxLength: 5000
 *                 example: Take medicine after meals.
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only the assigned doctor can create a prescription
 *       409:
 *         description: Consultation is not completed or prescription already exists
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("doctor"),
  validate(createPrescriptionSchema),
  prescriptionController.createPrescription
);

module.exports = router;
