/**
 * Custom API Error class for handling HTTP errors with status codes and error details
 * @extends Error
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code = "BAD_REQUEST", details?: unknown) {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(
    message: string,
    code = "UNAUTHORIZED",
    details?: unknown,
  ) {
    return new ApiError(401, code, message, details);
  }

  static forbidden(message: string, code = "FORBIDDEN", details?: unknown) {
    return new ApiError(403, code, message, details);
  }

  static notFound(message: string, code = "NOT_FOUND", details?: unknown) {
    return new ApiError(404, code, message, details);
  }

  static methodNotAllowed(
    message: string,
    code = "METHOD_NOT_ALLOWED",
    details?: unknown,
  ) {
    return new ApiError(405, code, message, details);
  }

  static conflict(message: string, code = "CONFLICT", details?: unknown) {
    return new ApiError(409, code, message, details);
  }

  static tooMany(
    message: string,
    code = "TOO_MANY_REQUESTS",
    details?: unknown,
  ) {
    return new ApiError(429, code, message, details);
  }

  static internal(
    message = "Internal server error",
    code = "INTERNAL_ERROR",
    details?: unknown,
  ) {
    return new ApiError(500, code, message, details);
  }
}
