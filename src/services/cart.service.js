const cartRepository = require('../repositories/cart.repository');
const AppError = require('../utils/appError');
const messages = require('../constants/message');

const addToCart = async (userId, cart) => {
  const product = await cartRepository.findProductById(cart.product_id);

  if (!product) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }

  if (cart.quantity > product.stock) {
    throw new AppError('Requested quantity exceeds available stock', 400);
  }

  const existingCartItem = await cartRepository.findCartItem(
    userId,
    cart.product_id,
  );

  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + cart.quantity;

    if (newQuantity > product.stock) {
      throw new AppError('Requested quantity exceeds available stock', 400);
    }

    return await cartRepository.updateCartQuantity(
      existingCartItem.id,
      newQuantity,
    );
  }
  return await cartRepository.addToCart(userId, cart.product_id, cart.quantity);
};

const getCart = async (userId) => {
  return await cartRepository.getCart(userId);
};

const updateCartQuantity = async (userId, cartId, quantity) => {
  const cartItem = await cartRepository.getCartItemById(userId, cartId);

  if (!cartItem) {
    throw new AppError(messages.CART_NOT_FOUND, 404);
  }

  if (quantity > cartItem.stock) {
    throw new AppError('Requested quantity exceeds available stock', 400);
  }

  return await cartRepository.updateCartQuantity(userId, cartId, quantity);
};

const deleteCartItem = async (userId, cartId) => {
  const cartItem = await cartRepository.deleteCartItem(userId, cartId);

  if (!cartItem) {
    throw new AppError(messages.CART_NOT_FOUND, 404);
  }

  return cartItem;
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  deleteCartItem,
};
