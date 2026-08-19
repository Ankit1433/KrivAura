const orderRepository = require('../repositories/order.repository');
const AppError = require('../utils/AppError');
const messages = require('../constants/message.js');
const addressRepository = require('../repositories/address.repository');
const couponService = require('./coupon.service.js');

const createOrder = async (
  userId,
  addressId,
  paymentMethod,
  items,
  discountCode,
) => {
  // 1. Validate address
  const address = await addressRepository.getAddressById(addressId, userId);

  if (address.rows.length === 0) {
    throw new AppError('Address not found', 404);
  }

  const a = address.rows[0];

  // 2. Create immutable shipping snapshot
  const shippingAddress = `
${a.full_name}
${a.phone}

${a.address_line1}
${a.address_line2 || ''}

${a.landmark || ''}

${a.city}, ${a.state}
${a.postal_code}

${a.country}
`.trim();

  // 3. Validate items
  if (!items || !items.length) {
    throw new AppError(messages.CART_EMPTY, 400);
  }

  // 4. Get products from DB
  const productItems = await orderRepository.getProductsForOrder(items);

  const uniqueProductIds = [...new Set(items.map((item) => Number(item.id)))];

  if (productItems.length !== uniqueProductIds.length) {
    throw new AppError('One or more products were not found', 404);
  }

  // 5. Calculate original total
  let totalAmount = 0;

  const finalItems = [];

  for (const item of items) {
    const product = productItems.find((p) => Number(p.id) === Number(item.id));

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check stock
    if (item.quantity > product.stock) {
      throw new AppError(messages.INSUFFICIENT_STOCK, 400);
    }

    // Use discount_price if available
    const price = Number(product.discount_price || product.price);

    totalAmount += price * item.quantity;

    finalItems.push({
      product_id: product.id,
      quantity: item.quantity,
      price,
      selected_size: item.selectedSize || null,
    });
  }

  totalAmount = Number(totalAmount.toFixed(2));

  // 6. Apply coupon AFTER complete total is calculated
  let discountAmount = 0;
  let couponId = null;
  let finalAmount = totalAmount;

  if (discountCode) {
    const couponResult = await couponService.getCouponDiscount(
      discountCode,
      totalAmount,
    );

    discountAmount = couponResult.discount;
    couponId = couponResult.coupon.id;
    finalAmount = couponResult.finalAmount;
  }

  // 7. Create order
  const order = await orderRepository.createOrder(
    userId,
    finalAmount,
    addressId,
    shippingAddress,
    paymentMethod,
    finalItems,
    couponId,
    discountAmount,
  );

  return order;
};

const getOrders = async (userId) => {
  return await orderRepository.getOrders(userId);
};

const getOrderById = async (userId, orderId) => {
  const order = await orderRepository.getOrderById(userId, orderId);

  if (!order.order) {
    throw new AppError(messages.ORDER_NOT_FOUND, 404);
  }

  return order;
};

const cancelOrder = async (userId, orderId) => {
  const order = await orderRepository.cancelOrder(userId, orderId);

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND, 404);
  }

  return order;
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
};
