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

router.post(
  "/",
  authenticateToken,
  authorizeRoles("doctor"),
  validate(createAvailabilitySchema),
  availabilityController.createAvailability
);

module.exports = router;
