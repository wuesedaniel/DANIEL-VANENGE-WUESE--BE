//server.js
require('dotenv').config({ path: './config/config.env' });
const express = require('express');
const connectDB = require('./config/db');
// Connect to database
connectDB();
const app = express();
// Body parser
app.use(express.json());
// Cookie parser
app.use(require('cookie-parser')());
<<<<<<< HEAD
// Mount routers (only if present) — fall back to index router
const fs = require('fs');
const path = require('path');
const routesDir = path.join(__dirname, 'routes');
const indexRouter = require('./routes/index');
// Serve MIDDLEWARE CONCEPT folder as static at /concept (if present)
const conceptDir = path.join(__dirname, 'MIDDLEWARE CONCEPT');
if (fs.existsSync(conceptDir)) {
    app.use('/concept', express.static(conceptDir));
}
if (fs.existsSync(path.join(routesDir, 'auth.js'))) {
    app.use('/api/v1/auth', require('./routes/auth'));
} else {
    app.use('/api', indexRouter);
}
if (fs.existsSync(path.join(routesDir, 'users.js'))) {
    app.use('/api/v1/users', require('./routes/users'));
}
if (fs.existsSync(path.join(routesDir, 'posts.js'))) {
    app.use('/api/v1/posts', require('./routes/posts'));
}
// Error handling middleware
app.use(require('./middleware/errorHandler'));
=======
// Mount routers
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/posts', require('./routes/posts'));
// Error handling middleware
app.use(require('./middleware/error'));
>>>>>>> f09daa4543a0c4b05347d066be0f7cdbe4aec8ee
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

//login endpoint
const jwt = require('jsonwebtoken');
const asyncHandler = require('./middleware/async');
const ErrorResponse = require('./utils/errorResponse');
const User = require('./models/User');
const tokenFromHeader = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    }
    if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    return null;
};
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
};      
app.post('/api/v1/auth/login', asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }   
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
}));

app.post('/api/v1/auth/logout', (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
});

<<<<<<< HEAD
=======
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
});
if (email === 'admin@example.com' && password === 'admin123') {
    const token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
} else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
}
>>>>>>> f09daa4543a0c4b05347d066be0f7cdbe4aec8ee

// Protected route example
app.get('/api/protected', asyncHandler(async (req, res, next) => {
    const token = tokenFromHeader(req);
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    res.status(200).json({ success: true, data: 'This is a protected route' });
}));

//admin only route example
app.get('/api/admin', asyncHandler(async (req, res, next) => {
    const token = tokenFromHeader(req);
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    if (decoded.role !== 'admin') {
        return next(new ErrorResponse('User role not authorized to access this route', 403));
    }
    res.status(200).json({ success: true, data: 'This is an admin only route' });
}));

app.delete('/api/v1/auth/logout', (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
});

<<<<<<< HEAD
=======
app.post('/api/v1/auth/login', asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
}
));

>>>>>>> f09daa4543a0c4b05347d066be0f7cdbe4aec8ee
