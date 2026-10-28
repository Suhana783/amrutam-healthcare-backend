const pool = require("../config/db");

async function createPrescription(
  doctorUserId,
  consultationId,
  doctorNotes,
  medicines,
  instructions
) {
  const result = await pool.query(
    `INSERT INTO prescriptions (
      consultation_id,
      doctor_notes,
      medicines,
      instructions
    )
    SELECT c.id, $3, $4::jsonb, $5
    FROM consultations c
    JOIN doctors d ON d.id = c.doctor_id
    WHERE c.id = $1
      AND d.user_id = $2
      AND c.status = 'completed'
    RETURNING id, consultation_id, doctor_notes,
              medicines, instructions, created_at`,
    [
      consultationId,
      doctorUserId,
      doctorNotes ?? null,
      JSON.stringify(medicines),
      instructions ?? null,
    ]
  );

  if (result.rowCount === 0) {
    const consultation = await pool.query(
      `SELECT c.status, d.user_id
       FROM consultations c
       JOIN doctors d ON d.id = c.doctor_id
       WHERE c.id = $1`,
      [consultationId]
    );

    if (consultation.rowCount === 0) {
      const error = new Error("Consultation not found");
      error.statusCode = 404;
      throw error;
    }

    if (consultation.rows[0].user_id !== String(doctorUserId)) {
      const error = new Error("You cannot prescribe for this consultation");
      error.statusCode = 403;
      throw error;
    }

    if (consultation.rows[0].status !== "completed") {
      const error = new Error("Consultation must be completed before prescribing");
      error.statusCode = 409;
      throw error;
    }

    const error = new Error("A prescription already exists for this consultation");
    error.statusCode = 409;
    throw error;
  }

  return result.rows[0];
}

module.exports = { createPrescription };