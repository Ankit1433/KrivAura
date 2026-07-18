const { z } = require('zod');

const updateOrderStatusSchema = z.object({
  order_status: z.enum([
    'Confirmed',
    'Packed',
    'Shipped',
    'Delivered',
    'Cancelled',
  ]),
});

module.exports = {
  updateOrderStatusSchema,
};
