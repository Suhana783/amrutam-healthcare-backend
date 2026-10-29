const express = require("express");
const consultationController = require("../controllers/consultation.controller");
const validate = require("../middleware/validation.middleware");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

const {
  bookConsultationSchema,
} = require("../validations/consultation.validation");

const {
  updateConsultationStatusSchema,
} = require("../validations/consultation.validation");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("patient"),
  validate(bookConsultationSchema),
  consultationController.bookConsultation
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("patient", "doctor"),
  consultationController.getConsultations
);

router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("patient", "doctor"),
  validate(updateConsultationStatusSchema),
  consultationController.updateConsultationStatus
);

module.exports = router;