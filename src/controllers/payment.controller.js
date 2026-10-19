const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const messages = require('../constants/message.js');

const cashOnDelivery = asyncHandler(async (req, res) => {
  const order = await paymentService.cashOnDelivery(req.params.id);
  return successResponse(res, messages.PAYMENT_SUCCESS, order);
});

const createCashfreeOrder = asyncHandler(async (req, res) => {
  const order = await paymentService.createCashfreeOrder(
    req.body.order_id,
    req.user.id,
  );

  return successResponse(res, messages.CASHFREE_ORDER_CREATED, order);
});

const verifyCashfreePayment = asyncHandler(async (req, res) => {
  const order = await paymentService.verifyCashfreePayment(
    req.body.cashfree_order_id,
    req.user.id,
  );

  return successResponse(res, messages.PAYMENT_SUCCESS, order);
});

module.exports = {
  cashOnDelivery,
  createCashfreeOrder,
  verifyCashfreePayment,
};
