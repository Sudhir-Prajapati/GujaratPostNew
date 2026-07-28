const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleImages = [
  'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
  '/assets/demo/1.jpg',
  '/assets/demo/2.jpg',
  '/assets/demo/3.jpg',
  '/assets/demo/4.jpg',
  '/assets/demo/5.jpg',
];

const categoryTemplates = {
  business: {
    titlesGu: [
      'ગુજરાતમાં નવું ઔદ્યોગિક પેકેજ જાહેર, લઘુ ઉદ્યોગોને મળશે મોટી સબસિડી',
      'સોના-ચાંદીના ભાવમાં મોટો ઘટાડો: જાણો આજના અમદાવાદના આંકડા',
      'શેરબજારમાં જોરદાર ઉછાળો, સેન્સેક્સ અને નિફ્ટી રેકોર્ડ ઊંચાઈ પર',
      'ગુજરાતના ટેક્સટાઇલ ઉદ્યોગમાં નવી નિકાસ નીતિથી વેપારીઓમાં ખુશી',
      'ડાયમંડ સિટી સુરતમાં રફ ડાયમંડના વેપારમાં 15% ઉછાળો નોંધાયો',
      'નાણાકીય વર્ષના બીજા ત્રિમાસિક ગાળામાં વ્યાજદરમાં ફેરફાર શક્ય',
      'અમદાવાદ એરપોર્ટ પર નવા કાર્ગો ટર્મિનલનું લોકાર્પણ, વેપાર વધશે',
      'સ્ટાર્ટઅપ ગુજરાત નીતિ હેઠળ 100 થી વધુ યુવાનોને ફંડિંગ મંજૂર',
    ]
  },
  crime: {
    titlesGu: [
      'સાયબર ક્રાઇમ સેલનો મોટો પર્દાફાશ: ઓનલાઇન ઠગાઈ ગેંગના 5 પકડાયા',
      'અમદાવાદ ક્રાઇમ બ્રાન્ચે વિદેશી દારૂનો મોટો જથ્થો ઝડપી પાડ્યો',
      'સુરતમાં સોનાની દુકાનમાં ચોરી કરનાર શાતિર ચોર ગણતરીના કલાકમાં ઝબ્બે',
      'વડોદરામાં ડુપ્લિકેટ દવા બનાવતી ફેક્ટરી પર દરોડો, કરોડોનો મુદ્દામાલ સીઝ',
      'રાજકોટમાં ટ્રાફિક સિગ્નલ પર નકલી પોલીસ બની તોડ કરતો શખ્સ પકડાયો',
      'ગાંધીનગરમાં સરકારી યોજનાના નામે નાણાં પડાવનાર ટોળકીનો સફાયો',
      'ભાવનગરમાં જમીન પચાવી પાડનાર કૌભાંડમાં મુખ્ય સૂત્રધાર સામે ફરિયાદ',
    ]
  },
  politics: {
    titlesGu: [
      'ગુજરાત વિધાનસભાના આગામી સત્રમાં રજૂ થશે 5 મહત્વના વિધેયક',
      'સ્થાનિક સ્વરાજ્યની ચૂંટણીઓ માટે મુખ્ય રાજકીય પક્ષોનું મંથન શરૂ',
      'કેન્દ્રીય મંત્રીનો ગુજરાત પ્રવાસ: નવી વિકાસ યોજનાઓનું ભૂમિપૂજન',
      'પંચાયત સંગઠનમાં મોટા ફેરફાર, નવા પદાધિકારીઓની જાહેરાત કરાઈ',
      'વિરોધ પક્ષ દ્વારા ખેડૂતોના મુદ્દે આવેદનપત્ર સુપ્રત કરાયું',
      'ગાંધીનગરમાં મંત્રીમંડળની મહત્વની બેઠક, લોકકલ્યાણકારી નિર્ણયો લેવાયા',
    ]
  },
  national: {
    titlesGu: [
      'સંસદમાં મહત્વના બિલ પર ચર્ચા, વિપક્ષના હોબાળા વચ્ચે ગૃહ મુલતવી',
      'દેશભરમાં રેલવે નેટવર્કના આધુનિકીકરણ માટે નવી યોજના જાહેર',
      'સુપ્રીમ કોર્ટનો ઐતિહાસિક ચુકાદો: નાગરિકોના અધિકારો પર મહત્વની ટિપ્પણી',
      'ભારત અને મિત્ર રાષ્ટ્રો વચ્ચે દ્વિપક્ષીય વેપાર કરાર પર હસ્તાક્ષર',
      'કેન્દ્ર સરકાર દ્વારા શ્રમિકો માટે નવી વેતન નીતિની જાહેરાત',
    ]
  },
  gujarat: {
    titlesGu: [
      'ગુજરાતમાં ચોમાસાની જમાવટ: દક્ષિણ ગુજરાતમાં ભારે વરસાદનું એલર્ટ',
      'નર્મદા ડેમની જળસપાટીમાં સતત વધારો, તંત્ર દ્વારા એલર્ટ જાહેર',
      'અમદાવાદ મેટ્રો ફેઝ-2 કામગીરી આખરી તબક્કામાં, ટૂંક સમયમાં શરૂ થશે',
      'ગુજરાત પોલીસમાં 10,000 થી વધુ નવી ભરતી પ્રક્રિયાની જાહેરાત',
      'અંબાજી ધામમાં ભાદરવી પૂનમના મેળા માટે એસટી બસોના વિશેષ રૂટ',
    ]
  },
  default: {
    titlesGu: [
      'નવા સંશોધનમાં મહત્વનો દાવો: ભવિષ્યની ટેકનોલોજીથી માનવજીવન સરળ બનશે',
      'નાગરિકો માટે સત્તાવાર સૂચનાઓનું પાલન કરવું અનિવાર્ય',
      'ગુજરાત પોસ્ટ વિશેષ રિપોર્ટ: સ્થાનિક સગવડોમાં મોટો સુધારો',
      'વિકાસલક્ષી પ્રોજેક્ટ્સ ઝડપથી પૂર્ણ કરવા વહીવટી તંત્રના આદેશ',
      'શિક્ષણ અને આરોગ્ય ક્ષેત્રે નવી તકો ઉભી કરવાનો સરકારનો સંકલ્પ',
      'પર્યાવરણ સુરક્ષા માટે રાજ્યભરમાં વૃક્ષારોપણ ઝુંબેશ શરૂ',
    ]
  }
};

async function main() {
  const excludedSlugs = ['shorts', 'videos', 'webstory', 'web-stories', 'podcasts'];
  
  const categories = await prisma.category.findMany({
    where: {
      slug: {
        notIn: excludedSlugs
      }
    },
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });

  const authors = await prisma.author.findMany();
  if (!authors || authors.length === 0) {
    console.error('No authors found.');
    return;
  }

  console.log(`Found ${categories.length} active categories.`);

  let totalAdded = 0;

  for (const cat of categories) {
    const currentCount = cat._count.posts;
    const targetCount = 20;

    if (currentCount < targetCount) {
      const needed = targetCount - currentCount;
      console.log(`Category "${cat.name}" (${cat.slug}) currently has ${currentCount} posts. Adding ${needed} articles...`);

      const tplList = categoryTemplates[cat.slug] || categoryTemplates.default;

      for (let i = 1; i <= needed; i++) {
        const randIndex = Math.floor(Math.random() * tplList.titlesGu.length);
        const titleBase = tplList.titlesGu[randIndex];
        const titleGu = `${titleBase} - અહેવાલ #${currentCount + i}`;
        const title = `${cat.name} Update News Report #${currentCount + i}`;
        const titleHi = `${cat.nameHi || cat.name} विशेष समाचार अपडेट #${currentCount + i}`;

        const slug = `${cat.slug}-news-update-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const author = authors[Math.floor(Math.random() * authors.length)];
        const featuredImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        const views = Math.floor(Math.random() * 50000) + 1200;

        const excerptGu = `${cat.nameGu} વિસ્તારના તાજેતરના મહત્વના અહેવાલ અંગેની તમામ વિગતવાર માહિતી અને અપડેટ્સ...`;
        const contentGu = `## 📌 એક નજરમાં (KEY HIGHLIGHTS)\n--------------------------------------------------\n• ${cat.nameGu} ક્ષેત્રે નવી યોજના અને તાજેતરના ફેરફારો અમલી\n• સ્થાનિક નાગરિકો અને સત્તાવાર તંત્ર દ્વારા સઘન કામગીરી\n--------------------------------------------------\n\n${cat.nameGu} સંબંધિત આજના મહત્વના અહેવાલમાં જણાવ્યા અનુસાર, વહીવટી વિભાગ દ્વારા નવી માર્ગદર્શિકા બહાર પાડવામાં આવી છે. આ નિર્ણયથી વિસ્તારના લોકોને સીધો લાભ મળશે અને વિકાસ કાર્યને વેગ મળશે.\n\n> "${cat.nameGu} ના સર્વાંગી વિકાસ માટે તમામ જરૂરી પગલાં લેવામાં આવી રહ્યા છે."\n> — ગુજરાત પોસ્ટ ખાસ રિપોર્ટ\n\nઆગામી દિવસોમાં આ અંગે વધુ માહિતી જાહેર કરવામાં આવશે. નાગરિકોને સત્તાવાર માહિતી માટે તંત્રના સંપર્કમાં રહેવા અપીલ કરવામાં આવી છે.`;

        await prisma.post.create({
          data: {
            slug,
            title,
            titleGu,
            titleHi,
            excerpt: `Comprehensive news coverage regarding ${cat.name}...`,
            excerptGu,
            excerptHi: `${cat.nameHi || cat.name} क्षेत्र का प्रमुख समाचार अपडेट...`,
            content: `Detailed report on ${cat.name} news developments. All key details and updates available here.`,
            contentGu,
            contentHi: `${cat.nameHi || cat.name} क्षेत्र के हालिया घटनाक्रम पर विस्तृत रिपोर्ट।`,
            featuredImage,
            status: 'PUBLISHED',
            categoryId: cat.id,
            authorId: author.id,
            views,
            readingTime: Math.floor(Math.random() * 3) + 2,
            isTrending: Math.random() > 0.7,
            isFeatured: Math.random() > 0.8,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
          }
        });

        totalAdded++;
      }
    } else {
      console.log(`Category "${cat.name}" (${cat.slug}) already has ${currentCount} posts (>= 20).`);
    }
  }

  console.log(`\nSUCCESSFULLY SEEDED ${totalAdded} NEW ARTICLES! Every active category now has at least 20 articles.`);
}

main().finally(() => prisma.$disconnect());
