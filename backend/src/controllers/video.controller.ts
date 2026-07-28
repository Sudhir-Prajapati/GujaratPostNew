import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { BadRequestError } from '../utils/errors.js';

export class VideoController {
  /**
   * Fetch all videos with pagination, search query, and type filters.
   */
  static async getAllVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 12);
      const skip = (page - 1) * limit;

      const query = req.query.query as string || '';
      const type = req.query.type as string || '';

      const where: any = {};

      if (query) {
        where.OR = [
          { title: { contains: query } },
          { titleGu: { contains: query } },
          { titleHi: { contains: query } },
          { description: { contains: query } },
        ];
      }

      if (type) {
        where.type = type;
      }

      const [videos, total] = await Promise.all([
        prisma.video.findMany({
          where,
          orderBy: {
            publishedAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.video.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return sendSuccess(res, {
        videos,
        totalPages,
      }, 'Videos list retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a new video entry.
   */
  static async createVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        titleGu,
        titleHi,
        youtubeId,
        type,
        description,
        duration,
        isFeatured,
        channel,
      } = req.body;

      if (!title || !youtubeId) {
        throw new BadRequestError('Title and YouTube Video ID are required.');
      }

      const embedUrl = `https://www.youtube.com/embed/${youtubeId.trim()}`;
      const thumbnail = `https://img.youtube.com/vi/${youtubeId.trim()}/maxresdefault.jpg`;

      const video = await prisma.video.create({
        data: {
          title: title.trim(),
          titleGu: (titleGu || title).trim(),
          titleHi: (titleHi || title).trim(),
          youtubeId: youtubeId.trim(),
          embedUrl,
          thumbnail,
          type: type || 'video',
          description: description ? description.trim() : null,
          duration: duration || '0:00',
          isFeatured: !!isFeatured,
          channel: channel ? channel.trim() : 'Gujarat Post News',
        },
      });

      return sendSuccess(res, video, 'Video added successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update details of an existing video.
   */
  static async updateVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        title,
        titleGu,
        titleHi,
        youtubeId,
        type,
        description,
        duration,
        isFeatured,
        channel,
      } = req.body;

      const existing = await prisma.video.findUnique({ where: { id } });
      if (!existing) {
        throw new BadRequestError('Video not found.');
      }

      const updateData: any = {};

      if (title !== undefined) updateData.title = title.trim();
      if (titleGu !== undefined) updateData.titleGu = titleGu.trim();
      if (titleHi !== undefined) updateData.titleHi = titleHi.trim();
      if (type !== undefined) updateData.type = type;
      if (description !== undefined) updateData.description = description ? description.trim() : null;
      if (duration !== undefined) updateData.duration = duration;
      if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured;
      if (channel !== undefined) updateData.channel = channel.trim();

      if (youtubeId !== undefined && youtubeId.trim() !== existing.youtubeId) {
        updateData.youtubeId = youtubeId.trim();
        updateData.embedUrl = `https://www.youtube.com/embed/${youtubeId.trim()}`;
        updateData.thumbnail = `https://img.youtube.com/vi/${youtubeId.trim()}/maxresdefault.jpg`;
      }

      const updated = await prisma.video.update({
        where: { id },
        data: updateData,
      });

      return sendSuccess(res, updated, 'Video updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a video.
   */
  static async deleteVideo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const existing = await prisma.video.findUnique({ where: { id } });
      if (!existing) {
        throw new BadRequestError('Video not found.');
      }

      await prisma.video.delete({
        where: { id },
      });

      return sendSuccess(res, null, 'Video deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}
