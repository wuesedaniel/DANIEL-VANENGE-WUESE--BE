// Request validation middleware
const { body, param, validationResult } = require('express-validator');
const { logger } = require('./logger');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn({
      message: 'Validation errors',
      path: req.path,
      errors: errors.array(),
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// User validation rules
const userValidationRules = () => [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

// ID validation
const idValidationRule = () => [
  param('id')
    .isMongoId()
    .withMessage('Invalid resource ID'),
];

module.exports = {
  handleValidationErrors,
  userValidationRules,
  idValidationRule,
};
