const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const messages = require('../constants/message.js');

const cashOnDelivery = asyncHandler(async (req, res) => {
  const order = await paymentService.cashOnDelivery(req.params.id);

  return successResponse(res, messages.PAYMENT_SUCCESS, order);
});

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await paymentService.createRazorpayOrder(
    req.body.order_id,
    req.user.id,
  );

  return successResponse(res, messages.RAZORPAY_ORDER_CREATED, order);
});

const verifyPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyPayment(
    req.body.order_id,
    req.user.id,
    req.body.razorpay_order_id,
    req.body.razorpay_payment_id,
    req.body.razorpay_signature,
  );

  return successResponse(res, messages.PAYMENT_SUCCESS, payment);
});

module.exports = {
  cashOnDelivery,
  createRazorpayOrder,
  verifyPayment,
};
