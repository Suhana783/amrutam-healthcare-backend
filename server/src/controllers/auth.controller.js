const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    const user = await authService.registerUser(req.body);

    return res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Email or phone number is already registered",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function login(req, res) {
  try {
    const result = await authService.loginUser(req.body);

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { register, login };
