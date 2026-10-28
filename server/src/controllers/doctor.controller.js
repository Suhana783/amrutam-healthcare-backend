const doctorService = require("../services/doctor.service");

async function createDoctorProfile(req, res) {
  try {
    const doctor = await doctorService.createDoctorProfile({
      userId: req.body.user_id,
      specialization: req.body.specialization,
      qualification: req.body.qualification,
      experience_years: req.body.experience_years,
      consultation_fee: req.body.consultation_fee,
    });

    return res.status(201).json({
      message: "Doctor profile created successfully",
      doctor,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Doctor profile creation error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function searchDoctors(req, res) {
  try {
    const doctors = await doctorService.searchDoctors(req.query);

    return res.status(200).json({
      doctors,
    });
  } catch (error) {
    console.error("Doctor search error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { createDoctorProfile, searchDoctors };