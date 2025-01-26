declare global {
  namespace Express {
    export interface Response {
      success(data: unknown, statusCode?: number, message?: string): Response;
      successWithPagination(
        data: unknown,
        pagination: {
          page: number;
          limit: number;
          totalItems: number;
          totalPages: number;
        },
        message?: string,
        statusCode?: number,
      ): Response;
      error(error: unknown, statusCode?: number): Response;
    }

    export interface Locals {
      error?: {
        code: string;
        message: string;
        details?: unknown;
        stack?: string;
      };
    }
  }
}

export {};
