import { prisma } from '../config/prisma.js';
import { redisClient } from '../config/redis.js';
import { Session } from '@prisma/client';

export interface CachedSession {
  id: string;
  userId: string;
  tokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: string; // ISO string for serialization
}

export class SessionRepository {
  private static getCacheKey(tokenHash: string): string {
    return `session:${tokenHash}`;
  }

  /**
   * Create a new session in MySQL and cache it in Redis.
   */
  static async createSession(data: {
    userId: string;
    tokenHash: string;
    userAgent?: string | null;
    ipAddress?: string | null;
    expiresAt: Date;
  }): Promise<Session> {
    // 1. Save to MySQL
    const session = await prisma.session.create({
      data: {
        userId: data.userId,
        tokenHash: data.tokenHash,
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
        expiresAt: data.expiresAt,
      },
    });

    // 2. Cache in Redis
    try {
      const ttl = Math.floor((data.expiresAt.getTime() - Date.now()) / 1000);
      if (ttl > 0) {
        const cacheKey = this.getCacheKey(data.tokenHash);
        const cacheValue = JSON.stringify({
          ...session,
          expiresAt: session.expiresAt.toISOString(),
        });
        await redisClient.setEx(cacheKey, ttl, cacheValue);
      }
    } catch (error) {
      // Log error but don't fail request (fail-soft for caching)
      console.error('Redis cache set failed:', error);
    }

    return session;
  }

  /**
   * Get session by token hash, checking Redis first and falling back to MySQL.
   */
  static async getSession(tokenHash: string): Promise<Session | null> {
    const cacheKey = this.getCacheKey(tokenHash);

    // 1. Check Redis Cache
    try {
      if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached) as CachedSession;
          return {
            ...parsed,
            expiresAt: new Date(parsed.expiresAt),
            createdAt: new Date(), // placeholder, not strictly needed for validation
          } as Session;
        }
      }
    } catch (error) {
      console.error('Redis cache get failed:', error);
    }

    // 2. Check MySQL Database (Cache Miss)
    const session = await prisma.session.findUnique({
      where: { tokenHash },
    });

    if (!session) {
      return null;
    }

    // Check if session has expired in database
    if (session.expiresAt.getTime() < Date.now()) {
      // Clean up expired session
      await this.deleteSession(tokenHash);
      return null;
    }

    // 3. Re-populate Redis Cache
    try {
      const ttl = Math.floor((session.expiresAt.getTime() - Date.now()) / 1000);
      if (ttl > 0 && redisClient.isOpen) {
        const cacheValue = JSON.stringify({
          ...session,
          expiresAt: session.expiresAt.toISOString(),
        });
        await redisClient.setEx(cacheKey, ttl, cacheValue);
      }
    } catch (error) {
      console.error('Redis cache re-population failed:', error);
    }

    return session;
  }

  /**
   * Delete session by token hash (MySQL and Redis).
   */
  static async deleteSession(tokenHash: string): Promise<void> {
    const cacheKey = this.getCacheKey(tokenHash);

    // 1. Delete from Redis Cache
    try {
      if (redisClient.isOpen) {
        await redisClient.del(cacheKey);
      }
    } catch (error) {
      console.error('Redis cache delete failed:', error);
    }

    // 2. Delete from MySQL
    try {
      await prisma.session.delete({
        where: { tokenHash },
      });
    } catch (error: any) {
      // Prisma errors out if record to delete is not found; suppress if already deleted
      if (error.code !== 'P2025') {
        console.error('MySQL session delete failed:', error);
      }
    }
  }

  /**
   * Revoke all sessions for a specific user (token reuse / account suspension).
   */
  static async revokeAllUserSessions(userId: string): Promise<void> {
    // 1. Find all active sessions for the user to delete their cache keys
    const sessions = await prisma.session.findMany({
      where: { userId },
      select: { tokenHash: true },
    });

    // 2. Delete keys from Redis
    if (sessions.length > 0) {
      try {
        if (redisClient.isOpen) {
          const cacheKeys = sessions.map((s) => this.getCacheKey(s.tokenHash));
          await redisClient.del(cacheKeys);
        }
      } catch (error) {
        console.error('Redis bulk cache delete failed:', error);
      }
    }

    // 3. Delete from MySQL
    await prisma.session.deleteMany({
      where: { userId },
    });
  }
}
