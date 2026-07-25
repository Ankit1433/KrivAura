const { z } = require('zod');

const createOrderSchema = z.object({
  address_id: Joi.number().integer().required(),

  payment_method: z.enum(['COD', 'ONLINE']),
});

module.exports = {
  createOrderSchema,
};
