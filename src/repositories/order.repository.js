const pool = require('../config/db');

const getCartItems = async (userId) => {
  const result = await pool.query(
    `
    SELECT
        c.product_id,
        c.quantity,
        p.price,
        p.stock
    FROM carts c
    INNER JOIN products p
        ON c.product_id = p.id
    WHERE c.user_id = $1
    `,
    [userId],
  );

  return result.rows;
};

const createOrder = async (
  userId,
  totalAmount,
  addressId,
  shippingAddress,
  paymentMethod,
  cartItems,
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `
      INSERT INTO orders
      (
          user_id,
          total_amount,
          address_id,
          shipping_address,
          payment_method,
          payment_status,
          order_status
      )
      VALUES ($1,$2,$3,$4,$5,'Pending','Pending')
      RETURNING *;
      `,
      [userId, totalAmount, addressId, shippingAddress, paymentMethod],
    );

    const order = orderResult.rows[0];

    for (const item of cartItems) {
      await client.query(
        `
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            price
        )
        VALUES ($1,$2,$3,$4)
        `,
        [order.id, item.product_id, item.quantity, item.price],
      );
    }

    if (paymentMethod === 'COD') {
      await client.query(
        `
        DELETE FROM carts
        WHERE user_id = $1
        `,
        [userId],
      );
    }

    await client.query('COMMIT');

    return order;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getOrders = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId],
  );

  return result.rows;
};

const getOrderById = async (userId, orderId) => {
  const orderResult = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1
      AND user_id = $2
    `,
    [orderId, userId],
  );

  const itemsResult = await pool.query(
    `
    SELECT
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,

        p.name,
        p.discount_price,

        c.name AS category_name,

        pi.image_url

    FROM order_items oi

    INNER JOIN products p
        ON oi.product_id = p.id

    INNER JOIN categories c
        ON p.category_id = c.id

    LEFT JOIN product_images pi
        ON p.id = pi.product_id
       AND pi.is_thumbnail = TRUE

    WHERE oi.order_id = $1
    `,
    [orderId],
  );

  return {
    order: orderResult.rows[0],
    items: itemsResult.rows,
  };
};

const cancelOrder = async (userId, orderId) => {
  const result = await pool.query(
    `
    UPDATE orders
    SET
        order_status = 'Cancelled',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND user_id = $2
      AND payment_status = 'Pending'
    RETURNING *
    `,
    [orderId, userId],
  );

  return result.rows[0];
};

const completeOrder = async (
  orderId,
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const order = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id = $1
        AND user_id = $2
      `,
      [orderId, userId],
    );

    if (!order.rows.length) {
      throw new Error('Order not found');
    }

    if (order.rows[0].payment_status === 'Paid') {
      throw new Error('Order already paid');
    }

    const items = await client.query(
      `
      SELECT
          oi.product_id,
          oi.quantity,
          p.stock
      FROM order_items oi
      INNER JOIN products p
          ON oi.product_id = p.id
      WHERE oi.order_id = $1
      `,
      [orderId],
    );

    for (const item of items.rows) {
      const updated = await client.query(
        `
        UPDATE products
        SET
            stock = stock - $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
          AND stock >= $1
        RETURNING *
        `,
        [item.quantity, item.product_id],
      );

      if (!updated.rows.length) {
        throw new Error('Insufficient Stock');
      }
    }

    await client.query(
      `
      DELETE FROM carts
      WHERE user_id = $1
      `,
      [userId],
    );

    const result = await client.query(
      `
      UPDATE orders
      SET
          payment_status = 'Paid',
          order_status = 'Confirmed',
          razorpay_order_id = $1,
          razorpay_payment_id = $2,
          razorpay_signature = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId],
    );

    await client.query('COMMIT');

    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getOrderByIdForShipment = async (orderId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1;
    `,
    [orderId],
  );

  return result.rows[0];
};

module.exports = {
  getCartItems,
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  completeOrder,
  getOrderByIdForShipment,
};
