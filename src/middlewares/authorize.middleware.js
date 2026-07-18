const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(errorResponse(res, messages.FORBIDDEN, 403));
    }
    next();
  };
};

module.exports = authorize;
