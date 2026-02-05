/**
 * Request ID and Timing Middleware
 * @module middleware
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

/**
 * Extended Request interface with custom properties
 */
export interface RequestWithContext extends Request {
  requestId: string;
  startTime: number;
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Request ID middleware - assigns unique ID to each request
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = (req.headers['x-request-id'] as string) || generateRequestId();
  
  (req as RequestWithContext).requestId = requestId;
  (req as RequestWithContext).startTime = Date.now();
  
  res.setHeader('X-Request-Id', requestId);
  
  next();
}

/**
 * Request logging middleware
 */
export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const context = req as RequestWithContext;
  const { method, path, query, body } = req;
  
  // Log request start
  logger.info(
    `→ ${method} ${path}`,
    {
      query: Object.keys(query).length > 0 ? query : undefined,
      body: body && Object.keys(body).length > 0 && !path.includes('init') 
        ? '[REDACTED]' // Don't log request bodies that may contain sensitive data
        : undefined
    },
    context.requestId
  );
  
  // Log response finish
  res.on('finish', () => {
    const duration = Date.now() - context.startTime;
    const { statusCode } = res;
    
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    logger[level](
      `← ${method} ${path} ${statusCode} (${duration}ms)`,
      {
        statusCode,
        duration
      },
      context.requestId
    );
  });
  
  next();
}

/**
 * Security headers middleware
 */
export function securityHeadersMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remove X-Powered-By
  res.removeHeader('X-Powered-By');
  
  next();
}

/**
 * CORS validation middleware
 */
export function corsValidationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  if (origin && !allowedOrigins.includes(origin)) {
    const context = req as RequestWithContext;
    logger.warn('CORS blocked request from unauthorized origin', {
      origin,
      allowedOrigins
    }, context.requestId);
  }
  
  next();
}
