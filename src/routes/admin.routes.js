const express = require('express');

const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');
const { ADMIN } = require('../constants/roles');
const { updateOrderStatusSchema } = require('../validations/admin.validation');
const adminController = require('../controllers/admin.controller');

router.get(
  '/orders',
  authenticate,
  authorize(ADMIN),
  adminController.getOrders,
);

router.get(
  '/orders/:id',
  authenticate,
  authorize(ADMIN),
  adminController.getOrderById,
);

router.put(
  '/orders/:id/status',
  authenticate,
  authorize(ADMIN),
  validate(updateOrderStatusSchema),
  adminController.updateOrderStatus,
);

module.exports = router;
