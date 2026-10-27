const express = require("express");
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validation.middleware");
const {
  authenticateToken,
} = require("../middleware/auth.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);


module.exports = router;
