import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';

export class InstagramReelController {
  // Realistic headers mimicking a modern desktop browser
  private static igHeaders(handle: string): Record<string, string> {
    return {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'X-IG-App-ID': '936619743392459',
      'X-ASBD-ID': '129477',
      'X-IG-WWW-Claim': '0',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'Referer': `https://www.instagram.com/${handle}/`,
    };
  }

  // Upsert a single reel node into DB, returns true if new
  private static async upsertReel(code: string, caption: string, thumbnail: string, createdAt?: Date): Promise<boolean> {
    const cleanHeading = caption.split('\n')[0]?.trim() || 'Gujarat Post News Reel';
    const instaUrl = `https://www.instagram.com/reel/${code}/`;

    const existing = await prisma.reel.findFirst({
      where: {
        OR: [
          { instaUrl },
          { instaUrl: `https://www.instagram.com/p/${code}/` },
        ]
      }
    });

    if (existing) {
      await prisma.reel.update({
        where: { id: existing.id },
        data: {
          heading: cleanHeading,
          headingGu: cleanHeading,
          headingHi: cleanHeading,
          thumbnail,
          instaUrl,
          isActive: true,
          ...(createdAt ? { createdAt } : {}),
        }
      });
      return false;
    } else {
      await prisma.reel.create({
        data: {
          type: 'INSTAGRAM',
          heading: cleanHeading,
          headingGu: cleanHeading,
          headingHi: cleanHeading,
          instaUrl,
          thumbnail,
          isActive: true,
          ...(createdAt ? { createdAt } : {}),
        }
      });
      return true;
    }
  }

  // Sync ALL reels from @gujaratpost.in in exact Instagram profile sequence
  // Returns { newCount, totalInDb }
  static async syncFromInstagram(): Promise<{ newCount: number; totalInDb: number }> {
    let newCount = 0;
    const seenCodes = new Set<string>();
    const allItems: Array<{ code: string; caption: string; thumbnail: string }> = [];

    try {
      const handle = 'gujaratpost.in';
      const headers = InstagramReelController.igHeaders(handle);

      // ── Page 1: web_profile_info (first 12 posts) ──
      const profileRes = await fetch(
        `https://www.instagram.com/api/v1/users/web_profile_info/?username=${handle}`,
        { headers }
      );
      if (!profileRes.ok) return { newCount: 0, totalInDb: await prisma.reel.count() };

      const profileData = await profileRes.json() as any;
      const mediaObj = profileData?.data?.user?.edge_owner_to_timeline_media;
      const page1Edges = mediaObj?.edges || [];
      let nextMaxId: string = mediaObj?.page_info?.end_cursor || '';

      // Collect page 1 items
      for (const { node } of page1Edges) {
        const code: string = node.shortcode;
        if (!code || seenCodes.has(code)) continue;
        seenCodes.add(code);
        const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || '';
        const thumbnail = node.display_url || node.thumbnail_src || `https://www.instagram.com/p/${code}/media/?size=l`;
        allItems.push({ code, caption, thumbnail });
      }

      // ── Pages 2-5 via /api/v1/feed/user/:handle/username/?max_id= ──
      // Fetches top ~50-60 reels in ~2-3 seconds
      let page = 2;
      const MAX_PAGES = 5;
      const TARGET_COUNT = 50;

      while (nextMaxId && page <= MAX_PAGES && allItems.length < TARGET_COUNT) {
        await new Promise(r => setTimeout(r, 250));

        const feedUrl = `https://www.instagram.com/api/v1/feed/user/${handle}/username/?max_id=${encodeURIComponent(nextMaxId)}`;
        let feedRes = await fetch(feedUrl, { headers });

        if (feedRes.status === 429) {
          console.warn(`[Instagram Sync] Rate-limited on page ${page} — retrying after 2s...`);
          await new Promise(r => setTimeout(r, 2000));
          feedRes = await fetch(feedUrl, { headers });
          if (!feedRes.ok) break;
        } else if (!feedRes.ok) {
          break;
        }

        const feedData = await feedRes.json() as any;
        const items: any[] = feedData?.items || [];
        nextMaxId = feedData?.next_max_id || '';

        if (items.length === 0) break;

        for (const item of items) {
          if (allItems.length >= TARGET_COUNT) break;
          const code: string = item.code || item.shortcode;
          if (!code || seenCodes.has(code)) continue;
          seenCodes.add(code);

          const caption = item.caption?.text || '';
          const thumbnail =
            item.image_versions2?.candidates?.[0]?.url ||
            item.thumbnail_url ||
            `https://www.instagram.com/p/${code}/media/?size=l`;

          allItems.push({ code, caption, thumbnail });
        }

        page++;
        if (!nextMaxId) break;
      }

      // Save into DB with ordered timestamps (item 0 is newest, item N is oldest)
      const baseTime = Date.now();
      for (let i = 0; i < allItems.length; i++) {
        const it = allItems[i];
        const calculatedCreatedAt = new Date(baseTime - (i * 1000));
        const isNew = await InstagramReelController.upsertReel(it.code, it.caption, it.thumbnail, calculatedCreatedAt);
        if (isNew) newCount++;
      }

      console.log(`[Instagram Sync] Done. Synced ${allItems.length} reels in ${page - 1} pages. New: ${newCount}`);
    } catch (err) {
      console.warn('Instagram auto-sync notice:', err);
    }
    const totalInDb = await prisma.reel.count();
    return { newCount, totalInDb };
  }

  // Admin route handler for explicit manual sync button
  static async syncReelsRoute(req: Request, res: Response, next: NextFunction) {
    try {
      const { newCount, totalInDb } = await InstagramReelController.syncFromInstagram();
      const msg = newCount > 0
        ? `✅ ${newCount} new reel${newCount > 1 ? 's' : ''} added from Instagram!`
        : `ℹ️ All reels are up to date! Currently no new reels uploaded on Instagram.`;
      return sendSuccess(res, { newCount, totalInDb }, msg);
    } catch (error) {
      next(error);
    }
  }

  // Get all reels (for admin or public)
  static async getAllReels(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive, limit } = req.query;

      const whereClause: any = {};
      if (isActive !== undefined) {
        whereClause.isActive = isActive === 'true';
      }

      // Apply limit — public route sends ?limit=50, admin sends no limit
      const take = limit ? parseInt(limit as string, 10) : undefined;

      const reels = await prisma.reel.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        ...(take ? { take } : {}),
      });

      return sendSuccess(res, { reels }, 'Reels retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Create a new reel
  static async createReel(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, heading, headingGu, headingHi, videoUrl, instaUrl, thumbnail, isActive } = req.body;

      const newReel = await prisma.reel.create({
        data: {
          type: type || 'INSTAGRAM',
          heading,
          headingGu,
          headingHi,
          videoUrl,
          instaUrl,
          thumbnail,
          isActive: isActive !== undefined ? isActive : true,
        },
      });

      return sendSuccess(res, { reel: newReel }, 'Reel created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  // Update a reel
  static async updateReel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { type, heading, headingGu, headingHi, videoUrl, instaUrl, thumbnail, isActive } = req.body;

      const updatedReel = await prisma.reel.update({
        where: { id },
        data: {
          type,
          heading,
          headingGu,
          headingHi,
          videoUrl,
          instaUrl,
          thumbnail,
          isActive,
        },
      });

      return sendSuccess(res, { reel: updatedReel }, 'Reel updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Delete a reel
  static async deleteReel(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.reel.delete({
        where: { id },
      });

      return sendSuccess(res, null, 'Reel deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
