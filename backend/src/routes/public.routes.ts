import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { HeroController } from '../controllers/hero.controller.js';
import { InstagramReelController } from '../controllers/instagramReel.controller.js';
import { WebStoryController } from '../controllers/webStory.controller.js';

const router = Router();

/**
 * GET /api/public/hero-settings
 * Get hero section settings and assigned articles in exact slot order
 */
router.get('/hero-settings', HeroController.getHeroSettings);


/**
 * GET /api/public/articles
 * Fetch articles list directly from MySQL database with optional filters
 */
router.get('/articles', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 120);
    const skip = (page - 1) * limit;

    const query = (req.query.query as string) || '';
    const categorySlug = (req.query.categorySlug as string) || '';
    const isTrending = req.query.isTrending === 'true';
    const isBreaking = req.query.isBreaking === 'true';
    const isFeatured = req.query.isFeatured === 'true';

    const where: any = {
      status: 'PUBLISHED', // Only show published articles on the public site
      AND: [],
    };

    if (query) {
      const cleanQuery = query.replace(/^#/, '').trim();
      const numQuery = parseInt(cleanQuery, 10);
      where.AND.push({
        OR: [
          { title: { contains: query } },
          { titleGu: { contains: query } },
          { titleHi: { contains: query } },
          { content: { contains: query } },
          ...(!isNaN(numQuery) && numQuery > 0 ? [{ articleNumber: numQuery }] : []),
        ],
      });
    }

    const locationParam = (req.query.location as string) || '';

    if (locationParam) {
      where.location = { contains: locationParam };
    }

    if (categorySlug) {
      const slugLower = categorySlug.toLowerCase();
      where.AND.push({
        category: {
          OR: [
            { slug: slugLower },
            { name: categorySlug },
            { nameGu: categorySlug },
          ],
        },
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    if (isTrending) where.isTrending = true;
    if (isBreaking) where.isBreaking = true;
    if (isFeatured) where.isFeatured = true;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
        // When fetching featured articles, use stable createdAt asc so slot order
        // doesn't shuffle every time isFeatured is toggled (which updates updatedAt).
        // For normal listings, use latest-first (updatedAt desc).
        orderBy: isFeatured
          ? [{ createdAt: 'asc' }]
          : [
              { articleNumber: 'desc' },
              { createdAt: 'desc' },
              { priority: 'desc' },
            ],
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const articles = posts.map((p) => ({
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
      category: p.category.name,
      categoryGu: p.category.nameGu,
      categoryHi: p.category.nameHi,
      location: p.location || null,
      tags: (p.tags as any[]).map((t: any) => t.name || t.tag?.name || ''),
      tagsGu: (p.tags as any[]).map((t: any) => t.nameGu || t.tag?.nameGu || ''),
      tagsHi: (p.tags as any[]).map((t: any) => t.nameHi || t.tag?.nameHi || ''),
      author: {
        id: p.author.id,
        name: p.author.name,
        nameGu: p.author.nameGu,
        nameHi: p.author.nameHi,
        image: p.author.image,
        designation: p.author.designation,
        designationGu: p.author.designationGu,
        designationHi: p.author.designationHi,
        bio: p.author.bio,
        bioGu: p.author.bioGu,
        bioHi: p.author.bioHi,
      },
      publishedAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      readingTime: p.readingTime,
      isTrending: p.isTrending,
      isBreaking: p.isBreaking,
      isFeatured: p.isFeatured,
      views: p.views,
    }));

    return sendSuccess(res, { articles, total, totalPages: Math.ceil(total / limit) }, 'Public articles retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/articles/:slug
 * Fetch single article details by slug or ID
 */
router.get('/articles/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const p = await prisma.post.findFirst({
      where: { OR: [{ slug }, { id: slug }], status: 'PUBLISHED' },
      include: {
        category: true,
        author: true,
        tags: { include: { tag: true } },
      },
    });

    if (!p) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const article = {
      id: p.id,
      slug: p.slug,
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
      category: p.category.name,
      categoryGu: p.category.nameGu,
      categoryHi: p.category.nameHi,
      location: p.location || null,
      tags: (p.tags as any[]).map((t: any) => t.name || t.tag?.name || ''),
      tagsGu: (p.tags as any[]).map((t: any) => t.nameGu || t.tag?.nameGu || ''),
      tagsHi: (p.tags as any[]).map((t: any) => t.nameHi || t.tag?.nameHi || ''),
      author: {
        id: p.author.id,
        name: p.author.name,
        nameGu: p.author.nameGu,
        nameHi: p.author.nameHi,
        image: p.author.image,
        designation: p.author.designation,
        designationGu: p.author.designationGu,
        designationHi: p.author.designationHi,
        bio: p.author.bio,
        bioGu: p.author.bioGu,
        bioHi: p.author.bioHi,
      },
      publishedAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      readingTime: p.readingTime,
      isTrending: p.isTrending,
      isBreaking: p.isBreaking,
      isFeatured: p.isFeatured,
      views: p.views,
    };

    return sendSuccess(res, { article }, 'Article details retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/public/articles/:id/view
 * Increment article view count
 */
router.post('/articles/:id/view', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: { id: true, views: true },
    });
    return sendSuccess(res, { views: updated.views }, 'View count incremented');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/authors
 * Fetch list of authors
 */
router.get('/authors', async (req, res, next) => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, { authors }, 'Authors retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/categories
 * Fetch list of categories
 */
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return sendSuccess(res, { categories }, 'Categories retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/videos
 * Fetch videos list
 */
router.get('/videos', async (req, res, next) => {
  try {
    const type = req.query.type as string;
    const where: any = {};
    if (type) where.type = type;

    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, { videos }, 'Videos retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/gallery
 * Fetch photo gallery photos
 */
router.get('/gallery', async (req, res, next) => {
  try {
    const photos = await prisma.galleryPhoto.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, { photos }, 'Gallery photos retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/stories
 * Fetch Instagram stories with slides
 */
router.get('/stories', async (req, res, next) => {
  try {
    const stories = await prisma.instagramStory.findMany({
      include: { slides: true },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, { stories }, 'Instagram stories retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/webstories
 * Fetch web stories
 */
router.get('/webstories', async (req, res, next) => {
  try {
    const webStories = await prisma.webStory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, { webStories }, 'Web stories retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/tickers
 * Fetch breaking ticker items
 */
router.get('/tickers', async (req, res, next) => {
  try {
    const tickers = await prisma.breakingTickerItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, { tickers }, 'Breaking tickers retrieved');
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/public/astrology
 * Fetch Astrology signs predictions
 */
router.get('/astrology', async (req, res, next) => {
  try {
    const signs = await prisma.astrologySign.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return sendSuccess(res, { signs }, 'Astrology signs retrieved');
  } catch (error) {
    next(error);
  }
});
/**
 * GET /api/public/reels
 * Fetch active Instagram reels
 */
router.get('/reels', InstagramReelController.getAllReels);

/**
 * GET /api/public/web-stories
 * Fetch active Web Stories
 */
router.get('/web-stories', WebStoryController.getAll);

export default router;
