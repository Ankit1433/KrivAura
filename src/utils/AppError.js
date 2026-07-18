class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;

    // Maintains proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
