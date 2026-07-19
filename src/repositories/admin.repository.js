const pool = require('../config/db');

const getOrders = async () => {
  const result = await pool.query(
    `
    SELECT
      o.id,
      o.total_amount,
      o.payment_method,
      o.payment_status,
      o.order_status,
      o.created_at,

      u.id AS user_id,
      u.full_name,
      u.email

    FROM orders o
    JOIN users u
      ON o.user_id = u.id

    ORDER BY o.created_at DESC
    `,
  );

  return result.rows;
};

const getOrderById = async (orderId) => {
  const orderResult = await pool.query(
    `
    SELECT
      o.id,
      o.total_amount,
      o.shipping_address,
      o.payment_method,
      o.payment_status,
      o.order_status,
      o.created_at,

      u.id AS user_id,
      u.full_name,
      u.email

    FROM orders o
    JOIN users u
      ON o.user_id = u.id

    WHERE o.id = $1
    `,
    [orderId],
  );

  const itemsResult = await pool.query(
    `
    SELECT
      oi.id,
      oi.quantity,
      oi.price,

      p.id AS product_id,
      p.name,
      p.sku

    FROM order_items oi

    JOIN products p
      ON oi.product_id = p.id

    WHERE oi.order_id = $1
    `,
    [orderId],
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  return {
    ...orderResult.rows[0],
    items: itemsResult.rows,
  };
};

const updateOrderStatus = async (orderId, orderStatus) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      order_status = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [orderStatus, orderId],
  );

  return result.rows[0];
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
};
