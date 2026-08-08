import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const allFeatured = await prisma.video.findMany({
    where: { isFeatured: true },
    select: { id: true, title: true, youtubeId: true, isFeatured: true, createdAt: true },
  });

  console.log(`Total Featured Videos in Database right now: ${allFeatured.length}`);
  allFeatured.forEach((v, i) => {
    console.log(`${i+1}. [${v.youtubeId}] ${v.title.slice(0, 45)} (ID: ${v.id})`);
  });

  const totalVideos = await prisma.video.count();
  console.log(`Total DB Videos: ${totalVideos}`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
