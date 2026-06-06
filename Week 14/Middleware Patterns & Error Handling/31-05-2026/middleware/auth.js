// Authentication and Authorization Middleware
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const { logger } = require('./logger');

/**
 * Extract JWT token from Authorization header or cookies
 * @param {Object} req - Express request object
 * @returns {string|null} - JWT token or null
 */
const tokenFromHeader = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token or null
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (err) {
    logger.error(`Token verification failed: ${err.message}`);
    return null;
  }
};

/**
 * Protect routes - verify JWT and attach user to request
 * Used for routes that require authentication
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = tokenFromHeader(req);

  if (!token) {
    logger.warn(`Unauthorized access attempt to ${req.path}`);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    logger.warn(`Invalid token attempt to ${req.path}`);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      logger.warn(`User not found for token: ${decoded.id}`);
      return next(new ErrorResponse('User not found', 404));
    }
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Authorization middleware - Grant access to specific roles
 * Used to check if authenticated user has required role
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn(`Authorize called without authenticated user for ${req.path}`);
      return next(new ErrorResponse('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `User ${req.user._id} with role ${req.user.role} tried to access ${req.path}`
      );
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Optional authentication middleware - for views
 * Attaches user to request if token exists, but doesn't require it
 */
const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = tokenFromHeader(req);
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      try {
        req.user = await User.findById(decoded.id);
      } catch (err) {
        logger.error(`Error fetching user in isAuthenticated: ${err.message}`);
      }
    }
  }
  next();
});

module.exports = {
  protect,
  authorize,
  isAuthenticated,
  verifyToken,
  tokenFromHeader,
};

