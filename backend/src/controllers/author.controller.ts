import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

export class AuthorController {
  /**
   * Fetch all author profiles.
   */
  static async getAllAuthors(req: Request, res: Response, next: NextFunction) {
    try {
      const authors = await prisma.author.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      return sendSuccess(res, authors, 'Authors list retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }
}
