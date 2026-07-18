const { z } = require('zod');

const addWishlistSchema = z.object({
  product_id: z.number().int().positive(),
});

module.exports = {
  addWishlistSchema,
};
