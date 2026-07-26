const orderRepository = require('../repositories/order.repository');
const AppError = require('../utils/AppError');
const messages = require('../constants/message.js');
const addressRepository = require('../repositories/address.repository');

const createOrder = async (userId, addressId, paymentMethod) => {
  // Validate address belongs to logged-in user
  const address = await addressRepository.getAddressById(addressId, userId);

  if (address.rows.length === 0) {
    throw new AppError('Address not found', 404);
  }

  const a = address.rows[0];

  // Create immutable snapshot
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

  // Get cart items
  const cartItems = await orderRepository.getCartItems(userId);

  if (!cartItems.length) {
    throw new AppError(messages.CART_EMPTY, 400);
  }

  let totalAmount = 0;

  for (const item of cartItems) {
    if (item.quantity > item.stock) {
      throw new AppError(messages.INSUFFICIENT_STOCK, 400);
    }

    totalAmount += Number(item.price) * item.quantity;
  }

  // Create order
  const order = await orderRepository.createOrder(
    userId,
    totalAmount,
    addressId,
    shippingAddress,
    paymentMethod,
    cartItems,
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
