const wishlistService = require('../services/wishlist.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response.js');
const messages = require('../constants/message.js');

const addWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.addWishlist(
    req.user.id,
    req.body.product_id,
  );

  return successResponse(res, messages.WISHLIST_ADDED, wishlist);
});

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);

  return successResponse(res, messages.WISHLIST_FETCHED, wishlist);
});

const deleteWishlistItem = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.deleteWishlistItem(
    req.user.id,
    req.params.productId,
  );

  return successResponse(res, messages.WISHLIST_REMOVED, wishlist);
});

module.exports = {
  addWishlist,
  getWishlist,
  deleteWishlistItem,
};
