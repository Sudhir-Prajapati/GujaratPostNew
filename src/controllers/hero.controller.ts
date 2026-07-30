import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

function formatPost(p: any) {
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    articleNumber: p.articleNumber,
    title: p.title,
    titleGu: p.titleGu,
    titleHi: p.titleHi,
    excerpt: p.excerpt || '',
    excerptGu: p.excerptGu || '',
    excerptHi: p.excerptHi || '',
    content: p.content,
    contentGu: p.contentGu,
    contentHi: p.contentHi,
    image: p.featuredImage,
    featuredImage: p.featuredImage,
    category: p.category?.name || '',
    categoryGu: p.category?.nameGu || '',
    categoryHi: p.category?.nameHi || '',
    author: p.author ? {
      id: p.author.id,
      name: p.author.name,
      nameGu: p.author.nameGu,
      nameHi: p.author.nameHi,
      image: p.author.image,
    } : null,
    isFeatured: p.isFeatured,
    isTrending: p.isTrending,
    isBreaking: p.isBreaking,
    readingTime: p.readingTime,
    publishedAt: p.publishedAt || p.createdAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export class HeroController {
  /**
   * Get hero section slots settings and resolved articles
   */
  static async getHeroSettings(req: Request, res: Response, next: NextFunction) {
    try {
      let heroSetting = await prisma.heroSetting.findUnique({
        where: { id: 'default' },
      });

      let slot1Id = heroSetting?.slot1Id;
      let slot2Id = heroSetting?.slot2Id;
      let slot3Id = heroSetting?.slot3Id;

      // If heroSetting doesn't exist or is empty, fallback to currently featured posts or top published posts
      if (!slot1Id && !slot2Id && !slot3Id) {
        const featuredPosts = await prisma.post.findMany({
          where: { isFeatured: true, status: 'PUBLISHED' },
          orderBy: { createdAt: 'asc' },
          take: 3,
        });

        slot1Id = featuredPosts[0]?.id || null;
        slot2Id = featuredPosts[1]?.id || null;
        slot3Id = featuredPosts[2]?.id || null;
      }

      const targetIds = [slot1Id, slot2Id, slot3Id].filter((id): id is string => Boolean(id));

      const postsMap = new Map<string, any>();
      if (targetIds.length > 0) {
        const posts = await prisma.post.findMany({
          where: { id: { in: targetIds } },
          include: {
            category: true,
            author: true,
          },
        });
        posts.forEach((p) => postsMap.set(p.id, formatPost(p)));
      }

      const slots = [
        slot1Id ? postsMap.get(slot1Id) || null : null,
        slot2Id ? postsMap.get(slot2Id) || null : null,
        slot3Id ? postsMap.get(slot3Id) || null : null,
      ];

      const DEFAULT_TOPICS = ['ચૂંટણી 2026', 'વરસાદ', 'સોના-ચાંદી', 'ક્રિકેટ', 'મેટ્રો', 'સેમિકન્ડક્ટર', 'ડાયમંડ ઉદ્યોગ', 'ટ્રાફિક'];

      let parsedTopics = DEFAULT_TOPICS;
      if (heroSetting?.trendingTopics) {
        try {
          parsedTopics = JSON.parse(heroSetting.trendingTopics);
        } catch {
          parsedTopics = heroSetting.trendingTopics.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }

      let parsedTrendingNewsIds: string[] = [];
      if (heroSetting?.trendingNewsIds) {
        try {
          parsedTrendingNewsIds = JSON.parse(heroSetting.trendingNewsIds);
        } catch {
          parsedTrendingNewsIds = [];
        }
      }

      let trendingNewsArticles: any[] = [];
      if (parsedTrendingNewsIds.length > 0) {
        const posts = await prisma.post.findMany({
          where: { id: { in: parsedTrendingNewsIds }, status: 'PUBLISHED' },
          include: { category: true, author: true },
        });
        const map = new Map<string, any>();
        posts.forEach((p) => map.set(p.id, formatPost(p)));
        trendingNewsArticles = parsedTrendingNewsIds
          .map((id) => map.get(id))
          .filter(Boolean);
      }

      return sendSuccess(res, {
        setting: {
          ...(heroSetting || { id: 'default', slot1Id, slot2Id, slot3Id }),
          trendingTopics: parsedTopics,
          trendingNewsIds: parsedTrendingNewsIds,
        },
        slots,
        trendingTopics: parsedTopics,
        trendingNewsIds: parsedTrendingNewsIds,
        trendingNewsArticles,
      }, 'Hero section settings retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update hero section slot articles, trending topics, and trending news articles
   */
  static async updateHeroSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { slot1Id, slot2Id, slot3Id, trendingTopics, trendingNewsIds } = req.body;

      const topicsStr = Array.isArray(trendingTopics)
        ? JSON.stringify(trendingTopics)
        : typeof trendingTopics === 'string'
        ? trendingTopics
        : null;

      const newsIdsStr = Array.isArray(trendingNewsIds)
        ? JSON.stringify(trendingNewsIds)
        : typeof trendingNewsIds === 'string'
        ? trendingNewsIds
        : null;

      const updatedSetting = await prisma.heroSetting.upsert({
        where: { id: 'default' },
        update: {
          slot1Id: slot1Id || null,
          slot2Id: slot2Id || null,
          slot3Id: slot3Id || null,
          trendingTopics: topicsStr,
          trendingNewsIds: newsIdsStr,
        },
        create: {
          id: 'default',
          slot1Id: slot1Id || null,
          slot2Id: slot2Id || null,
          slot3Id: slot3Id || null,
          trendingTopics: topicsStr,
          trendingNewsIds: newsIdsStr,
        },
      });

      const featuredIds = [slot1Id, slot2Id, slot3Id].filter((id): id is string => Boolean(id));

      // Mark the selected slot articles as isFeatured: true
      if (featuredIds.length > 0) {
        await prisma.post.updateMany({
          where: { id: { in: featuredIds } },
          data: { isFeatured: true },
        });
      }

      // Mark all other articles as isFeatured: false
      await prisma.post.updateMany({
        where: { id: { notIn: featuredIds } },
        data: { isFeatured: false },
      });

      // Update isTrending flag for assigned trending news articles
      if (Array.isArray(trendingNewsIds) && trendingNewsIds.length > 0) {
        await prisma.post.updateMany({
          where: { id: { in: trendingNewsIds } },
          data: { isTrending: true },
        });
      }

      let parsedTopics = ['ચૂંટણી 2026', 'વરસાદ', 'સોના-ચાંદી', 'ક્રિકેટ', 'મેટ્રો', 'સેમિકન્ડક્ટર', 'ડાયમંડ ઉદ્યોગ', 'ટ્રાફિક'];
      if (updatedSetting.trendingTopics) {
        try {
          parsedTopics = JSON.parse(updatedSetting.trendingTopics);
        } catch {
          parsedTopics = updatedSetting.trendingTopics.split(',').map((t) => t.trim()).filter(Boolean);
        }
      }

      let parsedTrendingNewsIds: string[] = [];
      if (updatedSetting.trendingNewsIds) {
        try {
          parsedTrendingNewsIds = JSON.parse(updatedSetting.trendingNewsIds);
        } catch {
          parsedTrendingNewsIds = [];
        }
      }

      const postsMap = new Map<string, any>();
      if (featuredIds.length > 0) {
        const posts = await prisma.post.findMany({
          where: { id: { in: featuredIds } },
          include: { category: true, author: true },
        });
        posts.forEach((p) => postsMap.set(p.id, formatPost(p)));
      }

      const slots = [
        slot1Id ? postsMap.get(slot1Id) || null : null,
        slot2Id ? postsMap.get(slot2Id) || null : null,
        slot3Id ? postsMap.get(slot3Id) || null : null,
      ];

      let trendingNewsArticles: any[] = [];
      if (parsedTrendingNewsIds.length > 0) {
        const posts = await prisma.post.findMany({
          where: { id: { in: parsedTrendingNewsIds }, status: 'PUBLISHED' },
          include: { category: true, author: true },
        });
        const map = new Map<string, any>();
        posts.forEach((p) => map.set(p.id, formatPost(p)));
        trendingNewsArticles = parsedTrendingNewsIds
          .map((id) => map.get(id))
          .filter(Boolean);
      }

      return sendSuccess(res, {
        setting: {
          ...updatedSetting,
          trendingTopics: parsedTopics,
          trendingNewsIds: parsedTrendingNewsIds,
        },
        slots,
        trendingTopics: parsedTopics,
        trendingNewsIds: parsedTrendingNewsIds,
        trendingNewsArticles,
      }, 'Hero section settings updated successfully.');
    } catch (error) {
      next(error);
    }
  }
}
