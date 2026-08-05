import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// The exact 5 featured YouTube IDs chosen by user
const FIVE_FEATURED_YOUTUBE_IDS = [
  'ituhQR8gwas', // આ બેરોજગારી નથી તો શું છે ?
  'XYflVjhvEAQ', // નારી શક્તિના પીપુડાં વગાડે છે મંત્રી રિવાબા !
  'XcyLo_266ho', // આ આંદોલનની આગ છે !
  'qDOdT087s4A', // સરકારી તિજોરીમાંથી લૂંટ, પિતા- પુત્રએ રૂ. 128 કરોડનું GST નું કૌભાંડ
  'A_5vL-ngK4M', // સત્તાનો આવો નશો કેમ ? કપડવંજ તાલુકા પંચાયતના પ્રમુખ...
];

async function main() {
  console.log('Cleaning DB: Setting ALL videos to isFeatured=false except the exact 5 chosen ones...');

  // 1. Unfeature ALL videos in DB first
  await prisma.video.updateMany({
    data: { isFeatured: false },
  });

  // 2. Set isFeatured=true ONLY for the 5 chosen YouTube IDs
  const res = await prisma.video.updateMany({
    where: {
      youtubeId: { in: FIVE_FEATURED_YOUTUBE_IDS }
    },
    data: { isFeatured: true }
  });

  console.log(`Successfully updated ${res.count} records to isFeatured=true.`);

  // 3. Delete any dummy English seed videos (like 'Rain alert...', 'Gujarat Titans...')
  await prisma.video.deleteMany({
    where: {
      OR: [
        { title: { contains: 'Rain alert' } },
        { title: { contains: 'Gujarat Titans' } },
        { title: { contains: 'Demo' } },
      ]
    }
  });

  // 4. Verify all featured videos in DB
  const finalFeatured = await prisma.video.findMany({
    where: { isFeatured: true },
    select: { id: true, title: true, youtubeId: true, isFeatured: true }
  });

  console.log(`\nVerified DB Featured Videos (${finalFeatured.length} total):`);
  finalFeatured.forEach((v, i) => console.log(`${i+1}. [${v.youtubeId}] ${v.title.slice(0, 50)}`));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
