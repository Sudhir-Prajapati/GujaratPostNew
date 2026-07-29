import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import { sendSuccess } from '../utils/response.js';
import { BadRequestError, UnauthorizedError } from '../utils/errors.js';

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

export class AuthController {
  /**
   * Log in user and set access and refresh token cookies.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError('Email and password are required');
      }

      const userAgent = req.headers['user-agent'] || null;
      const ipAddress = req.ip || req.socket.remoteAddress || null;

      const result = await AuthService.login({
        email,
        password,
        userAgent,
        ipAddress,
      });

      // Set cookies
      res.cookie('access_token', result.accessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.cookie('refresh_token', result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return sendSuccess(
        res,
        { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken },
        'Logged in successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh session using refresh token cookie and rotate cookies.
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        throw new UnauthorizedError('Session expired. Please log in again.');
      }

      const userAgent = req.headers['user-agent'] || null;
      const ipAddress = req.ip || req.socket.remoteAddress || null;

      const result = await AuthService.rotateTokens({
        refreshToken,
        userAgent,
        ipAddress,
      });

      // Update cookies
      res.cookie('access_token', result.accessToken, {
        ...cookieOptions,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.cookie('refresh_token', result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      return sendSuccess(res, { user: result.user }, 'Session renewed successfully');
    } catch (error) {
      // Clear cookies on validation failure
      res.clearCookie('access_token', cookieOptions);
      res.clearCookie('refresh_token', cookieOptions);
      next(error);
    }
  }

  /**
   * Log out of current session and clear cookies.
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }

      // Clear cookies
      res.clearCookie('access_token', cookieOptions);
      res.clearCookie('refresh_token', cookieOptions);

      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Return profile information of the currently logged-in user.
   */
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      // Optionally reload from database to ensure fresh metadata
      const user = await UserRepository.findById(req.user.userId);
      if (!user) {
        throw new UnauthorizedError('User account not found');
      }

      return sendSuccess(
        res,
        {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
            isFirstLogin: user.isFirstLogin,
            authorId: user.author?.id || null,
            authorName: user.author?.name || user.email.split('@')[0],
          },
        },
        'User profile retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete the user's first-time login profile setup.
   * Can only be executed once.
   */
  static async setupProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      const {
        name,
        image,
        designation,
        bio,
        nameGu,
        nameHi,
        designationGu,
        designationHi,
        bioGu,
        bioHi,
      } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new BadRequestError('Display name is required.');
      }
      if (!image || typeof image !== 'string' || image.trim() === '') {
        throw new BadRequestError('Profile picture URL or image is required.');
      }
      if (!designation || typeof designation !== 'string' || designation.trim() === '') {
        throw new BadRequestError('Role/Designation is required.');
      }
      if (!bio || typeof bio !== 'string' || bio.trim() === '') {
        throw new BadRequestError('Biography/Description is required.');
      }

      await AuthService.setupProfile(req.user.userId, {
        name: name.trim(),
        image: image.trim(),
        designation: designation.trim(),
        bio: bio.trim(),
        nameGu: nameGu?.trim(),
        nameHi: nameHi?.trim(),
        designationGu: designationGu?.trim(),
        designationHi: designationHi?.trim(),
        bioGu: bioGu?.trim(),
        bioHi: bioHi?.trim(),
      });

      return sendSuccess(res, null, 'First-time profile setup completed successfully.');
    } catch (error) {
      next(error);
    }
  }
}
