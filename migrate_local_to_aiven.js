import { PrismaClient } from '@prisma/client';

const localUrl = 'mysql://root:root@localhost:3306/gujarat_post';
const aivenUrl = process.env.DATABASE_URL;

const prismaLocal = new PrismaClient({ datasources: { db: { url: localUrl } } });
const prismaAiven = new PrismaClient({ datasources: { db: { url: aivenUrl } } });

async function migrate() {
  console.log('Connecting to Local MySQL & Aiven Cloud MySQL...');

  const localUsers = await prismaLocal.user.findMany({ include: { author: true } });
  console.log(`Found ${localUsers.length} local users`);

  for (const u of localUsers) {
    const { author, ...userData } = u;
    await prismaAiven.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData
    });

    if (author) {
      await prismaAiven.author.upsert({
        where: { userId: author.userId },
        update: author,
        create: author
      });
    }
  }

  const localCategories = await prismaLocal.category.findMany();
  console.log(`Found ${localCategories.length} local categories`);

  for (const c of localCategories) {
    await prismaAiven.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c
    });
  }

  const localTags = await prismaLocal.tag.findMany();
  console.log(`Found ${localTags.length} local tags`);

  for (const t of localTags) {
    await prismaAiven.tag.upsert({
      where: { slug: t.slug },
      update: t,
      create: t
    });
  }

  const localPosts = await prismaLocal.post.findMany();
  console.log(`Found ${localPosts.length} local posts in MySQL Workbench!`);

  let count = 0;
  for (const p of localPosts) {
    const articleNum = p.articleNumber || (1000 + count);
    const postData = {
      ...p,
      articleNumber: articleNum,
      seoTitle: p.seoTitle || `${p.titleGu} | ગુજરાત પોસ્ટ`,
      seoDescription: p.seoDescription || (p.excerptGu || p.excerpt || p.titleGu),
      seoKeywords: p.seoKeywords || 'gujarat news, breaking news, gujarat post',
      canonicalUrl: p.canonicalUrl || `https://gujaratpost.vercel.app/news/${p.slug}`,
      metaRobots: p.metaRobots || 'index, follow',
      excerpt: p.excerpt || 'Latest breaking updates and ground reporting from Gujarat Post.',
      excerptGu: p.excerptGu || 'ગુજરાત પોસ્ટની ખાસ રિપોર્ટ પ્રમાણે આ નિર્ણયથી સ્થાનિક લોકો અને વહીવટી વ્યવસ્થામાં સીધી અસર પડશે.',
      excerptHi: p.excerptHi || 'गुजरात पोस्ट की विशेष रिपोर्ट के अनुसार इस फैसले से स्थानीय लोगों पर सीधा असर पड़ेगा.',
      status: 'PUBLISHED'
    };

    await prismaAiven.post.upsert({
      where: { slug: p.slug },
      update: postData,
      create: postData
    });
    count++;
  }

  console.log(`SUCCESS! Migrated all ${count} posts to Aiven Cloud MySQL database!`);

  const totalAiven = await prismaAiven.post.count();
  console.log(`Total live posts in Aiven Cloud MySQL database: ${totalAiven}`);

  await prismaLocal.$disconnect();
  await prismaAiven.$disconnect();
}

migrate().catch(err => {
  console.error('Migration error:', err);
  prismaLocal.$disconnect();
  prismaAiven.$disconnect();
});
