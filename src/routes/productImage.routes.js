const express = require('express');

const router = express.Router();

const upload = require('../middlewares/upload.middleware');

const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');

const { ADMIN } = require('../constants/roles');

const productImageController = require('../controllers/productImage.controller');

router.post(
  '/:id/images',
  authenticate,
  authorize(ADMIN),
  upload.single('image'),
  productImageController.uploadProductImage,
);

module.exports = router;
