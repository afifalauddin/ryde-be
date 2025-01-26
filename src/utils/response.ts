import { Response } from "express";
import { Pagination } from "~/types/response";

// ResponseFormatter class to format response so that it would be consistent across the application
export class ResponseFormatter {
  static success({
    res,
    data,
    message = "Success",
    statusCode = 200,
    pagination,
  }: {
    res: Response;
    data: unknown;
    message?: string;
    statusCode?: number;
    pagination?: Pagination;
  }) {
    const response = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      ...(pagination && { pagination }),
    };

    return res.status(statusCode).json(response);
  }

  static error({
    res,
    error,
    statusCode = 500,
  }: {
    res: Response;
    error: {
      code: string;
      message: string;
      details?: unknown;
    };
    statusCode?: number;
  }) {
    const response = {
      success: false,
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
      error,
    };

    return res.status(statusCode).json(response);
  }
}
