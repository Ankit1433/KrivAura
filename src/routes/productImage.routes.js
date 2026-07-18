const express = require('express');

const router = express.Router();

const upload = require('../middleware/upload.middleware');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

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
