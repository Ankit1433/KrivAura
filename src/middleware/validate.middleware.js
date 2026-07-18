const { errorResponse } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return errorResponse(res, result.error.issues[0].message, 400);
    }
    req.body = result.data; // Update req.body with the validated data
    next();
  };
};

module.exports = validate;
