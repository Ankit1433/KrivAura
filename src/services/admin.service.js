const adminRepository = require('../repositories/admin.repository');
const AppError = require('../utils/AppError');

const ORDER_FLOW = {
  Pending: ['Confirmed'],
  Confirmed: ['Packed', 'Cancelled'],
  Packed: ['Shipped'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

const getOrders = async () => {
  return await adminRepository.getOrders();
};

const getOrderById = async (orderId) => {
  const order = await adminRepository.getOrderById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return order;
};

const updateOrderStatus = async (orderId, orderStatus) => {
  const order = await adminRepository.getOrderById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const allowedStatuses = ORDER_FLOW[order.order_status] || [];

  if (!allowedStatuses.includes(orderStatus)) {
    throw new AppError(
      `Cannot change order status from '${order.order_status}' to '${orderStatus}'`,
      400,
    );
  }

  return await adminRepository.updateOrderStatus(orderId, orderStatus);
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
};
