const cartService = require('../services/cart.service');
const asyncHandler = require('../utils/asyncHandler');

const { successResponse } = require('../utils/response');
const messages = require('../constants/message');

const addToCart = asyncHandler(async (req, res) => {
  const result = await cartService.addToCart(req.user.id, req.body);

  return successResponse(res, messages.CART_ITEM_ADDED, result, 201);
});

const getCart = asyncHandler(async (req, res) => {
  const result = await cartService.getCart(req.user.id);

  return successResponse(res, messages.CART_FETCHED, result);
});

const updateCartQuantity = asyncHandler(async (req, res) => {
  const result = await cartService.updateCartQuantity(
    req.user.id,
    req.params.productId,
    req.body.quantity,
    req.body.selected_size,
  );

  return successResponse(res, messages.CART_UPDATED, result);
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const result = await cartService.deleteCartItem(
    req.user.id,
    req.params.productId,
  );

  return successResponse(res, messages.CART_ITEM_REMOVED, result);
});
module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  deleteCartItem,
};
