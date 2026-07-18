const express = require('express');

const categoryController = require('../controllers/category.controller');

const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');

const { ADMIN } = require('../constants/roles');

const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validations/category.validation');

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post(
  '/',
  authenticate,
  authorize(ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory,
);
router.put(
  '/:id',
  authenticate,
  authorize(ADMIN),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete(
  '/:id',
  authenticate,
  authorize(ADMIN),
  categoryController.deleteCategory,
);

module.exports = router;
