const orderRepository = require('../repositories/order.repository');
const AppError = require('../utils/appError');
const messages = require('../constants/message.js');

const createOrder = async (userId, shippingAddress, paymentMethod) => {
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

  const order = await orderRepository.createOrder(
    userId,
    totalAmount,
    shippingAddress,
    paymentMethod,
  );

  for (const item of cartItems) {
    await orderRepository.createOrderItem(
      order.id,
      item.product_id,
      item.quantity,
      item.price,
    );
  }

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
