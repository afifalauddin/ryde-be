import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ApiError } from "~/utils/api-error";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";

// Use ErrorRequestHandler type for error handling middleware
export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log error
  console.error("Error:", {
    name: error.name,
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Store error in locals
  res.locals.error = {
    code: "INTERNAL_ERROR",
    message: "An unexpected error occurred",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };

  // Handle different types of errors
  if (error instanceof ApiError) {
    res.locals.error = {
      code: error.code,
      message: error.message,
      details: error.details,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    res.status(error.statusCode).json({
      success: false,
      error: res.locals.error,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
    return next();
  }

  if (error instanceof ZodError) {
    res.locals.error = {
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      details: error.errors,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    res.status(400).json({
      success: false,
      error: res.locals.error,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });

    return next();
  }

  if (error instanceof MongooseError) {
    res.locals.error = {
      code: "DATABASE_ERROR",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    res.status(500).json({
      success: false,
      error: res.locals.error,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
    return next();
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: res.locals.error,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });

  return next();
};

// Handle 404 errors for unknown routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`);
  res.locals.error = {
    code: error.code,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };
  res.status(404).json({
    success: false,
    error: res.locals.error,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
  return next();
};
