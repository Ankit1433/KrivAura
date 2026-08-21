const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { ADMIN } = require('../constants/roles');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('../validations/auth.validation');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/profile', authenticate, authController.profile);
router.patch(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword,
);

module.exports = router;
