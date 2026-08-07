import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { BadRequestError } from '../utils/errors.js';

/**
 * Extract a clean 11-char YouTube video ID from any URL format.
 * Supports: watch?v=, youtu.be/, /shorts/, /embed/, bare ID
 */
function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const m = trimmed.match(pattern);
    if (m?.[1]) return m[1];
  }
  return trimmed;
}

export class VideoController {
  /**
   * Fetch all videos with pagination, search query, type, and category filters.
   */
  static async getAllVideos(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 12);
      const skip = (page - 1) * limit;

      const query = req.query.query as string || '';
      const type = req.query.type as string || '';
      const categoryId = req.query.categoryId as string || '';

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

      if (categoryId) {
        where.categoryId = categoryId;
      }

      const [videos, total] = await Promise.all([
        prisma.video.findMany({
          where,
          include: {
            category: {
              select: { id: true, name: true, nameGu: true, nameHi: true, slug: true, color: true },
            },
          },
          orderBy: [
            { isFeatured: 'desc' },
            { createdAt: 'desc' },
          ],
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
        categoryId,
        categoryName,
      } = req.body;

      if (!title || !youtubeId) {
        throw new BadRequestError('Title and YouTube Video ID are required.');
      }

      // Normalize: extract bare ID from any YouTube URL format
      const cleanId = extractYouTubeId(youtubeId);
      const embedUrl = `https://www.youtube.com/embed/${cleanId}`;
      const thumbnail = `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;

      let finalCategoryName = categoryName || null;
      if (categoryId && !finalCategoryName) {
        const cat = await prisma.category.findUnique({ where: { id: categoryId } });
        if (cat) finalCategoryName = cat.name;
      }

      const video = await prisma.video.create({
        data: {
          title: title.trim(),
          titleGu: (titleGu || title).trim(),
          titleHi: (titleHi || title).trim(),
          youtubeId: cleanId,
          embedUrl,
          thumbnail,
          type: type || 'video',
          description: description ? description.trim() : null,
          duration: duration || '0:00',
          isFeatured: !!isFeatured,
          channel: channel ? channel.trim() : 'Gujarat Post News',
          categoryId: categoryId || null,
          categoryName: finalCategoryName,
        },
        include: {
          category: true,
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
        categoryId,
        categoryName,
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
      if (categoryId !== undefined) {
        updateData.categoryId = categoryId || null;
        if (categoryId) {
          const cat = await prisma.category.findUnique({ where: { id: categoryId } });
          updateData.categoryName = cat ? cat.name : (categoryName || null);
        } else {
          updateData.categoryName = null;
        }
      }
      if (isFeatured !== undefined) {
        const newFeatured = !!isFeatured;
        if (!newFeatured && existing.isFeatured) {
          const featuredCount = await prisma.video.count({ where: { isFeatured: true } });
          if (featuredCount <= 3) {
            throw new BadRequestError('Minimum 3 featured videos are compulsory for the homepage layout! Please feature another video before unfeaturing this one.');
          }
        }
        updateData.isFeatured = newFeatured;
      }
      if (channel !== undefined) updateData.channel = channel.trim();

      if (youtubeId !== undefined) {
        const cleanId = extractYouTubeId(youtubeId);
        if (cleanId !== existing.youtubeId) {
          updateData.youtubeId = cleanId;
          updateData.embedUrl = `https://www.youtube.com/embed/${cleanId}`;
          updateData.thumbnail = `https://img.youtube.com/vi/${cleanId}/maxresdefault.jpg`;
        }
      }

      const updated = await prisma.video.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
        },
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

      if (existing.isFeatured) {
        const featuredCount = await prisma.video.count({ where: { isFeatured: true } });
        if (featuredCount <= 3) {
          throw new BadRequestError('Minimum 3 featured videos are compulsory for the homepage layout! You cannot delete a featured video when only 3 featured videos exist.');
        }
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
