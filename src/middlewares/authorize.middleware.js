const { errorResponse } = require('../utils/response');
const messages = require('../constants/message');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, messages.FORBIDDEN, 403);
    }

    next();
  };
};

module.exports = authorize;
