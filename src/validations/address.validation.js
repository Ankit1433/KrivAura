const { z } = require('zod');

const createAddressSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name cannot exceed 100 characters'),

  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),

  address_line1: z.string().trim().min(1, 'Address Line 1 is required'),

  address_line2: z.string().optional(),

  landmark: z.string().optional(),

  city: z.string().trim().min(1, 'City is required'),

  state: z.string().trim().min(1, 'State is required'),

  postal_code: z.string().regex(/^[0-9]{6}$/, 'Postal code must be 6 digits'),

  country: z.string().default('India'),

  address_type: z.enum(['Home', 'Office', 'Other']).default('Home'),

  is_default: z.boolean().default(false),
});

const updateAddressSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(3, 'Full name must be at least 3 characters')
      .max(100)
      .optional(),

    phone: z
      .string()
      .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .optional(),

    address_line1: z.string().optional(),

    address_line2: z.string().optional(),

    landmark: z.string().optional(),

    city: z.string().optional(),

    state: z.string().optional(),

    postal_code: z
      .string()
      .regex(/^[0-9]{6}$/, 'Postal code must be 6 digits')
      .optional(),

    country: z.string().optional(),

    address_type: z.enum(['Home', 'Office', 'Other']).optional(),

    is_default: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
  });

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};
