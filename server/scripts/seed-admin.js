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

  if (ADMIN_PASSWORD.length < 12) {
    throw new Error("Admin password must be at least 12 characters long");
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const result = await pool.query(
    `INSERT INTO users (
       full_name, email, password_hash, role, is_active
     )
     VALUES ($1, $2, $3, 'admin', TRUE)
     ON CONFLICT (email)
     DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       role = 'admin',
       is_active = TRUE,
       updated_at = NOW()
     RETURNING id, full_name, email, role, is_active`,
    [ADMIN_NAME.trim(), email, passwordHash]
  );

  console.log("Admin account ready:", result.rows[0]);
}

seedAdmin()
  .catch((error) => {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
