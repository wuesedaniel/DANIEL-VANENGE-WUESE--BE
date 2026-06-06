# Backend Middleware Architecture Implementation

## Overview
Your project now has a complete, production-ready middleware pipeline implementing all 5 required features:

---

## 1. Authentication Middleware ✅

**File:** `middleware/auth.js`

### Features:
- **Token Extraction**: Extracts JWT from Authorization header (Bearer) or cookies
- **Token Verification**: Validates JWT signatures and expiry
- **Protect Routes**: Middleware to enforce authentication on protected endpoints
- **User Attachment**: Automatically attaches user data to `req.user`
- **Optional Authentication**: `isAuthenticated` middleware for views that may or may not be authenticated

### Usage:
```javascript
// Protect a route - requires valid JWT
app.get('/api/users', protect, (req, res) => {
  // req.user contains authenticated user data
});

// Optional authentication for views
app.get('/profile', isAuthenticated, (req, res) => {
  // req.user exists if authenticated, otherwise undefined
});
```

---

## 2. Authorization Middleware (Role-Based Access Control) ✅

**File:** `middleware/auth.js` - `authorize()` function

### Features:
- **Role-Based Access Control**: Check user roles before allowing access
- **Flexible Roles**: Support for multiple roles (admin, user, etc.)
- **Granular Permissions**: Restrict access based on user role
- **Detailed Logging**: Logs unauthorized access attempts

### Usage:
```javascript
// Only admins can delete users
app.delete('/api/users/:id', protect, authorize('admin'), deleteUserHandler);

// Multiple roles allowed
app.get('/api/reports', protect, authorize('admin', 'manager'), getReportsHandler);
```

### User Model:
- `role` field: enum ['user', 'admin'], default 'user'
- Users now have role-based access differentiation

---

## 3. Logging System ✅

**File:** `middleware/logger.js`

### Components:

#### Winston Logger:
- **Log Levels**: error, warn, info, http, debug
- **Log Files**:
  - `logs/error.log` - Error level logs only
  - `logs/combined.log` - All logs
  - Max file size: 5MB with rotation
  - Max files: 5 archived logs
- **Format**: Timestamp, level, message, metadata
- **Development Console**: Pretty-printed colored output

#### Morgan HTTP Logger:
- **HTTP Request Logging**: Logs all HTTP requests
- **Integration**: Writes to Winston logger
- **Format**: `METHOD :url HTTP/STATUS - Response Time ms`

### Log Levels:
- `error`: Critical errors
- `warn`: Warnings and suspicious activity
- `info`: General information
- `http`: HTTP requests (Morgan)
- `debug`: Detailed debugging information

### Example Logs:
```
2026-06-06 13:48:23 [info]: Core middleware initialized (CORS, body-parser, cookie-parser)
2026-06-06 13:48:23 [info]: Server started on http://localhost:3001
2026-06-06 13:48:23 [error]: Token verification failed: JsonWebTokenError
2026-06-06 13:48:24 [warn]: Unauthorized access attempt to /api/users
```

---

## 4. Rate Limiting ✅

**File:** `middleware/rateLimiter.js`

### Three Tier Strategy:

#### General Limiter (Applied to all routes)
- **Limit**: 100 requests per 15 minutes
- **Purpose**: Basic DDoS protection

#### Auth Limiter (Applies to /api/auth/login)
- **Limit**: 5 requests per 15 minutes
- **Skip**: Successful requests don't count
- **Purpose**: Brute force attack prevention

#### API Limiter (Applies to /api/*)
- **Limit**: 1000 requests per hour
- **Purpose**: General API rate limiting

### Response:
```json
{
  "success": false,
  "message": "Too many requests, please try again later."
}
```

### Key Features:
- Tracks by IP address
- Returns HTTP 429 (Too Many Requests)
- Logs rate limit violations
- Configurable per route

---

## 5. Complete Middleware Pipeline ✅

**File:** `app.js`

### Middleware Stack Order:

```
1. Morgan HTTP Logger
   ↓
2. CORS Middleware
   ↓
3. Body Parser (JSON & URL-encoded)
   ↓
4. Cookie Parser
   ↓
5. General Rate Limiter (100 req/15 min)
   ↓
6. Optional Authentication (isAuthenticated)
   ↓
7. Request Routing
   ├─ Auth Routes (with authLimiter)
   ├─ User Routes (with apiLimiter, protect, authorize)
   └─ Health Check
   ↓
8. Validation Middleware (express-validator)
   ├─ Email validation
   ├─ Password validation
   ├─ MongoDB ID validation
   └─ Role validation
   ↓
9. 404 Handler
   ↓
10. Centralized Error Handler
```

### Error Handling Features:
- **CastError**: Invalid MongoDB IDs
- **Duplicate Key**: MongoDB unique constraint violations
- **JWT Errors**: Invalid/expired tokens
- **Validation Errors**: Request validation failures
- **Custom Errors**: ErrorResponse class for consistent error formatting
- **Stack Traces**: In development mode only

### Response Format:
```javascript
// Success
{
  "success": true,
  "data": {...},
  "count": 10
}

// Error
{
  "success": false,
  "message": "Error description",
  "errors": [...] // validation errors if any
}
```

---

## Middleware Files Created

### Core Utilities:
- **`utils/errorResponse.js`** - Custom error class for consistent error handling
- **`middleware/async.js`** - Async error wrapper to catch promise rejections

### Middleware Modules:
- **`middleware/logger.js`** - Winston & Morgan logging setup
- **`middleware/errorHandler.js`** - Centralized error handling
- **`middleware/rateLimiter.js`** - Three-tier rate limiting
- **`middleware/validator.js`** - Request validation with express-validator
- **`middleware/auth.js`** - Authentication & authorization (refactored)

### Updated Files:
- **`models/User.js`** - Enhanced with bcryptjs hashing & JWT methods
- **`app.js`** - Complete middleware pipeline implementation
- **`package.json`** - New dependencies added

---

## New Dependencies

```json
{
  "bcryptjs": "^2.4.3",          // Password hashing
  "express-rate-limit": "^7.1.5",// Rate limiting
  "express-validator": "^7.0.0", // Request validation
  "morgan": "^1.10.0",           // HTTP logging
  "winston": "^3.11.0"           // Application logging
}
```

---

## Environment Variables Required

```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/myapp

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Logging
LOG_LEVEL=info

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## User Authentication Flow

### 1. User Registration
```
POST /api/users
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to 'user'
}
```
- Password is hashed with bcryptjs (10 salt rounds)
- User record stored in MongoDB

### 2. User Login
```
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```
- Returns JWT token with user ID and role encoded
- Token expires in 7 days (configurable)

### 3. Protected Route Access
```
GET /api/users
Header: Authorization: Bearer <JWT_TOKEN>
```
- `protect` middleware verifies JWT
- `authorize('admin')` checks user role
- Only admins can access

---

## Example Protected Endpoints

```javascript
// Get all users (admin only)
GET /api/users
Auth: Yes (protect)
Authorization: Yes (admin)

// Get specific user (authenticated users)
GET /api/users/:id
Auth: Yes (protect)

// Update user (self or admin)
PUT /api/users/:id
Auth: Yes (protect)
Validation: ID format check

// Delete user (admin only)
DELETE /api/users/:id
Auth: Yes (protect)
Authorization: Yes (admin)
Validation: ID format check

// Create user (public)
POST /api/users
Validation: Email, password, role format
Rate Limit: API limiter

// Login (public, strict rate limit)
POST /api/auth/login
Rate Limit: Auth limiter (5 attempts/15 min)
```

---

## Testing the Implementation

### Health Check
```bash
curl http://localhost:3001/
```

### Create User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Users (Requires Auth)
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:3001/api/users
```

---

## Production Considerations

1. **Security**:
   - Change `JWT_SECRET` to a strong random value
   - Use HTTPS/TLS in production
   - Implement CSRF protection for forms
   - Set secure cookie flags

2. **Logging**:
   - Configure log rotation in production
   - Use centralized logging service (ELK, CloudWatch)
   - Monitor error rates and anomalies

3. **Rate Limiting**:
   - Adjust limits based on your expected traffic
   - Use Redis for distributed rate limiting across multiple servers
   - Implement dynamic limits based on user tier

4. **Database**:
   - Use MongoDB Atlas or self-hosted with replication
   - Enable authentication on MongoDB
   - Regular backups and monitoring

5. **Performance**:
   - Enable compression middleware
   - Use caching (Redis for sessions)
   - Optimize database queries

---

## Summary

✅ **Authentication Middleware** - JWT verification and user attachment
✅ **Authorization Middleware** - Role-based access control
✅ **Logging System** - Winston & Morgan with file rotation
✅ **Rate Limiting** - Three-tier strategy for different route types
✅ **Complete Pipeline** - Proper middleware order with validation and error handling

Your backend now has a production-ready middleware architecture!
