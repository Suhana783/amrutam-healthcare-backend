const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function createDoctorAccount({
  full_name,
  email,
  password,
  phone,
  specialization,
  qualification,
  experience_years,
  consultation_fee,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash(password, 12);

    const userResult = await client.query(
      `INSERT INTO users (
        full_name, email, phone, password_hash, role, is_active
      )
      VALUES ($1, $2, $3, $4, 'doctor', TRUE)
      RETURNING id, full_name, email, phone, role, created_at`,
      [
        full_name.trim(),
        email.trim().toLowerCase(),
        phone?.trim() || null,
        passwordHash,
      ]
    );

    const user = userResult.rows[0];

    const doctorResult = await client.query(
      `INSERT INTO doctors (
        user_id, specialization, qualification,
        experience_years, consultation_fee
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, specialization, qualification,
                experience_years, consultation_fee, created_at`,
      [
        user.id,
        specialization.trim(),
        qualification?.trim() || null,
        experience_years ?? 0,
        consultation_fee ?? 0,
      ]
    );

    await client.query("COMMIT");

    return {
      user,
      doctor: doctorResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      const conflict = new Error("Email or phone number already exists");
      conflict.statusCode = 409;
      throw conflict;
    }

    throw error;
  } finally {
    client.release();
  }
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

  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;
  const pageSize =
    Number.isInteger(limit) && limit > 0 && limit <= 50 ? limit : 10;
  const offset = (currentPage - 1) * pageSize;

  values.push(pageSize);
  const limitPlaceholder = `$${values.length}`;

  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query(
    `SELECT d.id, u.full_name, d.specialization, d.qualification,
            d.experience_years, d.consultation_fee
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

module.exports = { createDoctorAccount, searchDoctors };
