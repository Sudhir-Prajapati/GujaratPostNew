/**
 * One-time backfill script: assigns sequential articleNumber to all existing posts
 * ordered by createdAt ascending (oldest article = #1).
 * Run once with: npx ts-node scripts/backfill-article-numbers.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Fetch all posts ordered oldest first
  const posts = await prisma.post.findMany({
    select: { id: true, createdAt: true, articleNumber: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Found ${posts.length} posts. Assigning article numbers...`);

  let count = 0;
  for (let i = 0; i < posts.length; i++) {
    const num = i + 1;
    if (posts[i].articleNumber === num) {
      // Already correct, skip
      continue;
    }
    await prisma.post.update({
      where: { id: posts[i].id },
      data: { articleNumber: num },
    });
    count++;
    if (count % 50 === 0) console.log(`  Updated ${count}/${posts.length}...`);
  }

  console.log(`✅ Done! Assigned article numbers 1 to ${posts.length}.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
