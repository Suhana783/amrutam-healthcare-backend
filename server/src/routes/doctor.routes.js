const express = require("express");
const doctorController = require("../controllers/doctor.controller");
const validate = require("../middleware/validation.middleware");
const { authenticateToken, authorizeRoles } = require("../middleware/auth.middleware");
const { createDoctorSchema } = require("../validations/doctor.validation");
const { searchDoctorsSchema } = require("../validations/doctor.validation");
const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  validate(createDoctorSchema),
  doctorController.createDoctorProfile
);

router.get(
  "/",
  validate(searchDoctorsSchema, "query"),
  doctorController.searchDoctors
);

module.exports = router;