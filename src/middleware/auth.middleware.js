const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');
const messages = require('../constants/message');
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(errorResponse(res, messages.UNAUTHORIZED, 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(errorResponse(res, messages.UNAUTHORIZED, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorResponse(res, messages.UNAUTHORIZED, 401));
  }
};

module.exports = authenticate;
