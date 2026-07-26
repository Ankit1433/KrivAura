const { z } = require('zod');

const createOrderSchema = z.object({
  address_id: z.number().int().positive(),

  payment_method: z.enum(['COD', 'ONLINE']),
});

module.exports = {
  createOrderSchema,
};
