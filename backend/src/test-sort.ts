import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Testing category displayOrder sorting...');
  try {
    const categories = await prisma.category.findMany({
      where: {
        slug: {
          notIn: ['shorts', 'videos', 'webstory', 'web-stories', 'podcasts'],
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });
    console.log('Categories returned in this order:');
    categories.forEach((cat) => {
      console.log(`- ${cat.name} (slug: ${cat.slug}, order: ${cat.displayOrder})`);
    });
  } catch (error) {
    console.error('Error querying categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
