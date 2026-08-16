const { z } = require('zod');

const addToCartSchema = z.object({
  product_id: z.number().int().positive(),

  quantity: z.number().int().min(1, 'Quantity must be at least 1'),

  selected_size: z.string().trim().max(20).optional(),
});

const updateCartSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),

  selected_size: z.string().trim().max(20).optional(),
});

module.exports = {
  addToCartSchema,
  updateCartSchema,
};
