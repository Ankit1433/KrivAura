const { z } = require('zod');

const shipmentStatus = [
  'Pending',
  'Packed',
  'Shipped',
  'Out For Delivery',
  'Delivered',
  'Cancelled',
];

const createShipmentSchema = z.object({
  order_id: z.coerce.number().int().positive(),
});

const updateShipmentStatusSchema = z.object({
  shipment_status: z.enum(shipmentStatus),
});

const updateTrackingSchema = z.object({
  tracking_number: z.string().trim(),

  awb_code: z.string().trim(),

  courier_name: z.string().trim(),
});

module.exports = {
  createShipmentSchema,
  updateShipmentStatusSchema,
  updateTrackingSchema,
};
