import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { connectRedis, redisClient } from './config/redis.js';
import { prisma } from './config/prisma.js';
import masterRouter from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

// Load environment variables
dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 5000;

// Trust proxy header configuration (crucial for accurate IP rate limiting downstream)
app.set('trust proxy', true);

// Configure CORS to permit Next.js frontend calls & mobile apps with credentials
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, PWABuilder, native APKs)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically with correct MIME types (including .jfif → image/jpeg)
const express_static = express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jfif')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  },
});
app.use('/uploads', express_static);

// Mount all API routes under the /api prefix
app.use('/api', masterRouter);

// Centralized error handler middleware (must be defined last)
app.use(errorHandler);

// Boot the server and establish database connections
const bootstrap = async () => {
  try {
    // 1. Establish Redis connection
    await connectRedis();
    if (redisClient.isOpen) {
      console.log('Successfully connected to Redis database.');
    } else {
      console.warn('Redis is offline. Operating in database-only fallback mode.');
    }

    // 2. Validate Prisma connection to MySQL
    await prisma.$connect();
    console.log('Successfully connected to MySQL database via Prisma.');

    // 3. Start listening
    app.listen(PORT, () => {
      console.log(`Gujarat Post backend running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to bootstrap Gujarat Post backend server:', error);
    process.exit(1);
  }
};

bootstrap();

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  try {
    // Disconnect Prisma Client
    await prisma.$disconnect();
    console.log('MySQL connection closed.');

    // Disconnect Redis Client
    if (redisClient.isOpen) {
      await redisClient.disconnect();
      console.log('Redis connection closed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};  

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
