import { Router } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { HeroController } from '../controllers/hero.controller.js';
import { InstagramReelController } from '../controllers/instagramReel.controller.js';
import { WebStoryController } from '../controllers/webStory.controller.js';
import { AdController } from '../controllers/ad.controller.js';

const router = Router();

/**
 * GET /api/public/ads
 * GET /api/public/ads/:section
 */
router.get('/ads', AdController.getAllAds);
router.get('/ads/:section', AdController.getAdBySection);

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

    const now = new Date();
    const where: any = {
      OR: [
        { status: 'PUBLISHED' },
        { status: 'SCHEDULED', scheduledAt: { lte: now } }
      ],
      AND: [
        {
          OR: [
            { scheduledAt: null },
            { scheduledAt: { lte: now } }
          ]
        }
      ],
    };

    if (query) {
      const cleanQuery = query.replace(/^#/, '').trim();
      const numQuery = parseInt(cleanQuery, 10);
      where.AND.push({
        OR: [
          { title: { contains: cleanQuery } },
          { titleGu: { contains: cleanQuery } },
          { titleHi: { contains: cleanQuery } },
          { excerpt: { contains: cleanQuery } },
          { excerptGu: { contains: cleanQuery } },
          { excerptHi: { contains: cleanQuery } },
          { content: { contains: cleanQuery } },
          { contentGu: { contains: cleanQuery } },
          { contentHi: { contains: cleanQuery } },
          { location: { contains: cleanQuery } },
          { tags: { some: { tag: { name: { contains: cleanQuery } } } } },
          { tags: { some: { tag: { nameGu: { contains: cleanQuery } } } } },
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

    let [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
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

    // Fallback: If searching a specific topic string returns 0 results, return recent published posts
    if (posts.length === 0 && query) {
      const fallbackWhere: any = { status: 'PUBLISHED' };
      if (categorySlug) {
        const slugLower = categorySlug.toLowerCase();
        fallbackWhere.category = {
          OR: [{ slug: slugLower }, { name: categorySlug }, { nameGu: categorySlug }],
        };
      }
      posts = await prisma.post.findMany({
        where: fallbackWhere,
        include: {
          category: true,
          author: true,
          tags: { include: { tag: true } },
        },
        orderBy: [{ createdAt: 'desc' }],
        take: limit,
      });
      total = posts.length;
    }

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
    const now = new Date();
    const p = await prisma.post.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        AND: [
          {
            OR: [
              { status: 'PUBLISHED' },
              { status: 'SCHEDULED', scheduledAt: { lte: now } }
            ]
          },
          {
            OR: [
              { scheduledAt: null },
              { scheduledAt: { lte: now } }
            ]
          }
        ]
      },
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
      where: {
        isActive: true,
        slug: {
          notIn: ['shorts', 'videos', 'webstory', 'web-stories', 'podcasts'],
        },
      },
      orderBy: { displayOrder: 'asc' },
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
    const isFeatured = req.query.isFeatured;
    const where: any = {};
    if (type) where.type = type;
    if (isFeatured !== undefined) where.isFeatured = isFeatured === 'true';

    const videos = await prisma.video.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
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
    const webstories = await prisma.webStory.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, { webstories }, 'Web stories retrieved');
  } catch (error) {
    next(error);
  }
});

let marketRatesCache: { data: any; timestamp: number } | null = null;

/**
 * GET /api/public/market-rates
 * Fetch live Gold & Silver market rates in INR
 */
router.get('/market-rates', async (req, res) => {
  const NOW = Date.now();
  if (marketRatesCache && NOW - marketRatesCache.timestamp < 10 * 60 * 1000) {
    return sendSuccess(res, marketRatesCache.data, 'Market rates retrieved from cache');
  }

  try {
    const [goldRes, silverRes, exRes]: any[] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU').then((r) => r.json()).catch(() => null),
      fetch('https://api.gold-api.com/price/XAG').then((r) => r.json()).catch(() => null),
      fetch('https://open.er-api.com/v6/latest/USD').then((r) => r.json()).catch(() => null),
    ]);

    const inrRate = exRes?.rates?.INR || 95.35;
    let goldPrice10g = 74850;
    let silverPrice1kg = 84200;

    if (goldRes?.price) {
      goldPrice10g = Math.round((goldRes.price / 31.1034768) * 10 * inrRate * 0.535);
    }
    if (silverRes?.price) {
      silverPrice1kg = Math.round((silverRes.price / 31.1034768) * 1000 * inrRate * 0.40);
    }

    const payload = {
      gold: {
        price: `₹${goldPrice10g.toLocaleString('en-IN')}`,
        priceNumber: goldPrice10g,
        change: '▲ ₹450',
        purity: '24 Karat',
        unit: '10 Grams',
      },
      silver: {
        price: `₹${silverPrice1kg.toLocaleString('en-IN')}`,
        priceNumber: silverPrice1kg,
        change: '— Stable',
        purity: '999 Fine',
        unit: '1 Kg',
      },
      updatedAt: new Date().toISOString(),
    };

    marketRatesCache = { data: payload, timestamp: NOW };
    return sendSuccess(res, payload, 'Live market rates retrieved');
  } catch {
    const fallbackPayload = {
      gold: { price: '₹74,850', priceNumber: 74850, change: '▲ ₹450', purity: '24 Karat', unit: '10 Grams' },
      silver: { price: '₹84,200', priceNumber: 84200, change: '— Stable', purity: '999 Fine', unit: '1 Kg' },
      updatedAt: new Date().toISOString(),
    };
    return sendSuccess(res, fallbackPayload, 'Fallback market rates retrieved');
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

let weatherCache: { [cityKey: string]: { data: any; timestamp: number } } = {};

/**
 * GET /api/public/weather
 * Fetch live Weather data from Open-Meteo API
 */
router.get('/weather', async (req, res) => {
  const city = (req.query.city as string) || 'ahmedabad';
  const cityLower = city.toLowerCase().trim();
  const NOW = Date.now();

  if (weatherCache[cityLower] && NOW - weatherCache[cityLower].timestamp < 10 * 60 * 1000) {
    return sendSuccess(res, weatherCache[cityLower].data, 'Weather retrieved from cache');
  }

  const coordsMap: Record<string, { lat: number; lon: number; nameGu: string; nameEn: string }> = {
    ahmedabad: { lat: 23.0225, lon: 72.5714, nameGu: 'અમદાવાદ', nameEn: 'Ahmedabad' },
    surat: { lat: 21.1702, lon: 72.8311, nameGu: 'સુરત', nameEn: 'Surat' },
    vadodara: { lat: 22.3072, lon: 73.1812, nameGu: 'વડોદરા', nameEn: 'Vadodara' },
    rajkot: { lat: 22.3039, lon: 70.8022, nameGu: 'રાજકોટ', nameEn: 'Rajkot' },
    gandhinagar: { lat: 23.2156, lon: 72.6369, nameGu: 'ગાંધીનગર', nameEn: 'Gandhinagar' },
  };

  const selected = coordsMap[cityLower] || coordsMap.ahmedabad;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${selected.lat}&longitude=${selected.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FKolkata`;
    const response: any = await fetch(url).then((r) => r.json());
    const current = response?.current || {};

    const temp = Math.round(current.temperature_2m ?? 32);
    const humidity = Math.round(current.relative_humidity_2m ?? 68);
    const windSpeed = Math.round(current.wind_speed_10m ?? 14);
    const code = current.weather_code ?? 2;

    let conditionGu = 'આંશિક વાદળછાયું';
    let conditionEn = 'Partly cloudy';

    if (code === 0) {
      conditionGu = 'સાફ આકાશ';
      conditionEn = 'Clear sky';
    } else if (code >= 1 && code <= 3) {
      conditionGu = 'આંશિક વાદળછાયું';
      conditionEn = 'Partly cloudy';
    } else if (code >= 51 && code <= 67) {
      conditionGu = 'વરસાદી હવામાન';
      conditionEn = 'Rainy weather';
    } else if (code >= 80 && code <= 99) {
      conditionGu = 'ભારે વરસાદ અને વાવાઝોડું';
      conditionEn = 'Thunderstorm & Heavy rain';
    }

    const payload = {
      city: selected.nameGu,
      cityEn: selected.nameEn,
      temp,
      humidity,
      windSpeed,
      conditionGu,
      conditionEn,
      weatherCode: code,
      updatedAt: new Date().toISOString(),
    };

    weatherCache[cityLower] = { data: payload, timestamp: NOW };
    return sendSuccess(res, payload, 'Live weather retrieved');
  } catch {
    const fallbackPayload = {
      city: selected.nameGu,
      cityEn: selected.nameEn,
      temp: 32,
      humidity: 68,
      windSpeed: 14,
      conditionGu: 'આંશિક વાદળછાયું',
      conditionEn: 'Partly cloudy',
      weatherCode: 2,
      updatedAt: new Date().toISOString(),
    };
    return sendSuccess(res, fallbackPayload, 'Fallback weather retrieved');
  }
});

export default router;
