const express = require('express');

const router = express.Router();

const authenticate = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controller');
const validate = require('../middlewares/validate.middleware');
const {
  createRazorpayOrderSchema,
} = require('../validations/payment.validation');
const { verifyPaymentSchema } = require('../validations/payment.validation');

router.post('/cod/:id', authenticate, paymentController.cashOnDelivery);

router.post(
  '/razorpay/create-order',
  authenticate,
  validate(createRazorpayOrderSchema),
  paymentController.createRazorpayOrder,
);

router.post(
  '/razorpay/verify',
  authenticate,
  validate(verifyPaymentSchema),
  paymentController.verifyPayment,
);

module.exports = router;
