import type { ApiErrorDetail } from "../types/api-response";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: ApiErrorDetail[]
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest = (message: string, details?: ApiErrorDetail[]) => {
    return new AppError(400, "BAD_REQUEST", message, details);
  };

  static unauthorized = (message = "Unauthorized") => {
    return new AppError(401, "UNAUTHORIZED", message);
  };

  static forbidden = (message = "Forbidden") => {
    return new AppError(403, "FORBIDDEN", message);
  };

  static notFound = (message = "Resource not found") => {
    return new AppError(404, "NOT_FOUND", message);
  };

  static tooManyRequests = (message = "Too many requests") => {
    return new AppError(429, "TOO_MANY_REQUESTS", message);
  };

  static serviceUnavailable = (message = "Service unavailable") => {
    return new AppError(503, "SERVICE_UNAVAILABLE", message);
  };
}
