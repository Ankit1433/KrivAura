const pool = require('../config/db');

const register = async (user) => {
  console.log(user);

  const query = ` INSERT INTO users
        (
            full_name,
            email,
            password,
            phone
        )
        VALUES
        (
            $1,$2,$3,$4
        )
        RETURNING
            id,
            full_name,
            email,
            phone,
            role,
            created_at;
    `;

  const values = [user.full_name, user.email, user.password, user.phone];
  const result = await pool.query(query, values);

  return result.rows[0];
};

const finduserByEmail = async (email) => {
  const query = 'SELECT id,email,password,role FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

module.exports = { register, finduserByEmail };
