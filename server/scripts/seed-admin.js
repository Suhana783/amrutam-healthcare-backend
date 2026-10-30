require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../src/config/db");

async function seedAdmin() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME?.trim() || !ADMIN_EMAIL?.trim() || !ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in server/.env"
    );
  }

  if (ADMIN_PASSWORD.length < 12 || Buffer.byteLength(ADMIN_PASSWORD) > 72) {
    throw new Error("Admin password must be between 12 and 72 bytes");
  }

  const name = ADMIN_NAME.trim();
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const result = await pool.query(
    `INSERT INTO users (
       full_name, email, password_hash, role, is_active
     )
     VALUES ($1, $2, $3, 'admin', TRUE)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, full_name, email, role, is_active`,
    [name, email, passwordHash]
  );

  if (result.rowCount === 0) {
    const existing = await pool.query(
      `SELECT id, full_name, email, role, is_active
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (existing.rows[0]?.role !== "admin") {
      throw new Error(
        "This email already belongs to a non-admin account. Use a different email."
      );
    }

    console.log("Admin account already exists:", existing.rows[0]);
    return;
  }

  console.log("Admin account created:", result.rows[0]);
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
