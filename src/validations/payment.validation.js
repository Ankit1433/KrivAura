const { z } = require('zod');

const createRazorpayOrderSchema = z.object({
  order_id: z.number().int().positive(),
});

const verifyPaymentSchema = z.object({
  order_id: z.number().int().positive(),

  razorpay_order_id: z.string(),

  razorpay_payment_id: z.string(),

  razorpay_signature: z.string(),
});

module.exports = {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
};
