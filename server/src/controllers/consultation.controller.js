const consultationService = require("../services/consultation.service");

async function bookConsultation(req, res) {
  try {
    const { slot_id, reason } = req.body;

    const consultation = await consultationService.bookConsultation(
      req.user.id,
      slot_id,
      reason
    );

    return res.status(201).json({
      message: "Consultation booked successfully",
      consultation,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Consultation booking error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function getConsultations(req, res) {
  try {
    const consultations = await consultationService.getConsultations(
      req.user.id,
      req.user.role
    );

    return res.status(200).json({ consultations });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Get consultations error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


async function updateConsultationStatus(req, res) {
  try {
    const consultation =
      await consultationService.updateConsultationStatus(
        req.user.id,
        req.user.role,
        req.params.id,
        req.body.status
      );

    return res.status(200).json({
      message: "Consultation status updated successfully",
      consultation,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Consultation status update error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


module.exports = { bookConsultation, getConsultations, updateConsultationStatus };
