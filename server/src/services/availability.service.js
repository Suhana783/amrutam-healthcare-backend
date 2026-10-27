const pool = require("../config/db");

async function createAvailability(userId, startsAt, endsAt) {
  const startTime = new Date(startsAt);
  const endTime = new Date(endsAt);

  if (
    Number.isNaN(startTime.getTime()) ||
    Number.isNaN(endTime.getTime()) ||
    startTime <= new Date() ||
    endTime <= startTime
  ) {
    const error = new Error(
      "Provide valid future start and end times"
    );
    error.statusCode = 400;
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const doctorResult = await client.query(
      `SELECT id
       FROM doctors
       WHERE user_id = $1
       FOR UPDATE`,
      [userId]
    );

    if (doctorResult.rowCount === 0) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      throw error;
    }

    const doctorId = doctorResult.rows[0].id;

    const conflict = await client.query(
      `SELECT id
       FROM availability_slots
       WHERE doctor_id = $1
         AND starts_at < $3
         AND ends_at > $2
       LIMIT 1`,
      [doctorId, startTime, endTime]
    );

    if (conflict.rowCount > 0) {
      const error = new Error(
        "This time overlaps an existing availability slot"
      );
      error.statusCode = 409;
      throw error;
    }

    const result = await client.query(
      `INSERT INTO availability_slots (
        doctor_id,
        starts_at,
        ends_at
      )
      VALUES ($1, $2, $3)
      RETURNING id, doctor_id, starts_at, ends_at, is_booked`,
      [doctorId, startTime, endTime]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { createAvailability };