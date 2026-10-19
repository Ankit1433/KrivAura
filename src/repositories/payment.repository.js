const pool = require('../config/db');

const getOrderForCashfree = async (orderId, userId) => {
  const result = await pool.query(
    `
    SELECT
      o.*,
      u.email AS customer_email,
      a.full_name AS customer_name,
      a.phone AS customer_phone
    FROM orders o
    INNER JOIN users u ON u.id = o.user_id
    LEFT JOIN addresses a ON a.id = o.address_id AND a.user_id = o.user_id
    WHERE o.id = $1
      AND o.user_id = $2
    `,
    [orderId, userId],
  );

  return result.rows[0];
};

const getOrderByCashfreeOrderId = async (cashfreeOrderId, userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE cashfree_order_id = $1
      AND user_id = $2
    `,
    [cashfreeOrderId, userId],
  );

  return result.rows[0];
};

const getOrderByCashfreeOrderIdForWebhook = async (cashfreeOrderId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE cashfree_order_id = $1
    `,
    [cashfreeOrderId],
  );

  return result.rows[0];
};

const updateCashfreeOrder = async (
  orderId,
  cashfreeOrderId,
  paymentSessionId,
) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      cashfree_order_id = $1,
      cashfree_payment_session_id = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [cashfreeOrderId, paymentSessionId, orderId],
  );

  return result.rows[0];
};
const markOrderCOD = async (orderId) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
      payment_status = 'Pending',
      order_status = 'Confirmed',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND payment_method = 'COD'
    RETURNING *
    `,
    [orderId],
  );

  return result.rows[0];
};

module.exports = {
  getOrderForCashfree,
  getOrderByCashfreeOrderId,
  getOrderByCashfreeOrderIdForWebhook,
  updateCashfreeOrder,
  markOrderCOD
};
