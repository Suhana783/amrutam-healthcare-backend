const pool = require("../config/db");

async function createDoctorProfile({
  userId,
  specialization,
  qualification,
  experience_years,
  consultation_fee,
}) {
  const result = await pool.query(
    `INSERT INTO doctors (
      user_id,
      specialization,
      qualification,
      experience_years,
      consultation_fee
    )
    SELECT id, $2, $3, $4, $5
    FROM users
    WHERE id = $1
      AND role = 'doctor'
      AND is_active = TRUE
    RETURNING id, user_id, specialization,
              qualification, experience_years,
              consultation_fee, created_at`,
    [
      userId,
      specialization,
      qualification ?? null,
      experience_years ?? 0,
      consultation_fee ?? 0,
    ]
  );

  if (result.rowCount === 0) {
    const existing = await pool.query(
      "SELECT id FROM doctors WHERE user_id = $1",
      [userId]
    );

    if (existing.rowCount > 0) {
      const error = new Error("Doctor profile already exists");
      error.statusCode = 409;
      throw error;
    }

    const error = new Error("Active doctor account not found");
    error.statusCode = 403;
    throw error;
  }

  return result.rows[0];
}

module.exports = { createDoctorProfile };
