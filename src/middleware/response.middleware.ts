import { Request, Response, NextFunction } from "express";
import { ResponseFormatter } from "../utils/response-formatter";
import { ApiError } from "../utils/api-error";
import { ZodError } from "zod";

export const responseHandler = (
  _: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Add methods to response object
  res.success = function (
    this: Response,
    data: unknown,
    statusCode = 200,
    message = "Success",
  ) {
    return ResponseFormatter.success({
      res: this,
      data,
      message,
      statusCode,
    });
  };

  res.successWithPagination = function (
    this: Response,
    data: unknown,
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    },
    message = "Success",
    statusCode = 200,
  ) {
    return ResponseFormatter.success({
      res: this,
      data,
      message,
      statusCode,
      pagination,
    });
  };

  res.error = function (
    this: Response,
    error: ApiError | Error,
    statusCode = 500,
  ) {
    // Store error in locals
    if (error instanceof ApiError) {
      this.locals.error = {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      };
      return ResponseFormatter.error({
        res: this,
        error: this.locals.error,
        statusCode: error.statusCode,
      });
    }

    if (error instanceof ZodError) {
      this.locals.error = {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: error.errors,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      };
      return ResponseFormatter.error({
        res: this,
        error: this.locals.error,
        statusCode: 400,
      });
    }

    this.locals.error = {
      code: "INTERNAL_ERROR",
      message: error.message || "Internal server error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
    return ResponseFormatter.error({
      res: this,
      error: this.locals.error,
      statusCode,
    });
  };

  next();
};
