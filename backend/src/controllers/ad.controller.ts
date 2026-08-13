import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

let tableEnsured = false;
let tableEnsuringPromise: Promise<void> | null = null;

// In-memory ads cache to prevent hitting MySQL on every ad banner render
const adsCache = new Map<string, { timestamp: number; data: any }>();
const ADS_CACHE_TTL_MS = 60 * 1000; // 60 seconds

export function invalidateAdsCache() {
  adsCache.clear();
}

async function ensureAdsTableExists() {
  if (tableEnsured) return;
  if (tableEnsuringPromise) return tableEnsuringPromise;

  tableEnsuringPromise = (async () => {
    try {
      const cols: any[] = await prisma.$queryRawUnsafe(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'advertisements' AND COLUMN_NAME = 'mediaType'`
      );
      if (cols.length === 0) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE \`advertisements\` ADD COLUMN \`mediaType\` VARCHAR(50) NOT NULL DEFAULT 'IMAGE'`
        );
      }
      const randomCols: any[] = await prisma.$queryRawUnsafe(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'advertisements' AND COLUMN_NAME = 'includeInRandom'`
      );
      if (randomCols.length === 0) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE \`advertisements\` ADD COLUMN \`includeInRandom\` TINYINT(1) NOT NULL DEFAULT 0`
        );
      }
    } catch (_) {
      // Ignore if column check or alter fails
    }
  })();

  return tableEnsuringPromise;
}

export class AdController {
  // Get all advertisements (admin & public)
  static async getAllAds(req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'ALL_ADS';
      const cached = adsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ADS_CACHE_TTL_MS) {
        return sendSuccess(res, { ads: cached.data }, 'Advertisements retrieved successfully');
      }

      await ensureAdsTableExists();
      const ads = await (prisma as any).advertisement.findMany({
        orderBy: { createdAt: 'desc' },
      });
      adsCache.set(cacheKey, { timestamp: Date.now(), data: ads });
      return sendSuccess(res, { ads }, 'Advertisements retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  }

  // Get active advertisement by section (public)
  static async getAdBySection(req: Request, res: Response, next: NextFunction) {
    try {
      const { section } = req.params;
      const formattedSection = (section || '').toUpperCase().trim();
      const cacheKey = `AD_${formattedSection}`;

      const cached = adsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ADS_CACHE_TTL_MS) {
        return sendSuccess(res, { ad: cached.data }, 'Section advertisement retrieved successfully');
      }

      await ensureAdsTableExists();
      const ad = await (prisma as any).advertisement.findFirst({
        where: {
          section: formattedSection,
          isActive: true,
        },
      });
      adsCache.set(cacheKey, { timestamp: Date.now(), data: ad });
      return sendSuccess(res, { ad }, 'Section advertisement retrieved successfully');
    } catch (error: any) {
      next(error);
    }
  }

  // Create or update advertisement for a section (admin)
  static async createOrUpdateAd(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureAdsTableExists();
      const { section, title, isActive, mediaType, image1, link1, image2, link2, image3, link3 } = req.body;

      if (!section) {
        return res.status(400).json({ success: false, error: 'Section is required' });
      }

      const formattedSection = section.toUpperCase().trim();

      const existingAd = await (prisma as any).advertisement.findUnique({
        where: { section: formattedSection },
      });

      const parsedMediaType = (mediaType || 'IMAGE').toUpperCase().trim();

      let ad;
      if (existingAd) {
        ad = await (prisma as any).advertisement.update({
          where: { section: formattedSection },
          data: {
            title: title || existingAd.title || `Banner for ${formattedSection}`,
            isActive: isActive !== undefined ? isActive : true,
            mediaType: parsedMediaType,
            image1: image1 !== undefined ? image1 : null,
            link1: link1 !== undefined ? link1 : null,
            image2: image2 !== undefined ? image2 : null,
            link2: link2 !== undefined ? link2 : null,
            image3: image3 !== undefined ? image3 : null,
            link3: link3 !== undefined ? link3 : null,
          },
        });
      } else {
        ad = await (prisma as any).advertisement.create({
          data: {
            section: formattedSection,
            title: title || `Banner for ${formattedSection}`,
            isActive: isActive !== undefined ? isActive : true,
            mediaType: parsedMediaType,
            image1: image1 || null,
            link1: link1 || null,
            image2: image2 || null,
            link2: link2 || null,
            image3: image3 || null,
            link3: link3 || null,
          },
        });
      }

      invalidateAdsCache();
      return sendSuccess(res, { ad }, 'Advertisement saved successfully');
    } catch (error: any) {
      next(error);
    }
  }

  // Delete advertisement
  static async deleteAd(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureAdsTableExists();
      const { id } = req.params;
      await (prisma as any).advertisement.delete({
        where: { id },
      });
      invalidateAdsCache();
      return sendSuccess(res, null, 'Advertisement deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Toggle active status
  static async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureAdsTableExists();
      const { id } = req.params;
      const { isActive } = req.body;

      const ad = await (prisma as any).advertisement.update({
        where: { id },
        data: { isActive: Boolean(isActive) },
      });
      invalidateAdsCache();
      return sendSuccess(res, { ad }, 'Advertisement status updated');
    } catch (error) {
      next(error);
    }
  }

  // Toggle random pool status
  static async toggleIncludeInRandom(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureAdsTableExists();
      const { id } = req.params;
      const { includeInRandom } = req.body;
      const val = includeInRandom ? 1 : 0;

      await prisma.$executeRawUnsafe(
        `UPDATE \`advertisements\` SET \`includeInRandom\` = ? WHERE \`id\` = ?`,
        val,
        id
      );

      const adList: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM \`advertisements\` WHERE \`id\` = ? LIMIT 1`,
        id
      );
      const ad = adList[0] || null;

      return sendSuccess(res, { ad }, 'Random pool status updated');
    } catch (error) {
      next(error);
    }
  }
}
