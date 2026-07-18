const wishlistRepository = require('../repositories/wishlist.repository');
const AppError = require('../utils/appError');
const messages = require('../constants/message.js');

const addWishlist = async (userId, productId) => {
  const product = await wishlistRepository.findProductById(productId);

  if (!product) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }

  const existingWishlist = await wishlistRepository.findWishlistItem(
    userId,
    productId,
  );

  if (existingWishlist) {
    throw new AppError(messages.WISHLIST_ALREADY_EXISTS, 409);
  }

  return await wishlistRepository.addWishlist(userId, productId);
};

const getWishlist = async (userId) => {
  return await wishlistRepository.getWishlist(userId);
};

const deleteWishlistItem = async (userId, wishlistId) => {
  const wishlist = await wishlistRepository.deleteWishlistItem(
    userId,
    wishlistId,
  );

  if (!wishlist) {
    throw new AppError(messages.WISHLIST_NOT_FOUND, 404);
  }

  return wishlist;
};

module.exports = {
  addWishlist,
  getWishlist,
  deleteWishlistItem,
};
