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

router.post(
  "/",
  authenticateToken,
  authorizeRoles("doctor"),
  validate(createPrescriptionSchema),
  prescriptionController.createPrescription
);

module.exports = router;
