const { z } = require('zod');

const registerSchema = z.object({
  full_name: z.string().trim().min(3, 'Name must be at least 3 characters'),

  email: z.email('Invalid email address'),

  password: z.string().min(8, 'Password must be at least 8 characters'),

  phone: z.string().length(10, 'Phone number must be exactly 10 digits'),
});

const loginSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, 'Email or phone number is required'),

  password: z.string().min(1, 'Password is required'),
});

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),

    new_password: z
      .string()
      .min(8, 'New password must be at least 8 characters'),

    confirm_password: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'New password and confirm password do not match',
    path: ['confirm_password'],
  });

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
