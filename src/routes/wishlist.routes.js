const express = require('express');

const router = express.Router();

const wishlistController = require('../controllers/wishlist.controller');
const validate = require('../middleware/validate.middleware.js');
const authenticate = require('../middleware/auth.middleware');
const { addWishlistSchema } = require('../validations/wishlist.validation');

router.post(
  '/',
  authenticate,
  validate(addWishlistSchema),
  wishlistController.addWishlist,
);

router.get('/', authenticate, wishlistController.getWishlist);

router.delete('/:id', authenticate, wishlistController.deleteWishlistItem);

module.exports = router;
