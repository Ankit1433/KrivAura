const crypto = require('crypto');
const paymentRepository = require('../repositories/payment.repository');
const orderRepository = require('../repositories/order.repository');
const AppError = require('../utils/AppError');
const messages = require('../constants/message.js');
const cashfree = require('../config/cashfree');

const cashOnDelivery = async (orderId) => {
  const order = await paymentRepository.markOrderCOD(orderId);

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND, 404);
  }

  return order;
};

const toCashfreePhone = (phone) => {
  let digits = String(phone || '').replace(/\D/g, '');

  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(-10);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (!/^\d{10}$/.test(digits)) {
    throw new AppError('A valid 10-digit phone number is required for online payment', 400);
  }

  return digits;
};

const getReturnUrl = () => {
  if (process.env.CASHFREE_RETURN_URL) {
    return process.env.CASHFREE_RETURN_URL;
  }

  const frontendUrl = (process.env.FRONTEND_URL || 'https://krivaura.com').replace(/\/$/, '');
  return `${frontendUrl}/checkout?order_id={order_id}`;
};

const createCashfreeOrder = async (orderId, userId) => {
  const order = await paymentRepository.getOrderForCashfree(orderId, userId);

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND, 404);
  }

  if (order.payment_method !== 'ONLINE') {
    throw new AppError('Cashfree can only be used for online orders', 400);
  }

  if (order.payment_status === 'Paid') {
    throw new AppError('Order already paid', 400);
  }

  if (order.cashfree_order_id && order.cashfree_payment_session_id) {
    return {
      order_id: order.cashfree_order_id,
      payment_session_id: order.cashfree_payment_session_id,
      order_amount: Number(order.total_amount),
      order_currency: 'INR',
      mode: cashfree.getMode(),
    };
  }

  const cashfreeOrderId = `kriva_${order.id}`;
  const response = await cashfree.createOrder({
    order_id: cashfreeOrderId,
    order_amount: Number(order.total_amount),
    order_currency: 'INR',
    customer_details: {
      customer_id: `user_${order.user_id}`,
      customer_name: order.customer_name || 'KrivAura Customer',
      customer_email: order.customer_email,
      customer_phone: toCashfreePhone(order.customer_phone),
    },
    order_meta: {
      return_url: getReturnUrl(),
    },
    order_note: `KrivAura order ${order.id}`,
  });

  if (!response?.payment_session_id || !response?.order_id) {
    throw new AppError('Cashfree did not return a payment session', 502);
  }

  await paymentRepository.updateCashfreeOrder(
    order.id,
    response.order_id,
    response.payment_session_id,
  );

  return {
    order_id: response.order_id,
    payment_session_id: response.payment_session_id,
    order_amount: Number(order.total_amount),
    order_currency: 'INR',
    mode: cashfree.getMode(),
  };
};

const amountsMatch = (cashfreeAmount, orderAmount) =>
  Number.isFinite(Number(cashfreeAmount)) &&
  Math.round(Number(cashfreeAmount) * 100) === Math.round(Number(orderAmount) * 100);

const getSuccessfulPayment = async (cashfreeOrderId, orderAmount) => {
  const payments = await cashfree.getPayments(cashfreeOrderId);
  const successfulPayment = Array.isArray(payments)
    ? payments.find((payment) => payment.payment_status === 'SUCCESS')
    : null;

  if (!successfulPayment) {
    const hasPendingPayment = Array.isArray(payments) && payments.some(
      (payment) => payment.payment_status === 'PENDING',
    );
    throw new AppError(
      hasPendingPayment
        ? 'Payment is still processing. Check again shortly.'
        : 'Cashfree has not reported a successful payment for this order',
      409,
    );
  }

  if (!amountsMatch(successfulPayment.payment_amount, orderAmount)) {
    throw new AppError('Cashfree payment amount does not match the order total', 400);
  }

  if (!successfulPayment.cf_payment_id) {
    throw new AppError('Cashfree did not return a payment reference', 502);
  }

  return successfulPayment;
};

const verifyCashfreePayment = async (cashfreeOrderId, userId) => {
  const order = await paymentRepository.getOrderByCashfreeOrderId(cashfreeOrderId, userId);

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND, 404);
  }

  if (order.payment_status === 'Paid') {
    return order;
  }

  const successfulPayment = await getSuccessfulPayment(
    cashfreeOrderId,
    order.total_amount,
  );

  return orderRepository.completeCashfreeOrder(
    order.id,
    cashfreeOrderId,
    String(successfulPayment.cf_payment_id),
  );
};

const verifyWebhookSignature = (signature, timestamp, rawBody) => {
  if (!signature || !timestamp || !rawBody || !process.env.CASHFREE_CLIENT_SECRET) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', process.env.CASHFREE_CLIENT_SECRET)
    .update(`${timestamp}${rawBody}`)
    .digest('base64');

  const receivedBuffer = Buffer.from(String(signature));
  const expectedBuffer = Buffer.from(expected);

  return receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
};

const processCashfreeWebhook = async (payload, headers, rawBody) => {
  if (!verifyWebhookSignature(
    headers['x-webhook-signature'],
    headers['x-webhook-timestamp'],
    rawBody,
  )) {
    throw new AppError('Invalid Cashfree webhook signature', 401);
  }

  const cashfreeOrderId = payload?.data?.order?.order_id;
  const payment = payload?.data?.payment;

  if (!cashfreeOrderId || !payment) {
    throw new AppError('Invalid Cashfree webhook payload', 400);
  }

  if (payment.payment_status !== 'SUCCESS') {
    return { received: true, processed: false };
  }

  if (!payment.cf_payment_id) {
    throw new AppError('Invalid Cashfree webhook payment reference', 400);
  }

  const order = await paymentRepository.getOrderByCashfreeOrderIdForWebhook(cashfreeOrderId);

  if (!order) {
    throw new AppError('Order not found for Cashfree webhook', 404);
  }

  if (!amountsMatch(payment.payment_amount, order.total_amount)) {
    throw new AppError('Cashfree webhook payment amount does not match the order total', 400);
  }

  const completedOrder = await orderRepository.completeCashfreeOrder(
    order.id,
    cashfreeOrderId,
    String(payment.cf_payment_id),
  );

  return { received: true, processed: true, order: completedOrder };
};

module.exports = {
  cashOnDelivery,
  createCashfreeOrder,
  verifyCashfreePayment,
  processCashfreeWebhook,
};
