const availabilityService = require("../services/availability.service");

async function createAvailability(req, res) {
  try {
    const { starts_at, ends_at } = req.body;

    const availability = await availabilityService.createAvailability(
      req.user.id,
      starts_at,
      ends_at
    );

    return res.status(201).json({
      message: "Availability created successfully",
      availability,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    console.error("Availability creation error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { createAvailability };
