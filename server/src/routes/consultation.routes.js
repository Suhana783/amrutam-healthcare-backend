
const express = require("express");
const consultationController = require("../controllers/consultation.controller");
const validate = require("../middleware/validation.middleware");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

const {
  bookConsultationSchema,
  updateConsultationStatusSchema,
} = require("../validations/consultation.validation");

const router = express.Router();

/**
 * @openapi
 * /consultations:
 *   post:
 *     summary: Book a consultation
 *     description: Allows an authenticated patient to book an available doctor slot.
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slot_id
 *             properties:
 *               slot_id:
 *                 type: integer
 *                 example: 1
 *               reason:
 *                 type: string
 *                 example: "Persistent headache"
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Only patients can book consultations
 *       404:
 *         description: Availability slot not found
 *       409:
 *         description: Slot is already booked or unavailable
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("patient"),
  validate(bookConsultationSchema),
  consultationController.bookConsultation
);

/**
 * @openapi
 * /consultations:
 *   get:
 *     summary: Get user consultations
 *     description: Returns consultations belonging to the authenticated patient or doctor.
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Consultations retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get(
  "/",
  authenticateToken,
  authorizeRoles("patient", "doctor"),
  consultationController.getConsultations
);

/**
 * @openapi
 * /consultations/{id}/status:
 *   patch:
 *     summary: Update consultation status
 *     description: Allows a doctor to complete a consultation or a patient to cancel an eligible consultation.
 *     tags:
 *       - Consultations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - completed
 *                   - cancelled
 *                 example: completed
 *     responses:
 *       200:
 *         description: Consultation status updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User is not authorized to perform this action
 *       409:
 *         description: Consultation cannot be updated in its current state
 */
router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("patient", "doctor"),
  validate(updateConsultationStatusSchema),
  consultationController.updateConsultationStatus
);

module.exports = router;
