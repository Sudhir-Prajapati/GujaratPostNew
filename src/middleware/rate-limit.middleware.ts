import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis.js';
import { TooManyRequestsError } from '../utils/errors.js';

interface RateLimitOptions {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix: string;
}

/**
 * Creates an IP-based rate limiting middleware using Redis.
 */
export const rateLimiter = (options: RateLimitOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // If Redis is not connected, fall-through (fail-soft to ensure service availability)
    if (!redisClient.isOpen) {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const key = `${options.keyPrefix}:${ip}`;

    try {
      const count = await redisClient.incr(key);

      if (count === 1) {
        // First request in the time window, establish TTL
        await redisClient.expire(key, options.windowSeconds);
      }

      if (count > options.maxRequests) {
        const ttl = await redisClient.ttl(key);
        res.setHeader('Retry-After', ttl > 0 ? ttl : options.windowSeconds);
        return next(new TooManyRequestsError(`Too many requests. Please try again in ${ttl} seconds.`));
      }

      next();
    } catch (error) {
      console.error('Rate limiting middleware error:', error);
      next(); // Fail-soft
    }
  };
};

// Pre-configured login rate limiter: 5 attempts per 15 minutes
export const loginRateLimiter = rateLimiter({
  windowSeconds: 900, // 15 minutes
  maxRequests: 5,
  keyPrefix: 'rate_limit:login',
});
