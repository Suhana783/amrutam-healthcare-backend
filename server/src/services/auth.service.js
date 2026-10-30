const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function registerUser({ full_name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, role)
     VALUES ($1, $2, $3, 'patient')
     RETURNING id, full_name, email, role, created_at`,
    [full_name.trim(), email.trim().toLowerCase(), passwordHash]
  );

  return result.rows[0];
}

async function loginUser({ email, password }) {
  const result = await pool.query(
    `SELECT id, full_name, email, password_hash, role, is_active
     FROM users
     WHERE email = $1`,
    [email.trim().toLowerCase()]
  );

  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.is_active) {
    const error = new Error("Account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { registerUser, loginUser };
