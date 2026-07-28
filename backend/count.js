const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const excludedSlugs = ['shorts', 'videos', 'webstory', 'web-stories', 'podcasts'];
  const cats = await prisma.category.findMany({
    where: {
      slug: {
        notIn: excludedSlugs
      }
    },
    include: {
      _count: {
        select: { posts: true }
      }
    },
    orderBy: { name: 'asc' }
  });
  
  const totalPosts = await prisma.post.count({
    where: {
      category: {
        slug: {
          notIn: excludedSlugs
        }
      }
    }
  });

  console.log('ACTIVE_CATEGORIES_COUNT:', cats.length);
  console.log('TOTAL_ARTICLES:', totalPosts);
  cats.forEach((c, idx) => {
    console.log(`${idx + 1}|${c.name}|${c.nameGu}|${c.slug}|${c._count.posts}`);
  });
}

main().finally(() => prisma.$disconnect());
