import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { randomUUID } from 'crypto';
import { seedEpaperArticlesData } from '../scripts/seedEpaperData.js';

function sanitizePdfUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('blob:')) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/raw/upload/').replace('/fl_attachment/', '/');
  }
  return url;
}

function sanitizeThumbUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('blob:')) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/raw/upload/') && !url.toLowerCase().endsWith('.pdf')) {
    return url.replace('/raw/upload/', '/image/upload/');
  }
  return url;
}

let epaperTablesEnsured = false;
export async function ensureEPaperTablesExist() {
  if (epaperTablesEnsured) return;
  try {
    // 1. Editions table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`epaper_editions\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`title\` VARCHAR(255) NOT NULL DEFAULT 'City Edition',
        \`city\` VARCHAR(255) NOT NULL,
        \`cityGu\` VARCHAR(255) NULL,
        \`cityHi\` VARCHAR(255) NULL,
        \`date\` VARCHAR(50) NOT NULL,
        \`pages\` INT NOT NULL DEFAULT 14,
        \`fileUrl\` LONGTEXT NOT NULL,
        \`thumbnailUrl\` LONGTEXT NULL,
        \`status\` VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
        \`publishTime\` VARCHAR(50) NULL DEFAULT '06:00 AM',
        \`isActive\` TINYINT(1) NOT NULL DEFAULT 1,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Ensure columns are LONGTEXT even if table was previously created with VARCHAR(255)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`epaper_editions\` MODIFY COLUMN \`thumbnailUrl\` LONGTEXT NULL`);
    } catch (_) {}
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE \`epaper_editions\` MODIFY COLUMN \`fileUrl\` LONGTEXT NOT NULL`);
    } catch (_) {}

    // 2. Cities table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`epaper_cities\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`city\` VARCHAR(255) NOT NULL,
        \`cityGu\` VARCHAR(255) NULL,
        \`cityHi\` VARCHAR(255) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`epaper_cities_city_key\` (\`city\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Pages table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`epaper_pages\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`editionId\` VARCHAR(191) NOT NULL,
        \`pageNumber\` INT NOT NULL,
        \`section\` VARCHAR(100) NOT NULL,
        \`templateId\` VARCHAR(100) NOT NULL,
        \`enabled\` TINYINT(1) NOT NULL DEFAULT 1,
        \`isLocked\` TINYINT(1) NOT NULL DEFAULT 0,
        \`lockedBy\` VARCHAR(255) NULL,
        \`lockedAt\` DATETIME(3) NULL,
        \`pageTitle\` VARCHAR(255) NULL,
        \`layoutData\` LONGTEXT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_edition_page\` (\`editionId\`, \`pageNumber\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Articles (print-specific model)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`epaper_articles\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`postId\` VARCHAR(191) NULL,
        \`printHeadline\` TEXT NULL,
        \`printSubheadline\` TEXT NULL,
        \`printSummary\` LONGTEXT NULL,
        \`printImage\` LONGTEXT NULL,
        \`photoCaption\` TEXT NULL,
        \`photoCredit\` VARCHAR(255) NULL,
        \`printByline\` VARCHAR(255) NULL,
        \`primarySection\` VARCHAR(100) NULL,
        \`secondaryTags\` LONGTEXT NULL,
        \`ePaperEligible\` TINYINT(1) NOT NULL DEFAULT 1,
        \`targetEdition\` VARCHAR(100) NULL,
        \`allowDuplicate\` TINYINT(1) NOT NULL DEFAULT 0,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`epaper_articles_postId_key\` (\`postId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Placements table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`epaper_placements\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`pageId\` VARCHAR(191) NOT NULL,
        \`epaperArticleId\` VARCHAR(191) NULL,
        \`postId\` VARCHAR(191) NULL,
        \`slotId\` VARCHAR(100) NOT NULL,
        \`position\` VARCHAR(50) NOT NULL DEFAULT 'standard',
        \`orderIndex\` INT NOT NULL DEFAULT 0,
        \`displayType\` VARCHAR(50) NOT NULL DEFAULT 'story',
        \`priority\` INT NOT NULL DEFAULT 0,
        \`manualOverride\` TINYINT(1) NOT NULL DEFAULT 0,
        \`customData\` LONGTEXT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_page_slot\` (\`pageId\`, \`slotId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Safe column enhancements to posts table for print version support
    const postColumns = [
      { name: 'printHeadline', def: 'TEXT NULL' },
      { name: 'printSubheadline', def: 'TEXT NULL' },
      { name: 'printSummary', def: 'LONGTEXT NULL' },
      { name: 'printImage', def: 'LONGTEXT NULL' },
      { name: 'photoCaption', def: 'TEXT NULL' },
      { name: 'photoCredit', def: 'VARCHAR(255) NULL' },
      { name: 'byline', def: 'VARCHAR(255) NULL' },
      { name: 'primarySection', def: 'VARCHAR(100) NULL' },
      { name: 'ePaperEligible', def: 'TINYINT(1) NOT NULL DEFAULT 1' },
      { name: 'targetEdition', def: 'VARCHAR(100) NULL' },
      { name: 'allowDuplicate', def: 'TINYINT(1) NOT NULL DEFAULT 0' },
    ];

    for (const col of postColumns) {
      try {
        await prisma.$executeRawUnsafe(`ALTER TABLE \`posts\` ADD COLUMN \`${col.name}\` ${col.def}`);
      } catch (_) {}
    }

    epaperTablesEnsured = true;
  } catch (err) {
    console.warn('ePaper tables ensure warning:', err);
  }
}

async function getEPaperDelegate() {
  await ensureEPaperTablesExist();
  const model = (prisma as any).ePaperEdition || (prisma as any).epaperEdition || (prisma as any).EPaperEdition;
  return model || null;
}

export class EPaperController {
  // Public: Get published epapers
  static async getPublicEditions(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureEPaperTablesExist();
      const delegate = await getEPaperDelegate();
      const { city, date, search } = req.query;

      let editions: any[] = [];

      if (delegate) {
        const whereClause: any = { isActive: true, status: 'PUBLISHED' };
        if (city && city !== 'ALL') {
          const cityStr = String(city).trim();
          whereClause.OR = [
            { city: { equals: cityStr } },
            { city: { contains: cityStr } },
            { cityGu: { equals: cityStr } },
            { cityGu: { contains: cityStr } },
          ];
        }
        if (date && date !== 'ALL') whereClause.date = String(date);
        editions = await delegate.findMany({
          where: whereClause,
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        }).catch(() => []);
      }

      if (editions.length === 0) {
        let sql = `SELECT * FROM \`epaper_editions\` WHERE \`isActive\` = 1 AND \`status\` = 'PUBLISHED'`;
        const params: any[] = [];
        if (city && city !== 'ALL') {
          sql += ` AND (\`city\` LIKE ? OR \`cityGu\` LIKE ?)`;
          params.push(`%${city}%`, `%${city}%`);
        }
        if (date && date !== 'ALL') {
          sql += ` AND \`date\` = ?`;
          params.push(String(date));
        }
        sql += ` ORDER BY \`date\` DESC, \`createdAt\` DESC`;
        try {
          editions = await prisma.$queryRawUnsafe(sql, ...params);
        } catch (_) {}
      }

      const sanitized = (editions || []).map((ed: any) => ({
        ...ed,
        fileUrl: sanitizePdfUrl(ed.fileUrl),
        thumbnailUrl: sanitizeThumbUrl(ed.thumbnailUrl),
      }));

      return sendSuccess(res, { editions: sanitized }, 'Public E-Papers fetched successfully');
    } catch (error) {
      console.warn('E-Paper fetch fallback:', error);
      return sendSuccess(res, { editions: [] }, 'Public E-Papers fetched fallback');
    }
  }

  // Public: Get detailed edition by ID (including page data and placements)
  static async getPublicEditionDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ensureEPaperTablesExist();

      const editionRows = (await prisma.$queryRawUnsafe(
        `SELECT * FROM \`epaper_editions\` WHERE \`id\` = ? AND \`isActive\` = 1 LIMIT 1`,
        id
      ) as any[]) || [];

      if (!editionRows || editionRows.length === 0) {
        return res.status(404).json({ success: false, error: 'E-Paper Edition not found' });
      }

      const edition = editionRows[0];
      const pages = (await prisma.$queryRawUnsafe(
        `SELECT * FROM \`epaper_pages\` WHERE \`editionId\` = ? AND \`enabled\` = 1 ORDER BY \`pageNumber\` ASC`,
        id
      ).catch(() => [])) as any[];

      return sendSuccess(res, {
        edition: {
          ...edition,
          fileUrl: sanitizePdfUrl(edition.fileUrl),
          thumbnailUrl: sanitizeThumbUrl(edition.thumbnailUrl),
          pages,
        },
      }, 'Edition detail fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get all epapers (Drafts & Published)
  static async getAdminEditions(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureEPaperTablesExist();
      const delegate = await getEPaperDelegate();
      const { city, date, status, search } = req.query;

      let editions: any[] = [];

      if (delegate) {
        const whereClause: any = {};
        if (city && city !== 'ALL') {
          const cityStr = String(city).trim();
          whereClause.OR = [
            { city: { equals: cityStr } },
            { city: { contains: cityStr } },
            { cityGu: { equals: cityStr } },
            { cityGu: { contains: cityStr } },
          ];
        }
        if (date && date !== 'ALL') whereClause.date = String(date);
        if (status && status !== 'ALL') whereClause.status = String(status);
        if (search) {
          const searchStr = String(search).trim();
          const searchConditions = [
            { title: { contains: searchStr } },
            { city: { contains: searchStr } },
            { cityGu: { contains: searchStr } },
            { date: { contains: searchStr } },
          ];
          if (whereClause.OR) {
            whereClause.AND = [
              { OR: whereClause.OR },
              { OR: searchConditions },
            ];
            delete whereClause.OR;
          } else {
            whereClause.OR = searchConditions;
          }
        }
        editions = await delegate.findMany({
          where: whereClause,
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        }).catch(() => []);
      }

      if (editions.length === 0) {
        let sql = `SELECT * FROM \`epaper_editions\` WHERE 1=1`;
        const params: any[] = [];
        if (city && city !== 'ALL') {
          sql += ` AND (\`city\` LIKE ? OR \`cityGu\` LIKE ?)`;
          params.push(`%${city}%`, `%${city}%`);
        }
        if (date && date !== 'ALL') {
          sql += ` AND \`date\` = ?`;
          params.push(String(date));
        }
        if (status && status !== 'ALL') {
          sql += ` AND \`status\` = ?`;
          params.push(String(status));
        }
        if (search) {
          sql += ` AND (\`title\` LIKE ? OR \`city\` LIKE ? OR \`cityGu\` LIKE ? OR \`date\` LIKE ?)`;
          params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        sql += ` ORDER BY \`date\` DESC, \`createdAt\` DESC`;
        try {
          editions = await prisma.$queryRawUnsafe(sql, ...params);
        } catch (_) {}
      }

      const sanitized = (editions || []).map((ed: any) => ({
        ...ed,
        fileUrl: sanitizePdfUrl(ed.fileUrl),
        thumbnailUrl: sanitizeThumbUrl(ed.thumbnailUrl),
      }));

      return sendSuccess(res, { editions: sanitized }, 'Admin E-Papers fetched successfully');
    } catch (error) {
      console.warn('Admin E-Paper fetch fallback:', error);
      return sendSuccess(res, { editions: [] }, 'Admin E-Papers fetched fallback');
    }
  }

  // Admin: Get edition detail with pages and placements for Composer
  static async getEditionDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ensureEPaperTablesExist();

      const editionRows = (await prisma.$queryRawUnsafe(
        `SELECT * FROM \`epaper_editions\` WHERE \`id\` = ? LIMIT 1`,
        id
      ) as any[]) || [];

      if (!editionRows || editionRows.length === 0) {
        return res.status(404).json({ success: false, error: 'Edition not found' });
      }

      const edition = editionRows[0];
      const pages = (await prisma.$queryRawUnsafe(
        `SELECT * FROM \`epaper_pages\` WHERE \`editionId\` = ? ORDER BY \`pageNumber\` ASC`,
        id
      ) as any[]) || [];

      // Populate placements for each page
      const populatedPages = await Promise.all(
        pages.map(async (page) => {
          const placements = (await prisma.$queryRawUnsafe(
            `SELECT p.*, a.printHeadline, a.printSubheadline, a.printSummary, a.printImage, a.photoCaption, a.photoCredit, a.printByline, a.primarySection
             FROM \`epaper_placements\` p
             LEFT JOIN \`epaper_articles\` a ON p.epaperArticleId = a.id
             WHERE p.pageId = ?
             ORDER BY p.orderIndex ASC`,
            page.id
          ).catch(() => [])) as any[];

          let layoutParsed = null;
          try {
            if (page.layoutData) layoutParsed = JSON.parse(page.layoutData);
          } catch (_) {}

          return {
            ...page,
            layoutData: layoutParsed,
            placements,
          };
        })
      );

      return sendSuccess(res, {
        edition: {
          ...edition,
          pages: populatedPages,
        },
      }, 'Edition details fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Batch Save Edition Placements, Pages and Print Overrides
  static async saveEditionPlacements(req: Request, res: Response, next: NextFunction) {
    try {
      const { editionId, pages } = req.body;
      if (!editionId || !Array.isArray(pages)) {
        return res.status(400).json({ success: false, error: 'editionId and pages array are required' });
      }

      await ensureEPaperTablesExist();

      for (const p of pages) {
        const pageId = p.id || randomUUID();
        const pageNum = Number(p.pageNumber) || 1;
        const section = String(p.sectionKey || p.section || 'front_page');
        const templateId = String(p.templateId || 'FrontPageTemplate');
        const enabled = p.enabled !== false ? 1 : 0;
        const isLocked = p.isLocked ? 1 : 0;
        const pageTitle = p.pageTitle ? String(p.pageTitle) : null;
        const layoutDataStr = p.layoutData ? (typeof p.layoutData === 'string' ? p.layoutData : JSON.stringify(p.layoutData)) : null;

        // Upsert Page
        await prisma.$executeRawUnsafe(
          `INSERT INTO \`epaper_pages\` (\`id\`, \`editionId\`, \`pageNumber\`, \`section\`, \`templateId\`, \`enabled\`, \`isLocked\`, \`pageTitle\`, \`layoutData\`, \`createdAt\`, \`updatedAt\`)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE \`section\`=?, \`templateId\`=?, \`enabled\`=?, \`isLocked\`=?, \`pageTitle\`=?, \`layoutData\`=?, \`updatedAt\`=NOW()`,
          pageId, editionId, pageNum, section, templateId, enabled, isLocked, pageTitle, layoutDataStr,
          section, templateId, enabled, isLocked, pageTitle, layoutDataStr
        );

        // If placements are provided, replace them for this page
        if (Array.isArray(p.placements)) {
          await prisma.$executeRawUnsafe(`DELETE FROM \`epaper_placements\` WHERE \`pageId\` = ?`, pageId).catch(() => null);

          for (let i = 0; i < p.placements.length; i++) {
            const plc = p.placements[i];
            const placementId = plc.id || randomUUID();
            const slotId = String(plc.slotId || `slot_${i}`);
            const position = String(plc.position || 'standard');
            const orderIndex = Number(plc.orderIndex ?? i);
            const displayType = String(plc.displayType || 'story');
            const priority = Number(plc.priority || 0);
            const manualOverride = plc.manualOverride ? 1 : 0;
            const customDataStr = plc.customData ? (typeof plc.customData === 'string' ? plc.customData : JSON.stringify(plc.customData)) : null;
            const postId = plc.postId || null;
            let epaperArticleId = plc.epaperArticleId || null;

            // If print overrides are provided for this article, create/update epaper_articles
            if (postId || plc.printHeadline || plc.printSummary) {
              if (!epaperArticleId) epaperArticleId = randomUUID();
              await prisma.$executeRawUnsafe(
                `INSERT INTO \`epaper_articles\` (\`id\`, \`postId\`, \`printHeadline\`, \`printSubheadline\`, \`printSummary\`, \`printImage\`, \`photoCaption\`, \`photoCredit\`, \`printByline\`, \`primarySection\`, \`allowDuplicate\`, \`createdAt\`, \`updatedAt\`)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
                 ON DUPLICATE KEY UPDATE \`printHeadline\`=COALESCE(?, \`printHeadline\`), \`printSubheadline\`=COALESCE(?, \`printSubheadline\`), \`printSummary\`=COALESCE(?, \`printSummary\`), \`photoCredit\`=COALESCE(?, \`photoCredit\`), \`printByline\`=COALESCE(?, \`printByline\`), \`updatedAt\`=NOW()`,
                epaperArticleId, postId, plc.printHeadline || null, plc.printSubheadline || null, plc.printSummary || null, plc.printImage || null, plc.photoCaption || null, plc.photoCredit || null, plc.printByline || plc.byline || null, plc.primarySection || null, plc.allowDuplicate ? 1 : 0,
                plc.printHeadline || null, plc.printSubheadline || null, plc.printSummary || null, plc.photoCredit || null, plc.printByline || plc.byline || null
              ).catch(() => null);
            }

            await prisma.$executeRawUnsafe(
              `INSERT INTO \`epaper_placements\` (\`id\`, \`pageId\`, \`epaperArticleId\`, \`postId\`, \`slotId\`, \`position\`, \`orderIndex\`, \`displayType\`, \`priority\`, \`manualOverride\`, \`customData\`, \`createdAt\`, \`updatedAt\`)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
              placementId, pageId, epaperArticleId, postId, slotId, position, orderIndex, displayType, priority, manualOverride, customDataStr
            ).catch((e) => console.warn('Insert placement warning:', e));
          }
        }
      }

      return sendSuccess(res, { editionId, savedPagesCount: pages.length }, 'Placements saved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Create or Upsert E-Paper edition with optional pages & placements
  static async createEdition(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        city,
        cityGu,
        date,
        pages = 14,
        fileUrl = '',
        thumbnailUrl = '',
        status = 'PUBLISHED',
        publishTime = '06:00 AM',
        isActive = true,
        pagesData,
      } = req.body;

      if (!city || !date) {
        return res.status(400).json({ success: false, error: 'City and Date are required' });
      }

      await ensureEPaperTablesExist();
      const finalTitle = String(title || '').trim() || `${city} Edition`;

      // Check existing edition
      const existingRows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM \`epaper_editions\` WHERE \`city\` = ? AND \`date\` = ? AND \`title\` = ? LIMIT 1`,
        String(city), String(date), finalTitle
      );

      let editionId = randomUUID();
      const pageCount = Array.isArray(pagesData) ? pagesData.length : Number(pages) || 14;

      if (existingRows && existingRows.length > 0) {
        editionId = existingRows[0].id;
        await prisma.$executeRawUnsafe(
          `UPDATE \`epaper_editions\` SET \`title\`=?, \`city\`=?, \`cityGu\`=?, \`date\`=?, \`pages\`=?, \`fileUrl\`=?, \`thumbnailUrl\`=?, \`status\`=?, \`publishTime\`=?, \`isActive\`=?, \`updatedAt\`=NOW() WHERE \`id\`=?`,
          finalTitle, String(city), String(cityGu || city), String(date), pageCount, String(fileUrl || ''), String(thumbnailUrl || ''), String(status || 'PUBLISHED'), String(publishTime || '06:00 AM'), isActive !== false ? 1 : 0, editionId
        );
      } else {
        await prisma.$executeRawUnsafe(
          `INSERT INTO \`epaper_editions\` (\`id\`, \`title\`, \`city\`, \`cityGu\`, \`date\`, \`pages\`, \`fileUrl\`, \`thumbnailUrl\`, \`status\`, \`publishTime\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          editionId, finalTitle, String(city), String(cityGu || city), String(date), pageCount, String(fileUrl || ''), String(thumbnailUrl || ''), String(status || 'PUBLISHED'), String(publishTime || '06:00 AM'), isActive !== false ? 1 : 0
        );
      }

      // Save individual page configurations if provided
      if (Array.isArray(pagesData) && pagesData.length > 0) {
        for (const p of pagesData) {
          const pageId = p.id || randomUUID();
          const pageNum = Number(p.pageNumber) || 1;
          const section = String(p.sectionKey || p.section || 'general');
          const templateId = String(p.templateId || 'FrontPageTemplate');
          const enabled = p.enabled !== false ? 1 : 0;
          const isLocked = p.isLocked ? 1 : 0;
          const pageTitle = p.pageTitle ? String(p.pageTitle) : null;
          const layoutDataStr = p.layoutData ? JSON.stringify(p.layoutData) : null;

          await prisma.$executeRawUnsafe(
            `INSERT INTO \`epaper_pages\` (\`id\`, \`editionId\`, \`pageNumber\`, \`section\`, \`templateId\`, \`enabled\`, \`isLocked\`, \`pageTitle\`, \`layoutData\`, \`createdAt\`, \`updatedAt\`)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
             ON DUPLICATE KEY UPDATE \`section\`=?, \`templateId\`=?, \`enabled\`=?, \`isLocked\`=?, \`pageTitle\`=?, \`layoutData\`=?, \`updatedAt\`=NOW()`,
            pageId, editionId, pageNum, section, templateId, enabled, isLocked, pageTitle, layoutDataStr,
            section, templateId, enabled, isLocked, pageTitle, layoutDataStr
          ).catch((e) => console.warn('Save page warning:', e));
        }
      }

      const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM \`epaper_editions\` WHERE \`id\` = ?`, editionId);
      return sendSuccess(res, { edition: rows[0] }, 'E-Paper edition saved successfully');
    } catch (error: any) {
      console.error('Error in createEdition:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Failed to create or update E-Paper edition.',
      });
    }
  }

  // Admin: Update E-Paper edition
  static async updateEdition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, city, cityGu, date, pages, fileUrl, thumbnailUrl, status, publishTime, isActive } = req.body;
      await ensureEPaperTablesExist();

      await prisma.$executeRawUnsafe(
        `UPDATE \`epaper_editions\` SET \`title\`=COALESCE(?, \`title\`), \`city\`=COALESCE(?, \`city\`), \`cityGu\`=COALESCE(?, \`cityGu\`), \`date\`=COALESCE(?, \`date\`), \`pages\`=COALESCE(?, \`pages\`), \`fileUrl\`=COALESCE(?, \`fileUrl\`), \`thumbnailUrl\`=COALESCE(?, \`thumbnailUrl\`), \`status\`=COALESCE(?, \`status\`), \`publishTime\`=COALESCE(?, \`publishTime\`), \`isActive\`=COALESCE(?, \`isActive\`), \`updatedAt\`=NOW() WHERE \`id\`=?`,
        title || null, city || null, cityGu || city || null, date || null, pages !== undefined ? Number(pages) : null, fileUrl || null, thumbnailUrl || null, status || null, publishTime || null, isActive !== undefined ? (isActive ? 1 : 0) : null, id
      );

      const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM \`epaper_editions\` WHERE \`id\` = ?`, id);
      return sendSuccess(res, { edition: rows[0] }, 'E-Paper edition updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Toggle Lock / Unlock on an E-Paper Page
  static async togglePageLock(req: Request, res: Response, next: NextFunction) {
    try {
      const { pageId } = req.params;
      const { isLocked, lockedBy } = req.body;
      await ensureEPaperTablesExist();

      const lockVal = isLocked ? 1 : 0;
      const user = lockedBy || (req as any).user?.email || 'Editor';

      await prisma.$executeRawUnsafe(
        `UPDATE \`epaper_pages\` SET \`isLocked\` = ?, \`lockedBy\` = ?, \`lockedAt\` = IF(? = 1, NOW(), NULL), \`updatedAt\` = NOW() WHERE \`id\` = ?`,
        lockVal, lockVal ? user : null, lockVal, pageId
      );

      return sendSuccess(res, { pageId, isLocked: !!isLocked }, `Page ${isLocked ? 'locked' : 'unlocked'} successfully`);
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete E-Paper edition
  static async deleteEdition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ensureEPaperTablesExist();

      // Delete placements and pages cascade
      const pageRows = (await prisma.$queryRawUnsafe(`SELECT \`id\` FROM \`epaper_pages\` WHERE \`editionId\` = ?`, id).catch(() => [])) as any[];
      for (const p of pageRows) {
        await prisma.$executeRawUnsafe(`DELETE FROM \`epaper_placements\` WHERE \`pageId\` = ?`, p.id).catch(() => null);
      }
      await prisma.$executeRawUnsafe(`DELETE FROM \`epaper_pages\` WHERE \`editionId\` = ?`, id).catch(() => null);
      await prisma.$executeRawUnsafe(`DELETE FROM \`epaper_editions\` WHERE \`id\` = ?`, id).catch(() => null);

      return sendSuccess(res, null, 'E-Paper edition deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Get E-Paper eligible articles formatted with print metadata
  static async getEpaperArticles(req: Request, res: Response, next: NextFunction) {
    return EPaperController.getEpaperEligibleArticles(req, res, next);
  }

  // Admin: Get E-Paper eligible articles formatted with section scoring and print metadata
  static async getEpaperEligibleArticles(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureEPaperTablesExist();
      const { section, edition, limit = 200 } = req.query;

      const whereClause: any = {
        status: 'PUBLISHED',
      };

      const articles: any[] = await prisma.post.findMany({
        where: whereClause,
        include: {
          category: true,
          author: true,
        },
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        take: Number(limit) || 200,
      }).catch(() => []);

      return sendSuccess(res, { articles }, 'E-Paper eligible articles fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Development Seed Endpoint to generate realistic Gujarati news across all 14 sections
  static async seedEpaperArticles(req: Request, res: Response, next: NextFunction) {
    try {
      await ensureEPaperTablesExist();
      const result = await seedEpaperArticlesData();
      return sendSuccess(res, result, '14-Section E-Paper sample articles seeded successfully');
    } catch (error: any) {
      console.error('Error seeding e-paper articles:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Failed to seed E-Paper articles.',
      });
    }
  }

  // Get Cities list (Only DB cities + cities from uploaded editions)
  static async getCities(req: Request, res: Response, next: NextFunction) {
    const defaults = [
      { id: 'ahmedabad', city: 'Ahmedabad', cityGu: 'અમદાવાદ' },
      { id: 'surat', city: 'Surat', cityGu: 'સુરત' },
      { id: 'rajkot', city: 'Rajkot', cityGu: 'રાજકોટ' },
      { id: 'vadodara', city: 'Vadodara', cityGu: 'વડોદરા' },
      { id: 'jamnagar', city: 'Jamnagar', cityGu: 'જામનગર' },
      { id: 'gandhinagar', city: 'Gandhinagar', cityGu: 'ગાંધીનગર' },
      { id: 'bhavnagar', city: 'Bhavnagar', cityGu: 'ભાવનગર' },
    ];

    try {
      await ensureEPaperTablesExist();
      let dbCities: any[] = [];
      try {
        dbCities = await prisma.$queryRawUnsafe(`SELECT * FROM \`epaper_cities\` ORDER BY \`createdAt\` ASC`);
      } catch (_) {}

      if (!dbCities || dbCities.length === 0) {
        dbCities = defaults;
      }

      return sendSuccess(res, { cities: dbCities }, 'Cities fetched successfully');
    } catch (error) {
      console.warn('Cities DB fetch fallback:', error);
      return sendSuccess(res, { cities: defaults }, 'Fallback cities fetched successfully');
    }
  }

  // Admin: Create City
  static async createCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, cityGu } = req.body;
      if (!city) {
        return res.status(400).json({ success: false, error: 'City name is required' });
      }

      const trimCity = String(city).trim();
      const trimGu = cityGu ? String(cityGu).trim() : trimCity;
      const cityId = randomUUID();

      await ensureEPaperTablesExist();
      await prisma.$executeRawUnsafe(
        `INSERT IGNORE INTO \`epaper_cities\` (\`id\`, \`city\`, \`cityGu\`, \`createdAt\`, \`updatedAt\`) VALUES (?, ?, ?, NOW(), NOW())`,
        cityId, trimCity, trimGu
      ).catch(() => null);

      return sendSuccess(res, { city: { id: cityId, city: trimCity, cityGu: trimGu } }, 'City created successfully');
    } catch (error) {
      console.error('Error in createCity:', error);
      next(error);
    }
  }

  // Admin: Delete City by ID or City Name
  static async deleteCity(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, error: 'City ID or Name is required' });
      }

      const searchTerm = String(id).trim();
      await ensureEPaperTablesExist();
      await prisma.$executeRawUnsafe(
        `DELETE FROM \`epaper_cities\` WHERE \`id\` = ? OR \`city\` = ? OR \`cityGu\` = ?`,
        searchTerm, searchTerm, searchTerm
      ).catch(() => null);

      return sendSuccess(res, null, 'City deleted successfully');
    } catch (error) {
      console.warn('Delete city notice:', error);
      return sendSuccess(res, null, 'City removed');
    }
  }
}
