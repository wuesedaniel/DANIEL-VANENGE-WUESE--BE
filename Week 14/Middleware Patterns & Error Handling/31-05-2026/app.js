//app.js
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import middleware
const { morganMiddleware, logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter, authLimiter, apiLimiter } = require('./middleware/rateLimiter');
const { handleValidationErrors, userValidationRules, idValidationRule } = require('./middleware/validator');
const asyncHandler = require('./middleware/async');
const ErrorResponse = require('./utils/errorResponse');

// Import auth middleware
const { protect, authorize, isAuthenticated } = require('./middleware/auth');

// Import models and routes
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

// ========================================
// 1. DATABASE CONNECTION
// ========================================
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('MongoDB connected successfully'))
  .catch(err => logger.error(`MongoDB connection error: ${err.message}`));

// ========================================
// 2. LOGGING MIDDLEWARE
// ========================================
app.use(morganMiddleware);

// ========================================
// 3. SECURITY AND PARSING MIDDLEWARE
// ========================================
// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*',
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser
app.use(cookieParser());

logger.info('Core middleware initialized (CORS, body-parser, cookie-parser)');

// ========================================
// 4. RATE LIMITING MIDDLEWARE
// ========================================
// Apply general rate limiter to all routes
app.use(generalLimiter);

logger.info('Rate limiting middleware initialized');

// ========================================
// 5. OPTIONAL AUTHENTICATION FOR VIEWS
// ========================================
app.use(isAuthenticated);

// ========================================
// 6. ROUTES
// ========================================

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running on http://localhost:3000/',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ========================================
// AUTHENTICATION ROUTES
// ========================================

// Placeholder: Login route (with auth rate limiting)
app.post('/api/auth/login', authLimiter, asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  logger.info(`Login attempt for email: ${email}`);

  // Placeholder logic
  res.status(200).json({
    success: true,
    message: 'Login endpoint - implement your authentication logic',
  });
}));

// ========================================
// USER MANAGEMENT ROUTES (with API rate limiter)
// ========================================

app.use('/api/users', apiLimiter);

// Create user
app.post('/api/users', 
  ...userValidationRules(),
  handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    try {
      const user = new User(req.body);
      await user.save();
      logger.info(`User created: ${user._id}`);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  })
);

// Get all users
app.get('/api/users',
  protect,
  authorize('admin'),
  asyncHandler(async (req, res, next) => {
    try {
      const users = await User.find();
      logger.info(`Retrieved ${users.length} users`);
      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (err) {
      next(err);
    }
  })
);

// Get user by ID
app.get('/api/users/:id',
  ...idValidationRule(),
  handleValidationErrors,
  protect,
  asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new ErrorResponse('User not found', 404));
      }
      logger.info(`Retrieved user: ${user._id}`);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  })
);

// Update user
app.put('/api/users/:id',
  ...idValidationRule(),
  handleValidationErrors,
  protect,
  asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!user) {
        return next(new ErrorResponse('User not found', 404));
      }
      logger.info(`Updated user: ${user._id}`);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  })
);

// Delete user
app.delete('/api/users/:id',
  ...idValidationRule(),
  handleValidationErrors,
  protect,
  authorize('admin'),
  asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return next(new ErrorResponse('User not found', 404));
      }
      logger.info(`Deleted user: ${req.params.id}`);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  })
);

// ========================================
// 7. 404 HANDLER
// ========================================
app.use((req, res, next) => {
  next(new ErrorResponse(`Route not found: ${req.originalUrl}`, 404));
});

// ========================================
// 8. CENTRALIZED ERROR HANDLING MIDDLEWARE
// ========================================
app.use(errorHandler);

// ========================================
// 9. START SERVER
// ========================================
const server = app.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;

