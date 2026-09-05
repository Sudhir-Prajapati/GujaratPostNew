import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let isRedisOfflineNotified = false;

export const redisClient = createClient({
  url: redisUrl,
  socket: {
    // Attempt fast connection check; if offline, don't spam reconnection loops
    reconnectStrategy: (retries) => {
      if (retries >= 1) {
        return false; // Stop retries immediately to allow smooth database-only fallback
      }
      return 500;
    },
    connectTimeout: 2000,
  },
});

redisClient.on('error', (err: any) => {
  if (!isRedisOfflineNotified) {
    isRedisOfflineNotified = true;
    console.log('ℹ️  [Redis] Redis server offline (database-only fallback active)');
  }
});

redisClient.on('connect', () => {
  isRedisOfflineNotified = false;
  console.log('✅ [Redis] Connection established successfully.');
});

// Helper function to initialize Redis connection
export const connectRedis = async (): Promise<void> => {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch {
      if (!isRedisOfflineNotified) {
        isRedisOfflineNotified = true;
        console.log('ℹ️  [Redis] Operating in database-only mode.');
      }
    }
  }
};

