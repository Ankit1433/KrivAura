const express = require('express');

const router = express.Router();

const orderController = require('../controllers/order.controller');
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createOrderSchema } = require('../validations/order.validation');

router.post(
  '/',
  authenticate,
  validate(createOrderSchema),
  orderController.createOrder,
);

router.get('/', authenticate, orderController.getOrders);

router.get('/:id', authenticate, orderController.getOrderById);

router.put('/:id/cancel', authenticate, orderController.cancelOrder);

module.exports = router;
