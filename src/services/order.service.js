const orderRepository = require('../repositories/order.repository');
const AppError = require('../utils/AppError');
const messages = require('../constants/message.js');
const addressRepository = require('../repositories/address.repository');

const createOrder = async (
  userId,
  addressId,
  paymentMethod,
  items,
  discount_code,
) => {
  // Validate address belongs to user
  const address = await addressRepository.getAddressById(addressId, userId);

  if (address.rows.length === 0) {
    throw new AppError('Address not found', 404);
  }

  const a = address.rows[0];

  // Immutable shipping snapshot
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

  if (!items || !items.length) {
    throw new AppError(messages.CART_EMPTY, 400);
  }

  // Get product information from DB
  const productItems = await orderRepository.getProductsForOrder(items);

  if (productItems.length !== items.length) {
    throw new AppError('One or more products were not found', 404);
  }

  let totalAmount = 0;

  const finalItems = [];

  for (const item of items) {
    const product = productItems.find((p) => Number(p.id) === Number(item.id));

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (item.quantity > product.stock) {
      throw new AppError(messages.INSUFFICIENT_STOCK, 400);
    }

    const price = Number(product.discount_price || product.price);

    totalAmount += price * item.quantity;

    let discountAmount = 0;
    let couponId = null;

    if (discountCode) {
      const couponResult = await couponService.getCouponDiscount(
        discountCode,
        totalAmount,
      );

      discountAmount = couponResult.discount;
      couponId = couponResult.coupon.id;
    }

    const finalAmount = Number((totalAmount - discountAmount).toFixed(2));

    finalItems.push({
      product_id: product.id,
      quantity: item.quantity,
      price,
      selected_size: item.selectedSize || null,
    });
  }

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
