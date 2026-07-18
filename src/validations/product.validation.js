const { z } = require('zod');

const createproductSchema = z.object({
  category_id: z.number().int().positive(),

  name: z
    .string()
    .trim()
    .min(3, 'Product name must be at least 3 characters')
    .max(200),

  description: z.string().trim().optional(),

  price: z.number().positive('Price must be greater than 0'),

  discount_price: z
    .number()
    .positive()
    .optional()
    .refine(
      (data) => !data.discount_price || data.discount_price < data.price,
      {
        message: 'Discount price must be less than price',
        path: ['discount_price'],
      },
    ),

  stock: z.number().int().min(0, 'Stock cannot be negative'),

  sku: z.string().trim().min(3).max(100),
});

const updateProductSchema = z.object({
  category_id: z.number().int().positive().optional(),
  name: z.string().trim().min(3).max(200).optional(),
  description: z.string().trim().optional(),
  price: z.number().positive().optional(),
});

module.exports = {
  createproductSchema,
  updateProductSchema,
};
