'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Clock } from 'lucide-react';
import { getArticleTitle, getCategoryLabel, formatViews, getLocalized } from '@/data';
import { getPublicArticles, getHeroSettings } from '@/lib/api';
import { useApp } from '@/components/AppProvider';
import { toGuDigits } from '@/lib/utils';
import type { Article, Language } from '@/types';

export default function LatestUpdatesSection({
  view = 'all',
  initialArticles,
  initialMostRead,
}: {
  view?: 'timeline' | 'sidebar' | 'all';
  initialArticles?: Article[];
  initialMostRead?: Article[];
}) {
  const { language } = useApp();
  const [latestNews, setLatestNews] = useState<Article[]>(
    initialArticles ? initialArticles.slice(0, 10) : []
  );
  const [mostRead, setMostRead] = useState<Article[]>(
    initialMostRead || (initialArticles && initialArticles.length > 10 ? initialArticles.slice(10, 16) : [])
  );

  // Gold and Silver rates (replicated from the screenshot layout)
  const goldPrice = 73450;
  const goldChange = 450;
  const silverPrice = 82800;

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setLatestNews(initialArticles.slice(0, 10));
      if (initialMostRead && initialMostRead.length > 0) {
        setMostRead(initialMostRead);
      } else {
        setMostRead(initialArticles.length > 10 ? initialArticles.slice(10, 16) : initialArticles.slice(0, 6));
      }
      return;
    }

    Promise.all([
      getPublicArticles({ limit: 20 }),
      getHeroSettings(),
    ]).then(([res, heroRes]: any[]) => {
      if (res && res.articles && res.articles.length > 0) {
        setLatestNews(res.articles.slice(0, 10));
      }
      if (heroRes && Array.isArray(heroRes.mostReadArticles) && heroRes.mostReadArticles.length > 0) {
        setMostRead(heroRes.mostReadArticles);
      } else if (res && res.articles) {
        setMostRead(res.articles.length > 10 ? res.articles.slice(10, 16) : res.articles.slice(0, 6));
      }
    });
  }, [initialArticles, initialMostRead]);

  if (!latestNews.length) return null;

  // Localized string selectors
  const labelLatest = getLocalized(language, {
    en: "Latest  News",
    gu: "Latest  સમાચાર",
    hi: "ताजा  समाचार"
  });

  const labelContinuous = getLocalized(language, {
    en: "• Continuous Updates",
    gu: "• સતત અપડેટ",
    hi: "• सतत अपडेट"
  });

  const labelMostRead = getLocalized(language, {
    en: "Most Read",
    gu: "સૌથી વધુ વંચાયેલા",
    hi: "सबसे ज्यादा पढ़े गए"
  });

  const labelGoldSilverRates = getLocalized('en', {
    en: "Gold-Silver Rates",
    gu: "સોના-ચાંદીના ભાવ",
    hi: "सोने-चांदी के भाव"
  });

  const labelGold = getLocalized('en', {
    en: "Gold (10 Grams)",
    gu: "સોનું (10 ગ્રામ)",
    hi: "सोना (10 ग्राम)"
  });

  const labelKarat = getLocalized('en', {
    en: "24 Karat",
    gu: "24 કેરેટ",
    hi: "24 कैरेट"
  });

  const labelSilver = getLocalized('en', {
    en: "Silver (1 Kg)",
    gu: "ચાંદી (1 કિલો)",
    hi: "चांदी (1 किलो)"
  });

  const labelPerKg = getLocalized('en', {
    en: "Per Kg",
    gu: "પ્રતિ કિલો",
    hi: "प्रति किलो"
  });

  const labelStable = getLocalized('en', {
    en: "Stable",
    gu: "સ્થિર",
    hi: "स्थिर"
  });

  // Localize prices helper
  const formatPrice = (price: number) => {
    const formatted = price.toLocaleString('en-IN');
    return language === 'gu' ? toGuDigits(formatted) : formatted;
  };

  const formatChange = (change: number) => {
    return language === 'gu' ? toGuDigits(change) : change;
  };

  const timelineContent = (
    <div className="flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[3px] border-slate-950 dark:border-slate-800 pb-2.5 mb-6">
        <span className="bg-[#B3121B] text-white px-5 py-2.5 font-extrabold text-[17px] md:text-[19px] rounded-sm tracking-tight leading-none">
          {labelLatest}
        </span>
        <span className="text-[#B3121B] font-extrabold text-[12px] md:text-[13px] animate-pulse">
          {labelContinuous}
        </span>
      </div>

      {/* 2-Column Grid with vertical timeline lines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">

        {/* Column 1 */}
        <div className="relative pl-5 flex flex-col">

          {latestNews.slice(0, 5).map((art, idx) => {
            const isHighlighted = idx === 1; // Vadodara budget is index 1
            const relativeTimeStr = language === 'gu'
              ? art.relativeTimeGu
              : language === 'hi'
                ? art.relativeTimeHi
                : art.relativeTime;
            const locationTag = getCategoryLabel(art, language);

            // Bullet styling pattern: alternating red and white nodes
            const isRedBullet = idx % 2 === 0;

            return (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="group relative flex items-start justify-between gap-3 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/10 transition-colors duration-150 rounded-sm"
              >
                {/* Segment of vertical timeline line */}
                {idx === 0 && (
                  <div className="absolute left-[-14px] top-[18px] bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx > 0 && idx < 4 && (
                  <div className="absolute left-[-14px] top-0 bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx === 4 && (
                  <div className="absolute left-[-14px] top-0 h-[18px] w-[1.5px] bg-[#d6c7b5]/85" />
                )}

                {/* Timeline circle node */}
                <div
                  className={`absolute left-[-19.5px] top-[18px] z-10 w-[12px] h-[12px] rounded-full transition-transform duration-200 group-hover:scale-110 ${isRedBullet
                    ? 'bg-[#B3121B]'
                    : 'bg-white border-2 border-[#d6c7b5]'
                    }`}
                />

                <div className="flex-1 min-w-0">
                  {/* Timestamp & Location row */}
                  <div className="flex items-center gap-1.5 mb-1 select-none">
                    <span className="text-[#B3121B] font-extrabold text-[11.5px] md:text-[12px] whitespace-nowrap">
                      {relativeTimeStr}
                    </span>
                    <span className="text-muted-foreground font-bold text-[11px] md:text-[11.5px] truncate">
                      {locationTag}
                    </span>
                  </div>
                  {/* Headline */}
                  <h3 className={`text-[14.5px] md:text-[15.5px] font-extrabold leading-snug line-clamp-2 transition-colors duration-150 ${isHighlighted
                    ? 'text-[#B3121B]'
                    : 'text-foreground group-hover:text-[#B3121B]'
                    }`}>
                    {getArticleTitle(art, language)}
                  </h3>
                </div>
                {/* Thumbnail Image */}
                <div className="relative h-[58px] w-[86px] shrink-0 overflow-hidden rounded-sm border border-border/10 bg-muted">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="86px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="relative pl-5 flex flex-col">

          {latestNews.slice(5, 10).map((art, idx) => {
            const isHighlighted = false;
            const relativeTimeStr = language === 'gu'
              ? art.relativeTimeGu
              : language === 'hi'
                ? art.relativeTimeHi
                : art.relativeTime;
            const locationTag = getCategoryLabel(art, language);

            // Bullet styling pattern: alternating red and white nodes
            const isRedBullet = idx % 2 === 0;

            return (
              <Link
                key={art.id}
                href={`/news/${art.slug}`}
                className="group relative flex items-start justify-between gap-3 py-3 border-b border-border/30 last:border-b-0 hover:bg-muted/10 transition-colors duration-150 rounded-sm"
              >
                {/* Segment of vertical timeline line */}
                {idx === 0 && (
                  <div className="absolute left-[-14px] top-[18px] bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx > 0 && idx < 4 && (
                  <div className="absolute left-[-14px] top-0 bottom-0 w-[1.5px] bg-[#d6c7b5]/85" />
                )}
                {idx === 4 && (
                  <div className="absolute left-[-14px] top-0 h-[18px] w-[1.5px] bg-[#d6c7b5]/85" />
                )}

                {/* Timeline circle node */}
                <div
                  className={`absolute left-[-19.5px] top-[18px] z-10 w-[12px] h-[12px] rounded-full transition-transform duration-200 group-hover:scale-110 ${isRedBullet
                    ? 'bg-[#B3121B]'
                    : 'bg-white border-2 border-[#d6c7b5]'
                    }`}
                />

                <div className="flex-1 min-w-0">
                  {/* Timestamp & Location row */}
                  <div className="flex items-center gap-1.5 mb-1 select-none">
                    <span className="text-[#B3121B] font-extrabold text-[11.5px] md:text-[12px] whitespace-nowrap">
                      {relativeTimeStr}
                    </span>
                    <span className="text-muted-foreground font-bold text-[11px] md:text-[11.5px] truncate">
                      {locationTag}
                    </span>
                  </div>
                  {/* Headline */}
                  <h3 className={`text-[14.5px] md:text-[15.5px] font-extrabold leading-snug line-clamp-2 transition-colors duration-150 ${isHighlighted
                    ? 'text-[#B3121B]'
                    : 'text-foreground group-hover:text-[#B3121B]'
                    }`}>
                    {getArticleTitle(art, language)}
                  </h3>
                </div>
                {/* Thumbnail Image */}
                <div className="relative h-[58px] w-[86px] shrink-0 overflow-hidden rounded-sm border border-border/10 bg-muted">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="86px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col gap-6">
      {/* Most Read (સૌથી વધુ વંચાયેલા) */}
      <div>
        <div className="flex items-center gap-1.5 border-b-[3px] border-slate-950 dark:border-slate-800 pb-2.5 mb-3.5">
          <span className="text-[#B3121B] text-[15px] font-extrabold">♦</span>
          <h3 className="text-[15px] font-black text-foreground">
            {labelMostRead}
          </h3>
        </div>

        <div className="flex flex-col divide-y divide-border/40">
          {mostRead.slice(0, 5).map((art, idx) => (
            <Link
              key={art.id}
              href={`/news/${art.slug}`}
              className="group flex items-start gap-3.5 py-3 hover:bg-muted/20 transition-colors duration-150 px-1 rounded-sm border-b border-border/40 pb-3 last:border-b-0 last:pb-0 pt-3 first:pt-0"
            >
              {/* Number tag matching tv9 style */}
              <span className="text-[24px] font-serif font-black text-slate-300 dark:text-slate-700 group-hover:text-[#B3121B] transition-colors duration-150 leading-none w-6 text-center select-none">
                {language === 'gu' ? toGuDigits(idx + 1) : idx + 1}
              </span>

              {/* Headline */}
              <h4 className="text-[14.5px] md:text-[15px] leading-snug text-foreground group-hover:text-[#B3121B] transition-colors duration-150 line-clamp-3 flex-1 mt-0.5" style={{ fontFamily: "'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", fontWeight: 700 }}>
                {getArticleTitle(art, language)}
              </h4>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );

  if (view === 'timeline') {
    return timelineContent;
  }

  if (view === 'sidebar') {
    return sidebarContent;
  }

  return (
    <section className="mt-8">
      {/* Divider and section outer wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_336px] gap-8 items-start border-t border-border/60 pt-6">
        {timelineContent}
        {sidebarContent}
      </div>
    </section>
  );
}
