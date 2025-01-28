import { Request, Response, NextFunction } from "express";
import { ApiError } from "~/utils/api-error";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";
import { errorHandler, notFoundHandler } from "../error.middleware";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock the logger
vi.mock("~/server", () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe("Error Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: "/test",
      method: "GET",
      originalUrl: "/test",
    };
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      locals: {},
    };
    nextFunction = vi.fn();
    process.env.NODE_ENV = "development";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("errorHandler", () => {
    it("should handle ApiError", () => {
      const apiError = new ApiError(400, "BAD_REQUEST", "Bad request error");

      errorHandler(
        apiError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Bad request error",
          stack: expect.any(String),
        },
        timestamp: expect.any(String),
        path: "/test",
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should handle ZodError", () => {
      const zodError = new ZodError([
        {
          code: "invalid_type",
          expected: "string",
          received: "undefined",
          path: ["name"],
          message: "Required",
        },
      ]);

      errorHandler(
        zodError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: zodError.errors,
          stack: expect.any(String),
        },
        timestamp: expect.any(String),
        path: "/test",
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should handle MongooseError", () => {
      const mongooseError = new MongooseError("Database error");

      errorHandler(
        mongooseError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Database error",
          stack: expect.any(String),
        },
        timestamp: expect.any(String),
        path: "/test",
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should handle SyntaxError", () => {
      const syntaxError = new SyntaxError("Invalid JSON");

      errorHandler(
        syntaxError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Please check if your request body is a valid JSON",
          details: "Invalid JSON",
          stack: expect.any(String),
        },
        timestamp: expect.any(String),
        path: "/test",
      });
      expect(nextFunction).toHaveBeenCalled();
    });

    it("should handle unknown errors", () => {
      const unknownError = new Error("Unknown error");

      errorHandler(
        unknownError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
          stack: expect.any(String),
        },
        timestamp: expect.any(String),
        path: "/test",
      });
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe("notFoundHandler", () => {
    it("should handle unknown routes", () => {
      notFoundHandler(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Cannot GET /test",
          stack: expect.any(String),
        },
        timestamp: expect.any(String),
        path: "/test",
      });
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
