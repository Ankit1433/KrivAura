const { z } = require('zod');

const createOrderSchema = z.object({
  address_id: z.number().int().positive(),

  paymentMethod: z.enum(['COD', 'ONLINE']),

  discount_code: z.string().trim().min(1).optional().nullable(),

  items: z
    .array(
      z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().positive(),
        selectedSize: z
          .enum(['SMALL', 'REGULAR', 'LARGE'])
          .nullable()
          .optional()
          .default(null),
      }),
    )
    .min(1, 'At least one item is required'),
});

module.exports = {
  createOrderSchema,
};
