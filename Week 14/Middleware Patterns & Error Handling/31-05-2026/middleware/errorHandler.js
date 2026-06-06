// Centralized error handling middleware
const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log the error
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = { statusCode: 400, message };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err = { statusCode: 400, message };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Invalid token`;
    err = { statusCode: 400, message };
  }

  // JWT expire error
  if (err.name === 'TokenExpiredError') {
    const message = `Token is expired`;
    err = { statusCode: 400, message };
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
