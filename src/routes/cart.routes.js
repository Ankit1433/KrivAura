const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cart.controller');

const authenticate = require('../middlewares/auth.middleware');

const validate = require('../middlewares/validate.middleware');

const {
  addToCartSchema,
  updateCartSchema,
} = require('../validations/cart.validation');

router.post(
  '/',
  authenticate,
  validate(addToCartSchema),
  cartController.addToCart,
);

router.get('/', authenticate, cartController.getCart);

router.put(
  '/:productId',
  authenticate,
  validate(updateCartSchema),
  cartController.updateCartQuantity,
);

router.delete('/:productId', authenticate, cartController.deleteCartItem);

module.exports = router;
