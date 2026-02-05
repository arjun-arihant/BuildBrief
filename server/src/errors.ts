/**
 * Error Handling Middleware and Custom Errors
 * @module errors
 */

import { Response } from 'express';
import { logger } from './logger';

/**
 * Custom application error
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = 'INTERNAL_ERROR',
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(404, `${resource}${id ? ` (${id})` : ''} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Rate limit error
 */
export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED', { retryAfter });
    this.name = 'RateLimitError';
  }
}

/**
 * Service unavailable error
 */
export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(503, message, 'SERVICE_UNAVAILABLE');
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * AI service error
 */
export class AIServiceError extends AppError {
  constructor(message: string = 'AI service error') {
    super(502, message, 'AI_SERVICE_ERROR');
    this.name = 'AIServiceError';
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
  timestamp: string;
  requestId?: string;
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: any,
  res: Response,
  _next: any
): void {
  const requestId = req.requestId || 'unknown';
  
  // Determine error properties
  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details: Record<string, unknown> | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = 'Invalid request data';
    details = { issues: (err as any).issues };
  } else if ((err as any).code === 'ECONNREFUSED') {
    statusCode = 503;
    errorCode = 'SERVICE_UNAVAILABLE';
    message = 'External service unavailable';
  }

  // Log error
  const logLevel = statusCode >= 500 ? 'error' : 'warn';
  logger[logLevel](
    `Error ${statusCode}: ${message}`,
    err instanceof AppError ? undefined : err,
    {
      statusCode,
      errorCode,
      path: req.path,
      method: req.method,
      requestId,
      ...(err instanceof AppError ? {} : { stack: err.stack })
    },
    requestId
  );

  // Build response
  const response: ErrorResponse = {
    success: false,
    error: {
      message,
      code: errorCode,
      ...(details && Object.keys(details).length > 0 && { details })
    },
    timestamp: new Date().toISOString(),
    requestId
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: any, res: Response): void {
  const requestId = req.requestId || 'unknown';
  
  logger.warn(`Route not found: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path
  }, requestId);

  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'ROUTE_NOT_FOUND'
    },
    timestamp: new Date().toISOString(),
    requestId
  });
}

/**
 * Async handler wrapper to catch errors
 */
export function asyncHandler(fn: Function) {
  return (req: any, res: Response, next: Function) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
