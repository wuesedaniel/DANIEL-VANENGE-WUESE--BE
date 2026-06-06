//Mongoose bad object id error
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    //Log to console for dev
    console.log(err);
    //Mongoose bad object id
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    //Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
console.log('Error middleware loaded');

// app.js must be updated to include the error handling middleware after all routes and other middleware have been defined.
// app.js
const express = require('express');
const errorHandler = require('./middleware/error');
const app = express();
// ... other middleware and routes

// Error handling middleware (should be last piece of middleware)
app.use(errorHandler);
