const db = require('../config/db');

const createAddress = async (userId, data) => {
  const query = `
        INSERT INTO addresses
        (
            user_id,
            full_name,
            phone,
            address_line1,
            address_line2,
            landmark,
            city,
            state,
            postal_code,
            country,
            address_type,
            is_default
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *;
    `;

  return db.query(query, [
    userId,
    data.full_name,
    data.phone,
    data.address_line1,
    data.address_line2,
    data.landmark,
    data.city,
    data.state,
    data.postal_code,
    data.country || 'India',
    data.address_type || 'Home',
    data.is_default || false,
  ]);
};

const getAddresses = async (userId) => {
  return db.query(
    `
        SELECT *
        FROM addresses
        WHERE user_id=$1
        ORDER BY is_default DESC,id DESC
    `,
    [userId],
  );
};

const getAddressById = async (id, userId) => {
  return db.query(
    `
        SELECT *
        FROM addresses
        WHERE id=$1
        AND user_id=$2
    `,
    [id, userId],
  );
};

const updateAddress = async (id, userId, data) => {
  return db.query(
    `
        UPDATE addresses
        SET
            full_name=$1,
            phone=$2,
            address_line1=$3,
            address_line2=$4,
            landmark=$5,
            city=$6,
            state=$7,
            postal_code=$8,
            country=$9,
            address_type=$10,
            is_default=$11,
            updated_at=NOW()
        WHERE id=$12
        AND user_id=$13
        RETURNING *;
    `,
    [
      data.full_name,
      data.phone,
      data.address_line1,
      data.address_line2,
      data.landmark,
      data.city,
      data.state,
      data.postal_code,
      data.country,
      data.address_type,
      data.is_default,
      id,
      userId,
    ],
  );
};

const deleteAddress = async (id, userId) => {
  return db.query(
    `
        DELETE FROM addresses
        WHERE id=$1
        AND user_id=$2
        RETURNING *;
    `,
    [id, userId],
  );
};

const clearDefault = async (userId) => {
  return db.query(
    `
        UPDATE addresses
        SET is_default=false
        WHERE user_id=$1
    `,
    [userId],
  );
};

const setDefault = async (id, userId) => {
  return db.query(
    `
        UPDATE addresses
        SET is_default=true
        WHERE id=$1
        AND user_id=$2
        RETURNING *;
    `,
    [id, userId],
  );
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  clearDefault,
  setDefault,
};
