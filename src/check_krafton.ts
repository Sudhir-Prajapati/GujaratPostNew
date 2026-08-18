import { prisma } from './config/prisma.js';

async function main() {
  const heroSetting = await prisma.heroSetting.findUnique({ where: { id: 'default' } });
  console.log('--- HERO SETTING ROW IN DB ---');
  console.log(JSON.stringify(heroSetting, null, 2));

  const post = await prisma.post.findFirst({ where: { slug: { contains: 'krafton' } } });
  console.log('--- KRAFTON POST IN DB ---');
  console.log(JSON.stringify(post, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
