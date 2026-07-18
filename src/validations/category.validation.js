const { z } = require('zod');

const createCategorySchema = z.object({
  name: z.string().trim().min(3, 'Category name must be at least 3 characters'),

  description: z.string().trim().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().trim().min(3, 'Category name must be at least 3 characters'),

  description: z.string().trim().optional(),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
