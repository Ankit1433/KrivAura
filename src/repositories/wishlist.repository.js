const pool = require('../config/db');

const findProductById = async (productId) => {
  const result = await pool.query(
    `
    SELECT id
    FROM products
    WHERE id = $1
    AND is_active = TRUE
    `,
    [productId],
  );

  return result.rows[0];
};

const findWishlistItem = async (userId, productId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM wishlists
    WHERE user_id = $1
    AND product_id = $2
    `,
    [userId, productId],
  );

  return result.rows[0];
};

const addWishlist = async (userId, productId) => {
  const result = await pool.query(
    `
    INSERT INTO wishlists
    (user_id, product_id)
    VALUES ($1,$2)
    RETURNING *
    `,
    [userId, productId],
  );

  return result.rows[0];
};

const getWishlist = async (userId) => {
  const result = await pool.query(
    `
    SELECT
        w.id,
        p.id AS product_id,
        p.name,
        p.price,
        p.discount_price,
        p.stock,
        c.name AS category_name,
        pi.image_url
    FROM wishlists w
    INNER JOIN products p
        ON w.product_id = p.id
    INNER JOIN categories c
        ON p.category_id = c.id
    LEFT JOIN product_images pi
        ON p.id = pi.product_id
        AND pi.is_thumbnail = TRUE
    WHERE w.user_id = $1
    ORDER BY w.created_at DESC
    `,
    [userId],
  );

  return result.rows;
};

const deleteWishlistItem = async (userId, productId) => {
  const result = await pool.query(
    `
    DELETE FROM wishlists
    WHERE product_id = $1
    AND user_id = $2
    RETURNING *
    `,
    [productId, userId],
  );

  return result.rows[0];
};

module.exports = {
  findProductById,
  findWishlistItem,
  addWishlist,
  getWishlist,
  deleteWishlistItem,
};
