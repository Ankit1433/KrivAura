const orderService = require('../services/order.service.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { successResponse } = require('../utils/response');
const messages = require('../constants/message.js');

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(
    req.user.id,
    req.body.shipping_address,
    req.body.payment_method,
  );

  return successResponse(res, messages.ORDER_CREATED, order);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getOrders(req.user.id);

  return successResponse(res, messages.ORDERS_FETCHED, orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.user.id, req.params.id);

  return successResponse(res, messages.ORDER_FETCHED, order);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(req.user.id, req.params.id);

  return successResponse(res, messages.ORDER_CANCELLED, order);
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
};
