'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { getPublicAds } from '@/lib/api';

export interface RandomAdItem {
  id: string;
  image: string;
  link: string;
  titleGu: string;
  titleEn: string;
  titleHi: string;
  descriptionGu?: string;
  descriptionEn?: string;
  descriptionHi?: string;
  sourceGu: string;
  sourceEn: string;
  sourceHi: string;
  buttonGu?: string;
  buttonEn?: string;
  buttonHi?: string;
}

const FALLBACK_RANDOM_ADS: RandomAdItem[] = [
  {
    id: 'f1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    link: '#',
    titleGu: 'રોજિંદા ઉપયોગ માટે પરફેક્ટ ટોપ શોધવાનું બંધ કરો',
    titleEn: 'Stop searching for the perfect top for daily use',
    titleHi: 'दैनिक उपयोग के लिए सही टॉप की तलाश बंद करें',
    descriptionGu: 'નરમ કાપડ, આકર્ષક સિલુએટ્સ અને કાલાતીત વિગતો આખો દિવસ તમને સ્ટાઇલિશ અને આરામદાયક રાખવા માટે તૈયાર કરવામાં આવ્યા છે...',
    descriptionEn: 'Soft fabrics, attractive silhouettes and timeless details designed to keep you stylish all day long...',
    descriptionHi: 'मुलायम कपड़े, आकर्षक कट और बेहतरीन स्टाइल आपको पूरे दिन आरामदायक रखने के लिए...',
    sourceGu: 'વ્યાપારી | પ્રાયોજિત',
    sourceEn: 'Merchant | Sponsored',
    sourceHi: 'व्यापारी | प्रायोजित',
    buttonGu: 'હવે ખરીદો',
    buttonEn: 'Shop Now',
    buttonHi: 'अभी खरीदें',
  },
  {
    id: 'f2',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&auto=format&fit=crop&q=80',
    link: '#',
    titleGu: 'મહિલાએ તેના પૂર્વ પ્રેમીએ આપેલી વીંટી વેચી, જ્વેલરીએ કહ્યું \'આ સાચું ન હોઈ શકે\'',
    titleEn: 'Woman sold ring given by ex-partner, jeweler said \'this cannot be true\'',
    titleHi: 'महिला ने अपने पूर्व प्रेमी द्वारा दी गई अंगूठी बेची, जौहरी ने कहा \'यह सच नहीं हो सकता\'',
    sourceGu: 'લાઇવ ડેઇલી | પ્રાયોજિત',
    sourceEn: 'Live Daily | Sponsored',
    sourceHi: 'लाइव डेली | प्रायोजित',
  },
  {
    id: 'f3',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    link: '#',
    titleGu: 'કોર્પોરેટ કર્મચારીઓ માટે ફાઇનાન્સ કોર્સ',
    titleEn: 'Finance course for corporate employees',
    titleHi: 'कॉर्पोरेट कर्मचारियों के लिए वित्त पाठ्यक्रम',
    descriptionGu: 'કોર્પોરેટ કર્મચારીઓ માટે ખાસ ડિઝાઇન કરેલા ફાઇનાન્સ અભ્યાસક્રમો',
    descriptionEn: 'Specially designed finance courses for corporate professionals',
    descriptionHi: 'कॉर्पोरेट कर्मचारियों के लिए विशेष रूप से डिज़ाइन किए गए वित्त पाठ्यक्रम',
    sourceGu: 'વેબસો | પ્રાયોજિત',
    sourceEn: 'Webso | Sponsored',
    sourceHi: 'वेबसो | प्रायोजित',
    buttonGu: 'હવે ખરીદો',
    buttonEn: 'Shop Now',
    buttonHi: 'अभी खरीदें',
  },
  {
    id: 'f4',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    link: '#',
    titleGu: '૨૦ સેલિબ્રિટી ટ્રાન્સફોર્મેશન જેણે હોલીવુડને સ્તબ્ધ કરી દીધું',
    titleEn: '20 celebrity transformations that stunned Hollywood',
    titleHi: '20 सेलिब्रिटी ट्रांसफॉर्मेशन जिन्होंने हॉलीवुड को चौंका दिया',
    sourceGu: 'રાજ્ય ન્યૂઝ | પ્રાયોજિત',
    sourceEn: 'State News | Sponsored',
    sourceHi: 'राज्य न्यूज | प्रायोजित',
  },
  {
    id: 'f5',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
    link: '#',
    titleGu: 'મારી કંપનીના બાર્બેક્યુમાં પતિએ મને નકામી કહી, પછી મેં તેના CEOને આ વાત કહી',
    titleEn: 'Husband called me useless at company BBQ, then I told his CEO this',
    titleHi: 'कंपनी के बारबेक्यू में पति ने मुझे बेकार कहा, फिर मैंने उनके सीईओ को यह बात बताई',
    sourceGu: 'બીચ રાઇડર | પ્રાયોજિત',
    sourceEn: 'Beach Rider | Sponsored',
    sourceHi: 'बीच राइडर | प्रायोजित',
  },
  {
    id: 'f6',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
    link: '#',
    titleGu: 'આ નવી સ્માર્ટ વોચ દેશભરમાં ધૂમ મચાવી રહી છે',
    titleEn: 'This new smartwatch is creating waves across the country',
    titleHi: 'यह नई स्मार्टवॉच देशभर में धूम मचा रही है',
    descriptionGu: 'પસંદ પડે તેવી લક્ઝરી ઘડિયાળોની નવી પેઢી સાથે તમારા સ્વાસ્થ્યને ટ્રેક કરો અને ફિટ રહો.',
    descriptionEn: 'Track your health and stay fit with a new generation of luxury smartwatches.',
    descriptionHi: 'स्मार्ट स्वास्थ्य ट्रैकिंग और आधुनिक डिजाइन के साथ फिट रहें।',
    sourceGu: 'સ્માર્ટ ટેક | પ્રાયોજિત',
    sourceEn: 'Smart Tech | Sponsored',
    sourceHi: 'स्मार्ट टेक | प्रायोजित',
    buttonGu: 'હવે ઓર્ડર કરો',
    buttonEn: 'Order Now',
    buttonHi: 'अभी ऑर्डर करें',
  },
  {
    id: 'f7',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    link: '#',
    titleGu: 'પાસપોર્ટ વગર તમે મુલાકાત લઈ શકો તેવા સુંદર ટાપુ રિસોર્ટ્સ',
    titleEn: 'Beautiful island resorts you can visit without a passport',
    titleHi: 'बिना पासपोर्ट के आप जिन खूबसूरत द्वीप रिसॉर्ट्स की यात्रा कर सकते हैं',
    sourceGu: 'પ્રવાસન ડેસ્ક | પ્રાયોજિત',
    sourceEn: 'Travel Desk | Sponsored',
    sourceHi: 'पर्यटन डेस्क | प्रायोजित',
  },
];

export default function RandomAdsSection() {
  const { language } = useApp();
  const [adItems, setAdItems] = useState<RandomAdItem[]>(FALLBACK_RANDOM_ADS);

  useEffect(() => {
    getPublicAds().then((adsRes) => {
      if (!adsRes || !Array.isArray(adsRes) || adsRes.length === 0) return;

      const collected: RandomAdItem[] = [];

      adsRes.forEach((ad: any) => {
        if (!ad.isActive) return;
        const isRandom = Boolean(ad.includeInRandom) || ad.section?.toUpperCase().includes('RANDOM') || ad.section?.toUpperCase().includes('BOTTOM');
        if (!isRandom) return;

        ['1', '2', '3'].forEach((num) => {
          const img = ad[`image${num}`];
          const link = ad[`link${num}`];
          if (img && typeof img === 'string' && img.trim() !== '') {
            collected.push({
              id: `${ad.id}-${num}`,
              image: img.trim(),
              link: link && typeof link === 'string' ? link.trim() : '#',
              titleGu: ad.title || 'સ્પેશિયલ સ્પોન્સર ઓફર',
              titleEn: ad.title || 'Special Sponsored Offer',
              titleHi: ad.title || 'विशेष प्रायोजित ऑफर',
              sourceGu: 'પ્રાયોજિત',
              sourceEn: 'Sponsored',
              sourceHi: 'प्रायोजित',
              buttonGu: 'હવે જુઓ',
              buttonEn: 'View Now',
              buttonHi: 'अभी देखें',
            });
          }
        });
      });

      if (collected.length > 0) {
        // If collected items are less than 7, pad with fallbacks to complete the 7-card layout
        const finalPool = [...collected];
        let fallbackIdx = 0;
        while (finalPool.length < 7) {
          finalPool.push({
            ...FALLBACK_RANDOM_ADS[fallbackIdx % FALLBACK_RANDOM_ADS.length],
            id: `pad-${finalPool.length}`,
          });
          fallbackIdx++;
        }
        setAdItems(finalPool);
      }
    }).catch(() => {});
  }, []);

  // Chunk items into 7 ads per section
  const sectionsCount = Math.max(1, Math.ceil(adItems.length / 7));
  const sections: RandomAdItem[][] = [];

  for (let i = 0; i < sectionsCount; i++) {
    const chunk = adItems.slice(i * 7, (i + 1) * 7);
    // If last chunk has less than 7 items, pad it with fallbacks to keep the exact UI layout
    while (chunk.length < 7) {
      chunk.push(FALLBACK_RANDOM_ADS[chunk.length % FALLBACK_RANDOM_ADS.length]);
    }
    sections.push(chunk);
  }

  const getTitle = (item: RandomAdItem) => {
    if (language === 'hi') return item.titleHi || item.titleGu || item.titleEn;
    if (language === 'en') return item.titleEn || item.titleGu;
    return item.titleGu || item.titleEn;
  };

  const getDesc = (item: RandomAdItem) => {
    if (language === 'hi') return item.descriptionHi || item.descriptionGu || item.descriptionEn;
    if (language === 'en') return item.descriptionEn || item.descriptionGu;
    return item.descriptionGu || item.descriptionEn;
  };

  const getSource = (item: RandomAdItem) => {
    if (language === 'hi') return item.sourceHi || item.sourceGu;
    if (language === 'en') return item.sourceEn || item.sourceGu;
    return item.sourceGu || item.sourceEn;
  };

  const getBtn = (item: RandomAdItem) => {
    if (language === 'hi') return item.buttonHi || item.buttonGu || 'अभी देखें';
    if (language === 'en') return item.buttonEn || item.buttonGu || 'View Now';
    return item.buttonGu || 'હવે ખરીદો';
  };

  return (
    <section id="infinite-ads-section" className="mx-auto max-w-screen-xl px-2 sm:px-4 py-8 select-none">
      {sections.map((secItems, secIdx) => {
        const item1 = secItems[0];
        const item2 = secItems[1];
        const item3 = secItems[2];
        const item4 = secItems[3];
        const item5 = secItems[4];
        const item6 = secItems[5];
        const item7 = secItems[6];

        return (
          <div key={secIdx} className="mb-10 space-y-6">
            {/* Top Header Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/80" />
              </div>
              <span className="relative bg-background px-4 text-[13px] md:text-[14px] font-extrabold text-muted-foreground uppercase tracking-widest select-none">
                {language === 'gu' ? 'તમને આ પણ ગમશે' : language === 'hi' ? 'आपको यह भी पसंद आ सकता है' : 'You May Also Like'}
              </span>
            </div>

            {/* 7-Card Sponsored Grid Container */}
            <div className="bg-card/90 dark:bg-card border border-border/80 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm space-y-6">
              
              {/* ── ROW 1: 2 Horizontal Cards ─────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1 */}
                <a
                  href={item1.link !== '#' ? item1.link : undefined}
                  target={item1.link !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col sm:flex-row gap-4 bg-background dark:bg-card/40 border border-border/60 rounded-2xl p-3.5 sm:p-4 hover:border-red-500/40 hover:shadow-md transition-all duration-300 min-w-0"
                >
                  <div className="relative w-full sm:w-[45%] aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item1.image}
                      alt={getTitle(item1)}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0 flex-1 py-1">
                    <div>
                      <h4 className="text-[14.5px] sm:text-[15.5px] font-black text-foreground leading-snug line-clamp-2 group-hover:text-[#B3121B] transition-colors">
                        {getTitle(item1)}
                      </h4>
                      {getDesc(item1) && (
                        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 mt-1.5 font-medium">
                          {getDesc(item1)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                      <span className="text-[11px] font-bold text-muted-foreground/90">
                        {getSource(item1)}
                      </span>
                      {item1.buttonGu && (
                        <span className="text-[11.5px] font-black text-[#B3121B] border border-red-500/60 rounded-full px-3 py-0.5 hover:bg-[#B3121B] hover:text-white transition-colors">
                          {getBtn(item1)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>

                {/* Card 2 */}
                <a
                  href={item2.link !== '#' ? item2.link : undefined}
                  target={item2.link !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col sm:flex-row gap-4 bg-background dark:bg-card/40 border border-border/60 rounded-2xl p-3.5 sm:p-4 hover:border-red-500/40 hover:shadow-md transition-all duration-300 min-w-0"
                >
                  <div className="relative w-full sm:w-[45%] aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item2.image}
                      alt={getTitle(item2)}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0 flex-1 py-1">
                    <div>
                      <h4 className="text-[14.5px] sm:text-[15.5px] font-black text-foreground leading-snug line-clamp-3 group-hover:text-[#B3121B] transition-colors">
                        {getTitle(item2)}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                      <span className="text-[11px] font-bold text-muted-foreground/90">
                        {getSource(item2)}
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* ── ROW 2: 3 Vertical Cards ─────────────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card 3 */}
                <a
                  href={item3.link !== '#' ? item3.link : undefined}
                  target={item3.link !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-background dark:bg-card/40 border border-border/60 rounded-2xl p-3.5 sm:p-4 hover:border-red-500/40 hover:shadow-md transition-all duration-300 min-w-0"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-muted mb-3">
                    <Image
                      src={item3.image}
                      alt={getTitle(item3)}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-[14.5px] font-black text-foreground leading-snug line-clamp-2 group-hover:text-[#B3121B] transition-colors">
                        {getTitle(item3)}
                      </h4>
                      {getDesc(item3) && (
                        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 mt-1.5 font-medium">
                          {getDesc(item3)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/40">
                      <span className="text-[11px] font-bold text-muted-foreground/90">
                        {getSource(item3)}
                      </span>
                      {item3.buttonGu && (
                        <span className="text-[11.5px] font-black text-[#B3121B] border border-red-500/60 rounded-full px-3 py-0.5 hover:bg-[#B3121B] hover:text-white transition-colors">
                          {getBtn(item3)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>

                {/* Card 4 */}
                <a
                  href={item4.link !== '#' ? item4.link : undefined}
                  target={item4.link !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-background dark:bg-card/40 border border-border/60 rounded-2xl p-3.5 sm:p-4 hover:border-red-500/40 hover:shadow-md transition-all duration-300 min-w-0"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-muted mb-3">
                    <Image
                      src={item4.image}
                      alt={getTitle(item4)}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-[14.5px] font-black text-foreground leading-snug line-clamp-3 group-hover:text-[#B3121B] transition-colors">
                        {getTitle(item4)}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/40">
                      <span className="text-[11px] font-bold text-muted-foreground/90">
                        {getSource(item4)}
                      </span>
                    </div>
                  </div>
                </a>

                {/* Card 5 */}
                <a
                  href={item5.link !== '#' ? item5.link : undefined}
                  target={item5.link !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-background dark:bg-card/40 border border-border/60 rounded-2xl p-3.5 sm:p-4 hover:border-red-500/40 hover:shadow-md transition-all duration-300 min-w-0"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-muted mb-3">
                    <Image
                      src={item5.image}
                      alt={getTitle(item5)}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-[14.5px] font-black text-foreground leading-snug line-clamp-3 group-hover:text-[#B3121B] transition-colors">
                        {getTitle(item5)}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-2 border-t border-border/40">
                      <span className="text-[11px] font-bold text-muted-foreground/90">
                        {getSource(item5)}
                      </span>
                    </div>
                  </div>
                </a>
              </div>

              {/* ── ROW 3: 2 Horizontal Cards ─────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 6 */}
                <a
                  href={item6.link !== '#' ? item6.link : undefined}
                  target={item6.link !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col sm:flex-row gap-4 bg-background dark:bg-card/40 border border-border/60 rounded-2xl p-3.5 sm:p-4 hover:border-red-500/40 hover:shadow-md transition-all duration-300 min-w-0"
                >
                  <div className="relative w-full sm:w-[45%] aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item6.image}
                      alt={getTitle(item6)}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0 flex-1 py-1">
                    <div>
                      <h4 className="text-[14.5px] sm:text-[15.5px] font-black text-foreground leading-snug line-clamp-2 group-hover:text-[#B3121B] transition-colors">
                        {getTitle(item6)}
                      </h4>
                      {getDesc(item6) && (
                        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2 mt-1.5 font-medium">
                          {getDesc(item6)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                      <span className="text-[11px] font-bold text-muted-foreground/90">
                        {getSource(item6)}
                      </span>
                      {item6.buttonGu && (
                        <span className="text-[11.5px] font-black text-[#B3121B] border border-red-500/60 rounded-full px-3 py-0.5 hover:bg-[#B3121B] hover:text-white transition-colors">
                          {getBtn(item6)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>

                {/* Card 7 */}
                <a
                  href={item7.link !== '#' ? item7.link : undefined}
                  target={item7.link !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group flex flex-col sm:flex-row gap-4 bg-background dark:bg-card/40 border border-border/60 rounded-2xl p-3.5 sm:p-4 hover:border-red-500/40 hover:shadow-md transition-all duration-300 min-w-0"
                >
                  <div className="relative w-full sm:w-[45%] aspect-[4/3] shrink-0 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={item7.image}
                      alt={getTitle(item7)}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between min-w-0 flex-1 py-1">
                    <div>
                      <h4 className="text-[14.5px] sm:text-[15.5px] font-black text-foreground leading-snug line-clamp-3 group-hover:text-[#B3121B] transition-colors">
                        {getTitle(item7)}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                      <span className="text-[11px] font-bold text-muted-foreground/90">
                        {getSource(item7)}
                      </span>
                    </div>
                  </div>
                </a>
              </div>

            </div>

            {/* Bottom Separator / More Sponsored Links Divider */}
            {secIdx < sections.length - 1 && (
              <div className="relative flex items-center justify-center pt-6 pb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/80" />
                </div>
                <span className="relative bg-background px-4 text-[12px] md:text-[13px] font-extrabold text-muted-foreground hover:text-[#B3121B] transition-colors select-none cursor-pointer border border-border/80 rounded-full py-1">
                  {language === 'gu' ? 'વધુ પ્રાયોજિત લિંક્સ' : language === 'hi' ? 'अधिक प्रायोजित लिंक्स' : 'More Sponsored Links'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
