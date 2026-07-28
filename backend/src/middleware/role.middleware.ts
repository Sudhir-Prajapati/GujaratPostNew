import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

/**
 * Middleware to restrict access to routes based on user roles.
 * Super Admin (SUPER_ADMIN) is always allowed access.
 * 
 * @param allowedRoles A single role or an array of allowed roles
 */
export const requireRole = (allowedRoles: Role | Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Ensure user is authenticated
      if (!req.user) {
        throw new UnauthorizedError('Authentication required');
      }

      const userRole = req.user.role as Role;

      // 2. SUPER_ADMIN bypasses all role restrictions
      if (userRole === Role.SUPER_ADMIN) {
        return next();
      }

      // 3. Normalize allowedRoles to an array
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // 4. Check if user's role is allowed
      if (!rolesArray.includes(userRole)) {
        throw new ForbiddenError('Access denied: Insufficient role permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
