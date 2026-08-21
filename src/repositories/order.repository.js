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
  orderItems,
  couponId,
  discountAmount,
) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // -----------------------------------------
    // 1. Determine order status
    // -----------------------------------------

    const orderStatus = paymentMethod === 'COD' ? 'Confirmed' : 'Pending';

    // -----------------------------------------
    // 2. Create order
    // -----------------------------------------

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
            order_status,
            coupon_id,
            discount_amount
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            'Pending',
            $6,
            $7,
            $8
        )
        RETURNING *;
        `,
      [
        userId,
        totalAmount,
        addressId,
        shippingAddress,
        paymentMethod,
        orderStatus,
        couponId,
        discountAmount,
      ],
    );

    const order = orderResult.rows[0];

    // -----------------------------------------
    // 3. Create order items
    // -----------------------------------------

    for (const item of orderItems) {
      await client.query(
        `
        INSERT INTO order_items
        (
            order_id,
            product_id,
            quantity,
            price,
            selected_size
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        `,
        [
          order.id,
          item.product_id,
          item.quantity,
          item.price,
          item.selected_size,
        ],
      );
    }

    // -----------------------------------------
    // 4. Increment coupon usage
    // -----------------------------------------

    if (couponId) {
      const usageResult = await client.query(
        `
          UPDATE coupons
          SET
            used_count = used_count + 1,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $1
            AND
            (
              usage_limit IS NULL
              OR used_count < usage_limit
            )
          RETURNING id;
          `,
        [couponId],
      );

      if (!usageResult.rows.length) {
        throw new Error('Coupon usage limit reached');
      }
    }

    // -----------------------------------------
    // 5. COD processing
    // -----------------------------------------

    if (paymentMethod === 'COD') {
      for (const item of orderItems) {
        const stockResult = await client.query(
          `
            UPDATE products
            SET
              stock = stock - $1,
              updated_at =
                CURRENT_TIMESTAMP
            WHERE id = $2
              AND stock >= $1
            RETURNING id;
            `,
          [item.quantity, item.product_id],
        );

        if (!stockResult.rows.length) {
          throw new Error('Insufficient Stock');
        }
      }

      // Clear cart for COD
      await client.query(
        `
        DELETE FROM carts
        WHERE user_id = $1
        `,
        [userId],
      );
    }

    // -----------------------------------------
    // 6. Commit
    // -----------------------------------------

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
        oi.selected_size,
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

const getOrderForShipment = async (orderId) => {
  // Order + Address
  const orderResult = await pool.query(
    `
    SELECT
        o.*,

        a.full_name,
        a.phone,
        a.address_line1,
        a.address_line2,
        a.city,
        a.state,
        a.postal_code,
        a.country

    FROM orders o

    INNER JOIN addresses a
        ON o.address_id = a.id

    WHERE o.id = $1
    `,
    [orderId],
  );

  if (!orderResult.rows.length) {
    return null;
  }

  // Order Items
  const itemsResult = await pool.query(
    `
    SELECT
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.selected_size,
        p.name,
        p.sku,
        p.weight_grams,

        pi.image_url

    FROM order_items oi

    INNER JOIN products p
        ON oi.product_id = p.id

    LEFT JOIN product_images pi
        ON p.id = pi.product_id
       AND pi.is_thumbnail = TRUE

    WHERE oi.order_id = $1
    `,
    [orderId],
  );

  const order = orderResult.rows[0];

  return {
    id: order.id,
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    order_status: order.order_status,

    address: {
      full_name: order.full_name,
      phone: order.phone,
      address_line1: order.address_line1,
      address_line2: order.address_line2,
      city: order.city,
      state: order.state,
      postal_code: order.postal_code,
      country: order.country,
    },

    items: itemsResult.rows,
  };
};

const getProductsForOrder = async (items) => {
  const productIds = items.map((item) => item.id);

  const result = await pool.query(
    `
    SELECT
        id, 
        price,
        discount_price,
        stock
    FROM products
    WHERE id = ANY($1::int[])
      AND is_active = TRUE
    `,
    [productIds],
  );

  return result.rows;
};

module.exports = {
  getCartItems,
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  completeOrder,
  getOrderByIdForShipment,
  getOrderForShipment,
  getProductsForOrder,
};
