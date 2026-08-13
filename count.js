const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.post.findMany({ include: { category: true } }).then(posts => {
  const c = {
    'Ahmedabad (અમદાવાદ)': 0,
    'Gandhinagar (ગાંધીનગર)': 0,
    'Surat (સુરત)': 0,
    'Vadodara (વડોદરા)': 0,
    'Rajkot (રાજકોટ)': 0,
    'Other Cities & State (અન્ય શહેરો / રાજ્ય)': 0
  };

  posts.forEach(item => {
    const loc = (item.location || '').toLowerCase();
    const cat = (item.category?.slug || '').toLowerCase();
    const title = (item.titleGu || item.title || '').toLowerCase();

    if (loc.includes('ahmedabad') || cat.includes('ahmedabad') || title.includes('અમદાવાદ')) {
      c['Ahmedabad (અમદાવાદ)']++;
    } else if (loc.includes('gandhinagar') || cat.includes('gandhinagar') || title.includes('ગાંધીનગર')) {
      c['Gandhinagar (ગાંધીનગર)']++;
    } else if (loc.includes('surat') || cat.includes('surat') || title.includes('સુરત')) {
      c['Surat (સુરત)']++;
    } else if (loc.includes('vadodara') || cat.includes('vadodara') || title.includes('વડોદરા')) {
      c['Vadodara (વડોદરા)']++;
    } else if (loc.includes('rajkot') || cat.includes('rajkot') || title.includes('રાજકોટ')) {
      c['Rajkot (રાજકોટ)']++;
    } else {
      c['Other Cities & State (અન્ય શહેરો / રાજ્ય)']++;
    }
  });

  console.log('=== ARTICLE COUNTS SUMMARY ===');
  console.log(JSON.stringify(c, null, 2));
  console.log('TOTAL_ARTICLES_IN_DB:', posts.length);
  process.exit(0);
});
