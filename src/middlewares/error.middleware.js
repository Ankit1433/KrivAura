const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  return errorResponse(
    res,
    err.message || 'Internal Server Error',
    err.statusCode || 500,
  );
};

module.exports = errorHandler;
