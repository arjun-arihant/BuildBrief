/**
 * Rate Limiting Middleware
 * @module rateLimiter
 */

import { Request, Response, NextFunction } from 'express';
import { RateLimitError } from './errors';
import { logger } from './logger';

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
  handler?: (req: Request, res: Response) => void;
}

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * In-memory store for rate limits
 * Note: Use Redis in production for distributed systems
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Default rate limit configuration
 */
const defaultConfig: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
  skipSuccessfulRequests: false
};

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

/**
 * Generate default key from request
 */
function defaultKeyGenerator(req: Request): string {
  // Use IP address or forwarded IP
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() 
    || req.ip 
    || req.socket.remoteAddress 
    || 'unknown';
  
  return `${ip}:${req.path}`;
}

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const options = { ...defaultConfig, ...config };
  const keyGenerator = options.keyGenerator || defaultKeyGenerator;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    
    let entry = rateLimitStore.get(key);
    
    // Create new entry if expired or doesn't exist
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + options.windowMs
      };
      rateLimitStore.set(key, entry);
    }
    
    // Check limit
    if (entry.count >= options.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      logger.warn('Rate limit exceeded', {
        key,
        path: req.path,
        limit: options.maxRequests,
        window: options.windowMs
      }, (req as any).requestId);
      
      res.setHeader('Retry-After', retryAfter);
      res.setHeader('X-RateLimit-Limit', options.maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));
      
      if (options.handler) {
        options.handler(req, res);
        return;
      }
      
      throw new RateLimitError(retryAfter);
    }
    
    // Increment counter
    entry.count++;
    
    // Set headers
    res.setHeader('X-RateLimit-Limit', options.maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, options.maxRequests - entry.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));
    
    next();
  };
}

/**
 * Stricter rate limiter for AI endpoints
 */
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // 10 AI requests per minute
});

/**
 * Standard rate limiter for general API
 */
export const standardRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60 // 60 requests per minute
});

/**
 * Lenient rate limiter for status/health checks
 */
export const lenientRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 120 // 120 requests per minute
});
