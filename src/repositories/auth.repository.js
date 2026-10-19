const pool = require('../config/db');

const register = async (user) => {
  const query = `
    INSERT INTO users
    (
      full_name,
      email,
      password,
      phone
    )
    VALUES
    (
      $1, $2, $3, $4
    )
    RETURNING
      id,
      full_name,
      email,
      phone,
      role,
      created_at;
  `;

  const values = [
    user.full_name,
    user.email,
    user.password,
    user.phone,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const findUserByEmailOrPhone = async (login) => {
  const query = `
    SELECT
      id,
      full_name,
      email,
      phone,
      password,
      role
    FROM users
    WHERE email = $1 OR phone = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [login]);

  return result.rows[0];
};

const findOrCreateGoogleUser = async ({ googleId, email, fullName }) => {
  const existingResult = await pool.query(
    'SELECT id, full_name, email, phone, role FROM users WHERE google_id = $1 LIMIT 1',
    [googleId],
  );
  if (existingResult.rows[0]) {
    return existingResult.rows[0];
  }

  const emailResult = await pool.query(
    'SELECT id, google_id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
    [email],
  );
  const existingEmail = emailResult.rows[0];
  if (existingEmail) {
    if (existingEmail.google_id && existingEmail.google_id !== googleId) {
      return null;
    }
    const linkedResult = await pool.query(
      'UPDATE users SET google_id = $1, updated_at = CURRENT_TIMESTAMP ' +
        'WHERE id = $2 AND (google_id IS NULL OR google_id = $1) ' +
        'RETURNING id, full_name, email, phone, role',
      [googleId, existingEmail.id],
    );
    if (linkedResult.rows[0]) {
      return linkedResult.rows[0];
    }
    return null;
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (full_name, email, password, phone, google_id) ' +
        'VALUES ($1, $2, NULL, NULL, $3) ' +
        'ON CONFLICT (email) DO UPDATE ' +
        'SET google_id = EXCLUDED.google_id, updated_at = CURRENT_TIMESTAMP ' +
        'WHERE users.google_id IS NULL OR users.google_id = EXCLUDED.google_id ' +
        'RETURNING id, full_name, email, phone, role',
      [fullName, email, googleId],
    );
    return result.rows[0] || null;
  } catch (error) {
    if (error.code === '23505') {
      // Another request may have created or linked this Google identity first.
      const concurrentResult = await pool.query(
        'SELECT id, full_name, email, phone, role FROM users WHERE google_id = $1 LIMIT 1',
        [googleId],
      );
      if (concurrentResult.rows[0]) {
        return concurrentResult.rows[0];
      }
    }
    throw error;
  }
};

const findUserByEmailOrPhoneForRegister = async (email, phone) => {
  const query = `
    SELECT id, email, phone
    FROM users
    WHERE email = $1 OR phone = $2
    LIMIT 1
  `;

  const result = await pool.query(query, [email, phone]);

  return result.rows[0];
};

const getUserById = async (userId) => {
  const result = await pool.query(
    `
    SELECT id, password
    FROM users
    WHERE id = $1
    `,
    [userId],
  );

  return result.rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    `
    UPDATE users
    SET
      password = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    `,
    [hashedPassword, userId],
  );
};

module.exports = {
  register,
  findUserByEmailOrPhone,
  findOrCreateGoogleUser,
  findUserByEmailOrPhoneForRegister,
  getUserById,
  updatePassword,
};
