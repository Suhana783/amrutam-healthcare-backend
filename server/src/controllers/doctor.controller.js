const doctorService = require("../services/doctor.service");

async function createDoctorAccount(req, res) {
  try {
    const result = await doctorService.createDoctorAccount(req.body);

    return res.status(201).json({
      message: "Doctor account and profile created successfully",
      ...result,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Doctor account creation error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function searchDoctors(req, res) {
  try {
    const doctors = await doctorService.searchDoctors(
      req.validatedQuery || req.query
    );

    return res.status(200).json({ doctors });
  } catch (error) {
    console.error("Doctor search error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { createDoctorAccount, searchDoctors };
