const prescriptionService = require("../services/prescription.service");

async function createPrescription(req, res) {
  try {
    const { consultation_id, doctor_notes, medicines, instructions } = req.body;

    const prescription = await prescriptionService.createPrescription(
      req.user.id,
      consultation_id,
      doctor_notes,
      medicines,
      instructions
    );

    return res.status(201).json({
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Prescription creation error:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { createPrescription };