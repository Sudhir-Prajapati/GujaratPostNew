import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

function sanitizePdfUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('blob:')) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/raw/upload/')) {
    return url.replace('/raw/upload/', '/image/upload/');
  }
  return url;
}

export class EPaperController {
  // Public: Get published epapers
  static async getPublicEditions(req: Request, res: Response, next: NextFunction) {
    try {
      // ── Auto-publish scheduled drafts ──────────────────────────────
      // Any DRAFT where date < today is automatically published.
      // Any DRAFT where date == today and publishTime <= current time is published.
      try {
        const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000); // UTC+5:30
        const todayStr = nowIST.toISOString().slice(0, 10); // "YYYY-MM-DD"
        const nowMinutes = nowIST.getUTCHours() * 60 + nowIST.getUTCMinutes();

        // Fetch all drafts whose date <= today
        const scheduledDrafts = await prisma.ePaperEdition.findMany({
          where: { status: 'DRAFT', date: { lte: todayStr } },
          select: { id: true, date: true, publishTime: true },
        });

        const toPublishIds: string[] = [];

        for (const draft of scheduledDrafts) {
          if (draft.date < todayStr) {
            // Past date → always publish
            toPublishIds.push(draft.id);
          } else {
            // Today → check if publishTime has passed
            const rawTime = (draft.publishTime || '06:00 AM').trim();
            const match = rawTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
            if (match) {
              let h = parseInt(match[1], 10);
              const m = parseInt(match[2], 10);
              const period = (match[3] || '').toUpperCase();
              if (period === 'PM' && h < 12) h += 12;
              if (period === 'AM' && h === 12) h = 0;
              const scheduledMinutes = h * 60 + m;
              if (scheduledMinutes <= nowMinutes) {
                toPublishIds.push(draft.id);
              }
            } else {
              // Can't parse time → publish anyway (safe fallback)
              toPublishIds.push(draft.id);
            }
          }
        }

        if (toPublishIds.length > 0) {
          await prisma.ePaperEdition.updateMany({
            where: { id: { in: toPublishIds } },
            data: { status: 'PUBLISHED' },
          });
          console.log(`[E-Paper] Auto-published ${toPublishIds.length} scheduled draft(s): ${toPublishIds.join(', ')}`);
        }
      } catch (autoErr) {
        // Non-fatal — don't block the public fetch if auto-publish fails
        console.warn('[E-Paper] Auto-publish check failed:', autoErr);
      }
      // ───────────────────────────────────────────────────────────────

      const { city, date, search } = req.query;

      const whereClause: any = {
        isActive: true,
        status: 'PUBLISHED',
      };

      if (city && city !== 'ALL') {
        const cityStr = String(city).trim();
        whereClause.OR = [
          { city: { equals: cityStr } },
          { city: { contains: cityStr } },
          { cityGu: { equals: cityStr } },
          { cityGu: { contains: cityStr } },
        ];
      }

      if (date && date !== 'ALL') {
        whereClause.date = String(date);
      }

      if (search) {
        const queryStr = String(search).trim();
        whereClause.OR = [
          { title: { contains: queryStr } },
          { city: { contains: queryStr } },
          { cityGu: { contains: queryStr } },
          { date: { contains: queryStr } },
        ];
      }

      let editions = await prisma.ePaperEdition.findMany({
        where: whereClause,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      });

      // NOTE: No fallback to other dates here — if date filter returns 0, return empty so the frontend shows proper "no data" message.

      const sanitized = editions.map((ed: any) => ({
        ...ed,
        fileUrl: sanitizePdfUrl(ed.fileUrl),
        thumbnailUrl: sanitizePdfUrl(ed.thumbnailUrl),
      }));

      return sendSuccess(res, { editions: sanitized }, 'Public E-Papers fetched successfully');
    } catch (error) {
      console.warn('E-Paper fetch fallback:', error);
      return sendSuccess(res, { editions: [] }, 'Public E-Papers fetched fallback');
    }
  }


  // Admin: Get all epapers (Drafts & Published)
  static async getAdminEditions(req: Request, res: Response, next: NextFunction) {
    try {
      const { city, date, status, search } = req.query;

      const whereClause: any = {};

      if (city && city !== 'ALL') {
        whereClause.city = String(city);
      }

      if (date && date !== 'ALL') {
        whereClause.date = String(date);
      }

      if (status && status !== 'ALL') {
        whereClause.status = String(status);
      }

      if (search) {
        const queryStr = String(search).trim();
        whereClause.OR = [
          { title: { contains: queryStr } },
          { city: { contains: queryStr } },
          { cityGu: { contains: queryStr } },
          { date: { contains: queryStr } },
        ];
      }

      const editions = await prisma.ePaperEdition.findMany({
        where: whereClause,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      });

      const sanitized = editions.map((ed: any) => ({
        ...ed,
        fileUrl: sanitizePdfUrl(ed.fileUrl),
        thumbnailUrl: sanitizePdfUrl(ed.thumbnailUrl),
      }));

      return sendSuccess(res, { editions: sanitized }, 'Admin E-Papers fetched successfully');
    } catch (error) {
      console.warn('Admin E-Paper fetch fallback:', error);
      return sendSuccess(res, { editions: [] }, 'Admin E-Papers fetched fallback');
    }
  }

  // Admin: Create E-Paper edition
  static async createEdition(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, city, cityGu, date, pages, fileUrl, thumbnailUrl, status, publishTime, isActive } = req.body;

      if (!city || !date) {
        return res.status(400).json({ success: false, error: 'City and Date are required' });
      }

      const finalTitle = String(title || '').trim() || `${city} Edition`;

      // Safely check for duplicate edition with the same title on the exact same date and city
      try {
        const existing = await prisma.ePaperEdition.findFirst({
          where: {
            city: String(city),
            date: String(date),
            title: finalTitle,
          },
        });

        if (existing) {
          return res.status(400).json({
            success: false,
            error: `The e-paper edition "${finalTitle}" already exists for ${city} on ${date}. (આ તારીખે આ નામનું ઈ-પેપર પહેલેથી જ બનાવાયેલ છે!)`,
          });
        }
      } catch (err) {
        console.warn('Duplicate check warning in createEdition:', err);
      }

      const edition = await prisma.ePaperEdition.create({
        data: {
          title: finalTitle,
          city: String(city),
          cityGu: cityGu ? String(cityGu) : String(city),
          date: String(date),
          pages: Number(pages) || 24,
          fileUrl: String(fileUrl || ''),
          thumbnailUrl: String(thumbnailUrl || ''),
          status: status ? String(status) : 'PUBLISHED',
          publishTime: publishTime ? String(publishTime) : '06:00 AM',
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      });

      return sendSuccess(res, { edition }, 'E-Paper edition created successfully');
    } catch (error: any) {
      console.error('Error in createEdition:', error);
      return res.status(400).json({
        success: false,
        error: error?.message || 'Failed to create e-paper edition.',
      });
    }
  }

  // Admin: Update E-Paper edition
  static async updateEdition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, city, cityGu, date, pages, fileUrl, thumbnailUrl, status, publishTime, isActive } = req.body;

      if (title && city && date) {
        try {
          const existing = await prisma.ePaperEdition.findFirst({
            where: {
              city: String(city),
              date: String(date),
              title: String(title).trim(),
              NOT: { id: String(id) },
            },
          });

          if (existing) {
            return res.status(400).json({
              success: false,
              error: `The e-paper edition "${String(title).trim()}" already exists for ${city} on ${date}. (આ તારીખે આ નામનું ઈ-પેપર પહેલેથી જ બનાવાયેલ છે!)`,
            });
          }
        } catch (err) {
          console.warn('Duplicate check warning in updateEdition:', err);
        }
      }

      const edition = await prisma.ePaperEdition.update({
        where: { id },
        data: {
          title,
          city,
          cityGu: cityGu || city,
          date,
          pages: pages !== undefined ? Number(pages) : undefined,
          fileUrl,
          thumbnailUrl,
          status,
          publishTime,
          isActive: isActive !== undefined ? Boolean(isActive) : undefined,
        },
      });

      return sendSuccess(res, { edition }, 'E-Paper edition updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Admin: Delete E-Paper edition
  static async deleteEdition(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.ePaperEdition.delete({ where: { id } });
      return sendSuccess(res, null, 'E-Paper edition deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get Cities list (Only DB cities + cities from uploaded editions)
  static async getCities(req: Request, res: Response, next: NextFunction) {
    const defaults = [
      { city: 'Ahmedabad', cityGu: 'અમદાવાદ' },
      { city: 'Surat', cityGu: 'સુરત' },
      { city: 'Rajkot', cityGu: 'રાજકોટ' },
      { city: 'Jamnagar', cityGu: 'જામનગર' },
      { city: 'Vadodara', cityGu: 'વડોદરા' },
    ];

    try {
      let dbCities = await prisma.ePaperCity.findMany({
        orderBy: { createdAt: 'asc' },
      });

      // Seed database once if table is completely empty
      if (dbCities.length === 0) {
        await prisma.ePaperCity.createMany({
          data: defaults,
          skipDuplicates: true,
        });
        dbCities = await prisma.ePaperCity.findMany({
          orderBy: { createdAt: 'asc' },
        });
      }

      const editionCities = await prisma.ePaperEdition.findMany({
        select: { city: true, cityGu: true },
        distinct: ['city'],
      });

      const uniqueCitiesMap = new Map<string, { id: string; city: string; cityGu: string }>();

      // 1. Add DB Cities (Primary source of truth)
      dbCities.forEach((c: any) => {
        const uniqueKey = (c.cityGu || c.city).trim().toLowerCase();
        if (!uniqueCitiesMap.has(uniqueKey)) {
          uniqueCitiesMap.set(uniqueKey, {
            id: c.id,
            city: c.city,
            cityGu: c.cityGu || c.city,
          });
        }
      });

      // 2. Add cities from existing editions if not already in DB
      editionCities.forEach((e: any) => {
        if (e.city) {
          const uniqueKey = (e.cityGu || e.city).trim().toLowerCase();
          if (!uniqueCitiesMap.has(uniqueKey)) {
            uniqueCitiesMap.set(uniqueKey, {
              id: e.city.toLowerCase().replace(/[^a-z0-9]/g, '-'),
              city: e.city,
              cityGu: e.cityGu || e.city,
            });
          }
        }
      });

      const formattedCities = Array.from(uniqueCitiesMap.values());
      return sendSuccess(res, { cities: formattedCities }, 'Cities fetched successfully');
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

      const existing = await prisma.ePaperCity.findFirst({
        where: {
          OR: [
            { city: { equals: trimCity } },
            { cityGu: { equals: trimCity } },
            { city: { equals: trimGu } },
            { cityGu: { equals: trimGu } },
          ],
        },
      });

      if (existing) {
        return sendSuccess(res, { city: existing }, 'City already exists in active cities list');
      }

      const newCity = await prisma.ePaperCity.create({
        data: {
          city: trimCity,
          cityGu: trimGu,
        },
      });

      return sendSuccess(res, { city: newCity }, 'City created successfully');
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

      // Delete all matching city records by ID or by city / cityGu name
      await prisma.ePaperCity.deleteMany({
        where: {
          OR: [
            { id: searchTerm },
            { city: { equals: searchTerm } },
            { cityGu: { equals: searchTerm } },
          ],
        },
      });

      return sendSuccess(res, null, 'City deleted successfully');
    } catch (error) {
      console.warn('Delete city notice:', error);
      return sendSuccess(res, null, 'City removed');
    }
  }
}
