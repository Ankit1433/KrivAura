const adminService = require('../services/admin.service.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { successResponse } = require('../utils/response');
const messages = require('../constants/message.js');

const getOrders = asyncHandler(async (req, res) => {
  const orders = await adminService.getOrders();

  return successResponse(res, messages.ORDERS_FETCHED_SUCCESSFULLY, orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await adminService.getOrderById(req.params.id);

  return successResponse(res, messages.ORDER_FETCHED_SUCCESSFULLY, order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await adminService.updateOrderStatus(
    req.params.id,
    req.body.order_status,
  );

  return successResponse(res, messages.ORDER_STATUS_UPDATED, order);
});

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
};
