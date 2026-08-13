const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const where1 = {
    OR: [
      { category: { slug: { in: ['other-cities', 'othercities', 'gujarat', 'state'] } } },
      { location: { notIn: ['Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot', 'અમદાવાદ', 'ગાંધીનગર', 'સુરત', 'વડોદરા', 'રાજકોટ'] } },
    ],
  };

  const res1 = await prisma.post.findMany({ where: where1 });
  console.log('Query 1 count:', res1.length);

  const allPosts = await prisma.post.findMany({ include: { category: true } });
  console.log('Total posts in DB:', allPosts.length);

  const catCounts = {};
  allPosts.forEach(p => {
    const slug = p.category?.slug || 'no-cat';
    catCounts[slug] = (catCounts[slug] || 0) + 1;
  });
  console.log('Category counts in DB:', JSON.stringify(catCounts, null, 2));

  process.exit(0);
}

main();
