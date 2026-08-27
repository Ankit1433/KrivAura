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
  findUserByEmailOrPhoneForRegister,
  getUserById,
  updatePassword,
};