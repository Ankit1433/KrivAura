const { z } = require('zod');

const registerSchema = z.object({
  full_name: z.string().trim().min(3, 'Name must be at least 3 characters'),

  email: z.email('Invalid email address'),

  password: z.string().min(8, 'Password must be at least 8 characters'),

  phone: z.string().length(10, 'Phone number must be exactly 10 digits'),
});

const loginSchema = z.object({
  email: z.email('Invalid email address'),

  password: z.string().min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
