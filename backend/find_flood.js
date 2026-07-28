const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { titleGu: { contains: 'પૂરનો કહેર' } },
        { title: { contains: 'Flood' } }
      ]
    },
    include: { category: true }
  });
  console.log('FOUND POSTS:', JSON.stringify(posts, null, 2));
}

main().finally(() => prisma.$disconnect());
