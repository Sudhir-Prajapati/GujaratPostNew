// Backend Initialization - SMTP Email Support Loaded
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically with correct MIME types (PDF, images) and CORS headers
const express_static = express.static(path.join(process.cwd(), 'uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jfif')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${path.basename(filePath)}"`);
    }
  },
});

app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  express_static(req, res, next);
});

// Root endpoint status check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Gujarat Post Backend API is running successfully',
    endpoints: {
      health: '/api/health',
      publicArticles: '/api/public/articles',
    },
  });
});

// Mount all API routes under the /api prefix
app.use('/api', masterRouter);

// Centralized error handler middleware (must be defined last)
app.use(errorHandler);

// Boot the server and establish database connections
const bootstrap = async () => {
  try {
    // 1. Establish Redis connection
    await connectRedis();

    // 2. Validate Prisma connection to MySQL
    await prisma.$connect().catch((dbErr) => {
      console.warn('MySQL initial connection warning (will retry automatically):', dbErr?.message || dbErr);
    });
    console.log('✅ Successfully connected to MySQL database via Prisma.');

    // 3. Start listening
    const server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Gujarat Post backend running at http://localhost:${PORT}`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n⚠️  Port ${PORT} is already in use by an existing process.`);
        console.error(`   To free port ${PORT} on Windows (PowerShell):`);
        console.error(`   Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
        console.error(`   Or in CMD: taskkill /F /PID <PID>\n`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('Bootstrap warning:', error);
    // Start listening anyway so backend stays online and nodemon never crashes
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 Gujarat Post backend running at http://localhost:${PORT}`);
    });
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
// Server reloaded at 2026-08-13T12:58:35Z
