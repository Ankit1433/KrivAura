const Joi = require('joi');

const createAddressSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
    }),

  address_line1: Joi.string().trim().required(),

  address_line2: Joi.string().allow('', null),

  landmark: Joi.string().allow('', null),

  city: Joi.string().trim().required(),

  state: Joi.string().trim().required(),

  postal_code: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Postal code must be 6 digits',
    }),

  country: Joi.string().default('India'),

  address_type: Joi.string().valid('Home', 'Office', 'Other').default('Home'),

  is_default: Joi.boolean().default(false),
});

const updateAddressSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(100),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
    }),

  address_line1: Joi.string(),

  address_line2: Joi.string().allow('', null),

  landmark: Joi.string().allow('', null),

  city: Joi.string(),

  state: Joi.string(),

  postal_code: Joi.string()
    .pattern(/^[0-9]{6}$/)
    .messages({
      'string.pattern.base': 'Postal code must be 6 digits',
    }),

  country: Joi.string(),

  address_type: Joi.string().valid('Home', 'Office', 'Other'),

  is_default: Joi.boolean(),
}).min(1);

module.exports = {
  createAddressSchema,
  updateAddressSchema,
};
