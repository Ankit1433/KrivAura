const express = require('express');

const router = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');
const validate = require('../middlewares/validate.middleware');
const {
  createCashfreeOrderSchema,
  verifyCashfreePaymentSchema,
} = require('../validations/payment.validation');

router.post('/cod/:id', authenticate, paymentController.cashOnDelivery);

router.post(
  '/cashfree/create-order',
  authenticate,
  validate(createCashfreeOrderSchema),
  paymentController.createCashfreeOrder,
);

router.post(
  '/cashfree/verify',
  authenticate,
  validate(verifyCashfreePaymentSchema),
  paymentController.verifyCashfreePayment,
);

module.exports = router;
