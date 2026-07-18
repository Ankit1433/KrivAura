const express = require('express');

const router = express.Router();

const productController = require('../controllers/product.controller');

const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');

const { ADMIN } = require('../constants/roles');

const {
  createProductSchema,
  updateProductSchema,
} = require('../validations/product.validation');

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.post(
  '/',
  authenticate,
  authorize(ADMIN),
  validate(createProductSchema),
  productController.createProduct,
);

router.put(
  '/:id',
  authenticate,
  authorize(ADMIN),
  validate(updateProductSchema),
  productController.updateProduct,
);

router.delete(
  '/:id',
  authenticate,
  authorize(ADMIN),
  productController.deleteProduct,
);

module.exports = router;
