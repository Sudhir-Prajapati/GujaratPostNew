const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fixing article timestamps so editor published articles appear FIRST...');

  // 1. Identify real user created/edited articles (like flood news)
  const floodArticles = await prisma.post.findMany({
    where: {
      OR: [
        { titleGu: { contains: 'પૂરનો કહેર' } },
        { title: { contains: 'Flood' } }
      ]
    }
  });

  const now = new Date();

  // Set flood news to right NOW
  for (const art of floodArticles) {
    await prisma.post.update({
      where: { id: art.id },
      data: {
        createdAt: now,
        updatedAt: now,
      }
    });
    console.log(`Updated flood news "${art.titleGu}" to timestamp ${now.toISOString()}`);
  }

  // 2. Adjust seeded test articles (titles with "અહેવાલ #") to past dates (older than 1 day ago)
  const seededArticles = await prisma.post.findMany({
    where: {
      titleGu: { contains: 'અહેવાલ #' }
    }
  });

  console.log(`Found ${seededArticles.length} seeded test articles to push to past dates.`);

  let index = 0;
  for (const art of seededArticles) {
    index++;
    // Past dates from 2 days ago down to 30 days ago
    const pastDate = new Date(Date.now() - (2 * 24 * 60 * 60 * 1000) - (index * 10 * 60 * 1000));
    await prisma.post.update({
      where: { id: art.id },
      data: {
        createdAt: pastDate,
        updatedAt: pastDate,
      }
    });
  }

  console.log('TIMESTAMPS SUCCESSFULLY UPDATED! Newly created/edited articles will now ALWAYS come FIRST.');
}

main().finally(() => prisma.$disconnect());
