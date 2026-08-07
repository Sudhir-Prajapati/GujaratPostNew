import { PrismaClient } from '@prisma/client';

// Use a singleton to avoid multiple Prisma instances during hot-reload in dev
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    errorFormat: 'minimal',
  });
}

export const prisma: PrismaClient = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

// Graceful shutdown — release DB connections when the process exits
process.on('beforeExit', async () => {
  await prisma.$disconnect().catch(() => {});
});
process.on('SIGINT', async () => {
  await prisma.$disconnect().catch(() => {});
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect().catch(() => {});
  process.exit(0);
});
