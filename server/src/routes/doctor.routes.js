const express = require("express");
const doctorController = require("../controllers/doctor.controller");
const validate = require("../middleware/validation.middleware");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

const {
  createDoctorSchema,
  searchDoctorsSchema,
} = require("../validations/doctor.validation");

const router = express.Router();

/**
 * @openapi
 * /doctors:
 *   post:
 *     summary: Create a doctor account
 *     description: Allows an administrator to create a doctor account and its professional profile.
 *     tags:
 *       - Doctors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *               - specialization
 *             properties:
 *               full_name:
 *                 type: string
 *                 maxLength: 150
 *                 example: Dr. Rahul Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 example: rahul@example.com
 *               phone:
 *                 type: string
 *                 minLength: 7
 *                 maxLength: 20
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 12
 *                 maxLength: 128
 *                 example: SecureDoctor123
 *               specialization:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: General Physician
 *               qualification:
 *                 type: string
 *                 maxLength: 500
 *                 example: MBBS
 *               experience_years:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 80
 *                 default: 0
 *                 example: 5
 *               consultation_fee:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1000000
 *                 default: 0
 *                 example: 500
 *     responses:
 *       201:
 *         description: Doctor account and profile created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Email or phone number already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  validate(createDoctorSchema),
  doctorController.createDoctorAccount
);

/**
 * @openapi
 * /doctors:
 *   get:
 *     summary: Search doctors
 *     description: Search active doctors using specialization, experience and consultation fee filters.
 *     tags:
 *       - Doctors
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 150
 *         example: General Physician
 *       - in: query
 *         name: min_experience
 *         schema:
 *           type: integer
 *           minimum: 0
 *         example: 3
 *       - in: query
 *         name: max_fee
 *         schema:
 *           type: number
 *           minimum: 0
 *         example: 500
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 *       400:
 *         description: Invalid search parameters
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  validate(searchDoctorsSchema, "query"),
  doctorController.searchDoctors
);

module.exports = router;
