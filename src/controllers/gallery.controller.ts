import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { BadRequestError } from '../utils/errors.js';

export class GalleryController {
  /**
   * Fetch all gallery photos with pagination and search.
   */
  static async getAllPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 12);
      const skip = (page - 1) * limit;

      const query = req.query.query as string || '';

      const where: any = {};

      if (query) {
        where.OR = [
          { alt: { contains: query } },
          { caption: { contains: query } },
          { captionGu: { contains: query } },
          { captionHi: { contains: query } },
          { photographer: { contains: query } },
        ];
      }

      const [photos, total] = await Promise.all([
        prisma.galleryPhoto.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.galleryPhoto.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return sendSuccess(res, {
        photos,
        totalPages,
      }, 'Gallery photos list retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a new photo metadata to database.
   */
  static async createPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        src,
        alt,
        caption,
        captionGu,
        captionHi,
        photographer,
        copyright,
      } = req.body;

      if (!src) {
        throw new BadRequestError('Source image URL (src) is required.');
      }

      const photo = await prisma.galleryPhoto.create({
        data: {
          src: src.trim(),
          alt: alt ? alt.trim() : 'Gujarat Post Gallery',
          caption: (caption || '').trim(),
          captionGu: (captionGu || caption || '').trim(),
          captionHi: (captionHi || caption || '').trim(),
          photographer: photographer ? photographer.trim() : 'Staff',
          copyright: copyright ? copyright.trim() : '© Gujarat Post',
        },
      });

      return sendSuccess(res, photo, 'Photo added to gallery successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update details of an existing photo in the gallery.
   */
  static async updatePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        src,
        alt,
        caption,
        captionGu,
        captionHi,
        photographer,
        copyright,
      } = req.body;

      const existing = await prisma.galleryPhoto.findUnique({ where: { id } });
      if (!existing) {
        throw new BadRequestError('Photo not found.');
      }

      const updateData: any = {};

      if (src !== undefined) updateData.src = src.trim();
      if (alt !== undefined) updateData.alt = alt.trim();
      if (caption !== undefined) updateData.caption = caption.trim();
      if (captionGu !== undefined) updateData.captionGu = captionGu.trim();
      if (captionHi !== undefined) updateData.captionHi = captionHi.trim();
      if (photographer !== undefined) updateData.photographer = photographer.trim();
      if (copyright !== undefined) updateData.copyright = copyright.trim();

      const updated = await prisma.galleryPhoto.update({
        where: { id },
        data: updateData,
      });

      return sendSuccess(res, updated, 'Photo details updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a photo from the database.
   */
  static async deletePhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const existing = await prisma.galleryPhoto.findUnique({ where: { id } });
      if (!existing) {
        throw new BadRequestError('Photo not found.');
      }

      await prisma.galleryPhoto.delete({
        where: { id },
      });

      return sendSuccess(res, null, 'Photo deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}
