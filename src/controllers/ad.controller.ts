import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

let tableCreated = false;

async function ensureAdsTableExists() {
  if (tableCreated) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`advertisements\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`section\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(191) NULL,
        \`isActive\` TINYINT(1) NOT NULL DEFAULT 1,
        \`mediaType\` VARCHAR(50) NOT NULL DEFAULT 'IMAGE',
        \`image1\` TEXT NULL,
        \`link1\` TEXT NULL,
        \`image2\` TEXT NULL,
        \`link2\` TEXT NULL,
        \`image3\` TEXT NULL,
        \`link3\` TEXT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`advertisements_section_key\` (\`section\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure mediaType column exists if table was created previously without it
    // Use INFORMATION_SCHEMA check to avoid Prisma internal error logs on duplicate column
    try {
      const cols: any[] = await prisma.$queryRawUnsafe(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'advertisements' AND COLUMN_NAME = 'mediaType'`
      );
      if (cols.length === 0) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE \`advertisements\` ADD COLUMN \`mediaType\` VARCHAR(50) NOT NULL DEFAULT 'IMAGE'`
        );
      }
    } catch (_) {
      // Ignore if column check or alter fails
    }

    tableCreated = true;
  } catch (err) {
    console.error('Auto create advertisements table error:', err);
  }
}

export class AdController {
  // Get all advertisements (admin & public)
  static async getAllAds(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureAdsTableExists();
      const ads = await (prisma as any).advertisement.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return sendSuccess(res, { ads }, 'Advertisements retrieved successfully');
    } catch (error: any) {
      if (error?.message?.includes('does not exist')) {
        await ensureAdsTableExists();
        try {
          const ads = await (prisma as any).advertisement.findMany({
            orderBy: { createdAt: 'desc' },
          });
          return sendSuccess(res, { ads }, 'Advertisements retrieved successfully');
        } catch (retryErr) {
          return next(retryErr);
        }
      }
      next(error);
    }
  }

  // Get active advertisement by section (public)
  static async getAdBySection(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureAdsTableExists();
      const { section } = req.params;
      const ad = await (prisma as any).advertisement.findFirst({
        where: {
          section: section.toUpperCase(),
          isActive: true,
        },
      });
      return sendSuccess(res, { ad }, 'Section advertisement retrieved successfully');
    } catch (error: any) {
      if (error?.message?.includes('does not exist')) {
        await ensureAdsTableExists();
        try {
          const { section } = req.params;
          const ad = await (prisma as any).advertisement.findFirst({
            where: {
              section: section.toUpperCase(),
              isActive: true,
            },
          });
          return sendSuccess(res, { ad }, 'Section advertisement retrieved successfully');
        } catch (retryErr) {
          return next(retryErr);
        }
      }
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

      return sendSuccess(res, { ad }, 'Advertisement saved successfully');
    } catch (error: any) {
      if (error?.message?.includes('does not exist')) {
        await ensureAdsTableExists();
        try {
          const { section, title, isActive, mediaType, image1, link1, image2, link2, image3, link3 } = req.body;
          const formattedSection = section.toUpperCase().trim();
          const parsedMediaType = (mediaType || 'IMAGE').toUpperCase().trim();

          const existingAd = await (prisma as any).advertisement.findUnique({
            where: { section: formattedSection },
          });

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

          return sendSuccess(res, { ad }, 'Advertisement saved successfully');
        } catch (retryErr) {
          return next(retryErr);
        }
      }
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

      return sendSuccess(res, { ad }, 'Advertisement status updated');
    } catch (error) {
      next(error);
    }
  }
}
