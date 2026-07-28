import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

// Augment the Express Request interface to include the user context
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware that authenticates requests using either
 * Next.js proxy headers or direct JWT validation.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Check if headers are propagated by Next.js middleware proxy
    const xUserId = req.headers['x-user-id'];
    const xUserEmail = req.headers['x-user-email'];
    const xUserRole = req.headers['x-user-role'];

    if (xUserId && xUserEmail && xUserRole) {
      req.user = {
        userId: xUserId as string,
        email: xUserEmail as string,
        role: xUserRole as string,
      };
      return next();
    }

    // 2. Otherwise, check for direct JWT cookie or Authorization header
    let token: string | undefined = req.cookies?.access_token;

    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts[0] === 'Bearer' && parts[1]) {
        token = parts[1];
      }
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token missing');
    }

    // 3. Verify JWT
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    next(new UnauthorizedError(error.message || 'Invalid or expired session'));
  }
};
