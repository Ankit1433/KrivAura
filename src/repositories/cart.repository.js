const pool = require('../config/db');

const findProductById = async (productId) => {
  const query = `
    SELECT
      id,
      stock,
      discount_price,
      price
    FROM products
    WHERE
      id = $1
      AND is_active = TRUE;
  `;

  const result = await pool.query(query, [productId]);

  return result.rows[0];
};

const findCartItem = async (userId, productId) => {
  const query = `
    SELECT
      id,
      quantity
    FROM carts
    WHERE
      user_id = $1
      AND product_id = $2;
  `;

  const result = await pool.query(query, [userId, productId]);

  return result.rows[0];
};

const addToCart = async (userId, productId, quantity) => {
  const query = `
    INSERT INTO carts
    (
      user_id,
      product_id,
      quantity
    )
    VALUES
    (
      $1,$2,$3
    )
    RETURNING *;
  `;

  const result = await pool.query(query, [userId, productId, quantity]);

  return result.rows[0];
};

const updateCartQuantity = async (userId, cartId, quantity) => {
  const query = `
    UPDATE carts
    SET
      quantity = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE
      id = $2
      AND user_id = $3
    RETURNING *;
  `;

  const result = await pool.query(query, [quantity, cartId, userId]);

  return result.rows[0];
};

const getCart = async (userId) => {
  const query = `
    SELECT
      c.id AS cart_id,
      c.quantity,

      p.id AS product_id,
      p.name,
      p.price,
      p.discount_price,
      p.stock,

      cat.name AS category_name,

      pi.image_url

    FROM carts c

    INNER JOIN products p
      ON c.product_id = p.id

    INNER JOIN categories cat
      ON p.category_id = cat.id

    LEFT JOIN product_images pi
      ON p.id = pi.product_id
      AND pi.is_thumbnail = TRUE

    WHERE
      c.user_id = $1
      AND p.is_active = TRUE

    ORDER BY c.created_at DESC;
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

const deleteCartItem = async (userId, cartId) => {
  const query = `
    DELETE FROM carts
    WHERE
      id = $1
      AND user_id = $2
    RETURNING *;
  `;

  const result = await pool.query(query, [cartId, userId]);

  return result.rows[0];
};

const getCartItemById = async (userId, cartId) => {
  const query = `
    SELECT
      c.id,
      c.user_id,
      c.product_id,
      c.quantity,
      p.stock
    FROM carts c
    INNER JOIN products p
      ON c.product_id = p.id
    WHERE
      c.id = $1
      AND c.user_id = $2
      AND p.is_active = TRUE;
  `;

  const result = await pool.query(query, [cartId, userId]);

  return result.rows[0];
};

module.exports = {
  findProductById,
  findCartItem,
  addToCart,
  updateCartQuantity,
  getCart,
  deleteCartItem,
  getCartItemById,
};
