import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

export class StatsController {
  /**
   * Get dashboard stats aggregate details.
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [
        totalArticles,
        publishedArticles,
        draftArticles,
        pendingReviewArticles,
        viewsAggregate,
        authorsCount,
        categoriesCount,
        galleryImagesCount,
        videosCount,
        activeSessions,
        recentDrafts,
        pendingReporterArticles,
        recentlyPublished,
        trendingArticles,
        recentUsers,
      ] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { status: 'PUBLISHED' } }),
        prisma.post.count({ where: { status: 'DRAFT' } }),
        prisma.post.count({ where: { status: 'IN_REVIEW' } }),
        prisma.post.aggregate({
          _sum: {
            views: true,
          },
        }),
        prisma.author.count(),
        prisma.category.count(),
        prisma.galleryPhoto.count(),
        prisma.video.count(),
        prisma.session.count({
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
        }),
        // Recents queries
        prisma.post.findMany({
          where: { status: 'DRAFT' },
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: { category: true, author: true },
        }),
        prisma.post.findMany({
          where: { status: 'IN_REVIEW' },
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: { category: true, author: true },
        }),
        prisma.post.findMany({
          where: { status: 'PUBLISHED' },
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: { category: true, author: true },
        }),
        prisma.post.findMany({
          where: { isTrending: true },
          take: 5,
          orderBy: { updatedAt: 'desc' },
          include: { category: true, author: true },
        }),
        prisma.user.findMany({
          take: 5,
          orderBy: { updatedAt: 'desc' },
        }),
      ]);

      // Mock logs using actual recent users to populate the activity list dynamically
      const recentLogs = recentUsers.map((user, idx) => {
        const actions = ['USER_LOGIN', 'PROFILE_UPDATE', 'SESSION_REFRESH', 'CONTENT_VIEW'];
        const action = actions[idx % actions.length];
        return {
          id: `log-${user.id}-${idx}`,
          action,
          entity: 'User',
          entityId: user.id,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          createdAt: user.updatedAt.toISOString(),
          userEmail: user.email,
          userRole: user.role,
        };
      });

      const stats = {
        articles: {
          total: totalArticles,
          published: publishedArticles,
          draft: draftArticles,
          pendingReview: pendingReviewArticles,
        },
        views: viewsAggregate._sum.views || 0,
        authors: authorsCount,
        categories: categoriesCount,
        galleryImages: galleryImagesCount,
        videos: videosCount,
        activeSessions,
        recentLogs,
        recentDrafts,
        pendingReporterArticles,
        recentlyPublished,
        trendingArticles,
      };

      return sendSuccess(res, stats, 'Dashboard metrics compiled successfully.');
    } catch (error) {
      next(error);
    }
  }
}
