const pool = require('../config/db');

const getOrderById = async (orderId, userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1
      AND user_id = $2
    `,
    [orderId, userId],
  );

  return result.rows[0];
};

const updateRazorpayOrderId = async (orderId, razorpayOrderId) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      razorpay_order_id = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING *
    `,
    [razorpayOrderId, orderId],
  );

  return result.rows[0];
};

module.exports = {
  getOrderById,
  updateRazorpayOrderId,
};
