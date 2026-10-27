const pool = require("../config/db");

async function bookConsultation(patientId, slotId, reason) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const slotResult = await client.query(
      `SELECT id, doctor_id, starts_at, ends_at, is_booked
       FROM availability_slots
       WHERE id = $1
       FOR UPDATE`,
      [slotId]
    );

    if (slotResult.rowCount === 0) {
      const error = new Error("Availability slot not found");
      error.statusCode = 404;
      throw error;
    }

    const slot = slotResult.rows[0];

    if (slot.is_booked || new Date(slot.starts_at) <= new Date()) {
      const error = new Error("Availability slot is no longer available");
      error.statusCode = 409;
      throw error;
    }

    const patientResult = await client.query(
      `SELECT id
       FROM users
       WHERE id = $1
         AND role = 'patient'
         AND is_active = TRUE`,
      [patientId]
    );

    if (patientResult.rowCount === 0) {
      const error = new Error("Active patient account not found");
      error.statusCode = 403;
      throw error;
    }

    const consultationResult = await client.query(
      `INSERT INTO consultations (
        patient_id,
        doctor_id,
        slot_id,
        scheduled_at,
        reason
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, patient_id, doctor_id, slot_id,
                scheduled_at, status, reason, created_at`,
      [patientId, slot.doctor_id, slot.id, slot.starts_at, reason ?? null]
    );

    await client.query(
      `UPDATE availability_slots
       SET is_booked = TRUE
       WHERE id = $1`,
      [slot.id]
    );

    await client.query("COMMIT");

    return consultationResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}


async function getConsultations(userId, role) {
  let query;
  let values;

  if (role === "patient") {
    query = `
      SELECT id, patient_id, doctor_id, slot_id,
             scheduled_at, status, reason, created_at
      FROM consultations
      WHERE patient_id = $1
      ORDER BY scheduled_at DESC
    `;
    values = [userId];
  } else if (role === "doctor") {
    query = `
      SELECT c.id, c.patient_id, c.doctor_id, c.slot_id,
             c.scheduled_at, c.status, c.reason, c.created_at
      FROM consultations c
      JOIN doctors d ON d.id = c.doctor_id
      WHERE d.user_id = $1
      ORDER BY c.scheduled_at DESC
    `;
    values = [userId];
  } else {
    const error = new Error("Unsupported role");
    error.statusCode = 403;
    throw error;
  }

  const result = await pool.query(query, values);
  return result.rows;
}

module.exports = { bookConsultation, getConsultations };
