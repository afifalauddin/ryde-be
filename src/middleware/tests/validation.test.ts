import { describe, it, expect, vi, beforeEach } from "vitest";
import { Request, Response, NextFunction } from "express";
import { validate } from "../validation.middleware";
import { z } from "zod";

describe("Validation Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
      params: {},
    };

    mockResponse = {
      error: vi.fn(),
    };

    nextFunction = vi.fn();
  });

  describe("validate", () => {
    it("should call next() when validation succeeds for body", async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      mockRequest.body = {
        name: "John",
        age: 25,
      };

      const middleware = validate(schema);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.error).not.toHaveBeenCalled();
    });

    it("should call res.error() when validation fails for body", async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      mockRequest.body = {
        name: "John",
        age: "25", // Should be number
      };

      const middleware = validate(schema);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.error).toHaveBeenCalled();
    });

    it("should validate query parameters when target is query", async () => {
      const schema = z.object({
        search: z.string(),
        page: z.string(),
      });

      mockRequest.query = {
        search: "test",
        page: "1",
      };

      const middleware = validate(schema, "query");
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.error).not.toHaveBeenCalled();
    });

    it("should validate route parameters when target is params", async () => {
      const schema = z.object({
        id: z.string(),
      });

      mockRequest.params = {
        id: "123",
      };

      const middleware = validate(schema, "params");
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.error).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors during validation", async () => {
      const schema = z.object({
        data: z.unknown(),
      });

      // Simulate an unexpected error
      const error = new Error("Unexpected error");
      mockRequest.body = {
        get data() {
          throw error;
        },
      };

      const middleware = validate(schema);
      await middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction,
      );

      expect(nextFunction).not.toHaveBeenCalled();
      expect(mockResponse.error).toHaveBeenCalledWith(error);
    });
  });
});
