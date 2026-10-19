const { z } = require('zod');

const createCashfreeOrderSchema = z.object({
  order_id: z.number().int().positive(),
});

const verifyCashfreePaymentSchema = z.object({
  cashfree_order_id: z
    .string()
    .min(3)
    .max(45)
    .regex(/^[a-zA-Z0-9_-]+$/),
});

module.exports = {
  createCashfreeOrderSchema,
  verifyCashfreePaymentSchema,
};
