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

async function searchDoctors({
  specialization,
  min_experience,
  max_fee,
  page = 1,
  limit = 10,
}) {
  const conditions = ["u.is_active = TRUE"];
  const values = [];

  if (specialization) {
    values.push(`%${specialization}%`);
    conditions.push(`d.specialization ILIKE $${values.length}`);
  }

  if (min_experience !== undefined) {
    values.push(min_experience);
    conditions.push(`d.experience_years >= $${values.length}`);
  }

  if (max_fee !== undefined) {
    values.push(max_fee);
    conditions.push(`d.consultation_fee <= $${values.length}`);
  }

  const currentPage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const pageSize =
    Number.isInteger(limit) && limit > 0 && limit <= 50
      ? limit
      : 10;

  const offset = (currentPage - 1) * pageSize;

  values.push(pageSize);
  const limitPlaceholder = `$${values.length}`;

  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `SELECT
       d.id,
       u.full_name,
       d.specialization,
       d.qualification,
       d.experience_years,
       d.consultation_fee
     FROM doctors d
     JOIN users u ON u.id = d.user_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY d.experience_years DESC, d.id
     LIMIT ${limitPlaceholder}
     OFFSET ${offsetPlaceholder}`,
    values
  );

  return result.rows;
}

module.exports = { createDoctorProfile, searchDoctors };
