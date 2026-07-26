const pool = require('../config/db');

const createShipment = async (
  orderId,
  provider,
  shipmentId,
  trackingNumber,
  awbCode,
  courierName,
  estimatedDelivery,
) => {
  const result = await pool.query(
    `
    INSERT INTO shipments
    (
        order_id,
        provider,
        shipment_id,
        tracking_number,
        awb_code,
        courier_name,
        estimated_delivery
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
    `,
    [
      orderId,
      provider,
      shipmentId,
      trackingNumber,
      awbCode,
      courierName,
      estimatedDelivery,
    ],
  );

  return result.rows[0];
};

const getShipments = async (userId) => {
  const result = await pool.query(
    `
    SELECT
        s.*,
        o.total_amount,
        o.payment_status,
        o.order_status
    FROM shipments s
    INNER JOIN orders o
        ON s.order_id = o.id
    WHERE o.user_id = $1
    ORDER BY s.created_at DESC;
    `,
    [userId],
  );

  return result.rows;
};

const getShipmentById = async (shipmentId, userId) => {
  const result = await pool.query(
    `
    SELECT
        s.*,
        o.total_amount,
        o.payment_status,
        o.order_status
    FROM shipments s
    INNER JOIN orders o
        ON s.order_id = o.id
    WHERE s.id = $1
      AND o.user_id = $2;
    `,
    [shipmentId, userId],
  );

  return result.rows[0];
};

const getShipmentByOrderId = async (orderId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM shipments
    WHERE order_id = $1;
    `,
    [orderId],
  );

  return result.rows[0];
};

const updateShipmentStatus = async (shipmentId, status) => {
  const result = await pool.query(
    `
    UPDATE shipments
    SET
        shipment_status = $1,
        updated_at = CURRENT_TIMESTAMP,
        shipped_at = CASE
            WHEN $1 = 'Shipped'
            THEN CURRENT_TIMESTAMP
            ELSE shipped_at
        END,
        delivered_at = CASE
            WHEN $1 = 'Delivered'
            THEN CURRENT_TIMESTAMP
            ELSE delivered_at
        END
    WHERE id = $2
    RETURNING *;
    `,
    [status, shipmentId],
  );

  return result.rows[0];
};

const updateTracking = async (
  shipmentId,
  trackingNumber,
  awbCode,
  courierName,
) => {
  const result = await pool.query(
    `
    UPDATE shipments
    SET
        tracking_number = $1,
        awb_code = $2,
        courier_name = $3,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *;
    `,
    [trackingNumber, awbCode, courierName, shipmentId],
  );

  return result.rows[0];
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  getShipmentByOrderId,
  updateShipmentStatus,
  updateTracking,
};
