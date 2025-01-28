import { describe, it, expect, beforeEach, vi } from "vitest";
import { Response } from "express";
import { Pagination } from "~/types/response";
import { ResponseFormatter } from "../response";

describe("ResponseFormatter", () => {
  let res: Response;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      req: {
        originalUrl: "/test-url",
      },
    } as unknown as Response;
  });

  describe("success", () => {
    it("should format a successful response", () => {
      const data = { key: "value" };
      const message = "Test success";
      const statusCode = 201;
      const pagination: Pagination = {
        page: 100,
        limit: 10,
        totalPages: 0,
        totalItems: 0,
      };

      ResponseFormatter.success({
        res,
        data,
        message,
        statusCode,
        pagination,
      });

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message,
        data,
        timestamp: expect.any(String),
        path: "/test-url",
        pagination,
      });
    });

    it("should format a successful response with default values", () => {
      const data = { key: "value" };

      ResponseFormatter.success({
        res,
        data,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Success",
        data,
        timestamp: expect.any(String),
        path: "/test-url",
      });
    });
  });

  describe("error", () => {
    it("should format an error response", () => {
      const error = { code: "ERR001", message: "Test error" };
      const statusCode = 400;

      ResponseFormatter.error({
        res,
        error,
        statusCode,
      });

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        timestamp: expect.any(String),
        path: "/test-url",
        error,
      });
    });

    it("should format an error response with default status code", () => {
      const error = { code: "ERR001", message: "Test error" };

      ResponseFormatter.error({
        res,
        error,
      });

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        timestamp: expect.any(String),
        path: "/test-url",
        error,
      });
    });
  });
});
