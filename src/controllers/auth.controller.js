const authService = require('../services/auth.service');
const utils = require('../utils/response');
const messages = require('../constants/message');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return utils.successResponse(res, messages.USER_REGISTRATION, result, 201);
  } catch (err) {
    return utils.errorResponse(res, err.message, err.statusCode || 500);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return utils.successResponse(res, messages.LOGIN_SUCCESS, result, 200);
  } catch (err) {
    return utils.errorResponse(res, err.message, err.statusCode || 500);
  }
};

const profile = async (req, res) => {
  return utils.successResponse(
    res,
    'User profile fetched successfully',
    req.user,
    200,
  );
};

module.exports = {
  register,
  login,
  profile,
};
