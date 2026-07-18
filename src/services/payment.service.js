const paymentRepository = require('../repositories/payment.repository');
const AppError = require('../utils/AppError');
const messages = require('../constants/message.js');
const razorpay = require('../config/Razorpay');
const crypto = require('crypto');
const orderRepository = require('../repositories/order.repository');

const cashOnDelivery = async (orderId) => {
  const order = await paymentRepository.markOrderPaid(orderId, 'Pending', null);

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND, 404);
  }

  return order;
};

const createRazorpayOrder = async (orderId, userId) => {
  const order = await paymentRepository.getOrderById(orderId, userId);

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND, 404);
  }

  if (order.payment_status === 'Paid') {
    throw new AppError('Order already paid', 400);
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Number(order.total_amount) * 100,
    currency: 'INR',
    receipt: `order_${order.id}`,
  });

  await paymentRepository.updateRazorpayOrderId(order.id, razorpayOrder.id);

  return razorpayOrder;
};

const verifyPayment = async (
  orderId,
  userId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    throw new AppError('Invalid payment signature', 400);
  }

  const order = await orderRepository.completeOrder(
    orderId,
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  );

  return order;
};
module.exports = {
  cashOnDelivery,
  createRazorpayOrder,
  verifyPayment,
};
