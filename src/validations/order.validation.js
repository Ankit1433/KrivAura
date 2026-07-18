const { z } = require('zod');

const createOrderSchema = z.object({
  shipping_address: z.string().min(5),

  payment_method: z.enum(['COD', 'ONLINE']),
});

module.exports = {
  createOrderSchema,
};
