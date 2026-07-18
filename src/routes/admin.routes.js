const express = require('express');

const router = express.Router();

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validate = require('../middleware/validate.middleware');
const { updateOrderStatusSchema } = require('../validations/admin.validation');
const adminController = require('../controllers/admin.controller');

router.get(
  '/orders',
  authenticate,
  authorize('Admin'),
  adminController.getOrders,
);

router.get(
  '/orders/:id',
  authenticate,
  authorize('Admin'),
  adminController.getOrderById,
);

router.put(
  '/orders/:id/status',
  authenticate,
  authorize('Admin'),
  validate(updateOrderStatusSchema),
  adminController.updateOrderStatus,
);
module.exports = router;
