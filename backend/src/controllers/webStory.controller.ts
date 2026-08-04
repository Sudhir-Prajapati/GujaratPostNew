import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

export class WebStoryController {
  // Get all web stories (admin & public)
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive } = req.query;
      
      const whereClause: any = {};
      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      const stories = await prisma.webStory.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
      });

      return sendSuccess(res, { stories }, 'Web stories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Create a new web story
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { heading, headingGu, headingHi, image1, image2, image3, image4, image5, isActive } = req.body;

      if (!heading || !image1) {
        return res.status(400).json({ success: false, error: 'Heading and Image 1 are required' });
      }

      const story = await prisma.webStory.create({
        data: {
          heading,
          headingGu,
          headingHi,
          image1,
          image2,
          image3,
          image4,
          image5,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      return sendSuccess(res, { story }, 'Web story created successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update a web story
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { heading, headingGu, headingHi, image1, image2, image3, image4, image5, isActive } = req.body;

      const story = await prisma.webStory.update({
        where: { id },
        data: {
          heading,
          headingGu,
          headingHi,
          image1,
          image2,
          image3,
          image4,
          image5,
          isActive,
        },
      });

      return sendSuccess(res, { story }, 'Web story updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete a web story
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.webStory.delete({
        where: { id },
      });
      return sendSuccess(res, null, 'Web story deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
