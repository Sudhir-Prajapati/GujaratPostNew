'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Clock } from 'lucide-react';
import { Article } from '@/types';
import { useApp } from '@/components/AppProvider';
import {
  getLocalized,
  getArticleTitle,
  getArticleExcerpt,
  getCategoryLabel,
  formatViews,
  formatDate,
} from '@/data';
import { getCategoryColor, toGu } from '@/lib/utils';
import NewsCard from '@/components/ui/NewsCard';

/* ── Types ────────────────────────────────────────────────── */
interface Props {
  articles: Article[];
  category: { name: string; nameGu: string; nameHi: string };
  trending: Article[];
  currentPage: number;
  totalPages: number;
  slug: string;
}

type FilterTab = 'all' | 'latest' | 'analysis' | 'video' | 'photo';

/* ── Gujarat category specific mockup data ─────────────────── */
const GUJARAT_MOCK_ARTICLES: any[] = [];
const GUJARAT_MOCK_MOST_READ: any[] = [];

const GUJARAT_MOCK_TAGS = {
  gu: ['ચૂંટણી 2027', 'વરસાદ', 'સોના-ચાંદી', 'ક્રિકેટ', 'મેટ્રો', 'સેમિકન્ડક્ટર', 'ડાયમંડ ઉદ્યોગ', 'ટ્રાફિક'],
  hi: ['चुनाव 2027', 'बारिश', 'सोना-चांदी', 'क्रिकेट', 'मेट्रो', 'सेमीकंडक्टर', 'डायमंड उद्योग', 'ट्रैफिक'],
  en: ['Election 2027', 'Rain', 'Gold-Silver', 'Cricket', 'Metro', 'Semiconductor', 'Diamond Industry', 'Traffic']
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY PAGE CLIENT
   ══════════════════════════════════════════════════════════════ */
export default function CategoryPageClient({ articles, category, slug }: Props) {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [visibleCount, setVisibleCount] = useState(9);

  // Scroll page to top instantly whenever category page mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  const isGujarat = true; // Apply the premium mockup layout to all category pages

  // Get localized category name aligned exactly with the header menu links
  const getCategoryTitleLocalized = () => {
    if (slug === 'other-cities' || slug === 'otherCities') {
      return getLocalized(language, { en: 'Other Cities', gu: 'અન્ય શહેરો', hi: 'अन्य शहर' });
    }
    if (slug === 'gujarat' || slug === 'state') {
      return getLocalized(language, { en: 'Gujarat', gu: 'ગુજરાત', hi: 'गुजरात' });
    }
    if (slug === 'national') {
      return getLocalized(language, { en: 'National', gu: 'દેશ', hi: 'देश' });
    }
    if (slug === 'crime') {
      return getLocalized(language, { en: 'Crime', gu: 'ક્રાઈમ', hi: 'क्राइम' });
    }
    if (slug === 'technology') {
      return getLocalized(language, { en: 'Technology', gu: 'ટેક્નોલોજી', hi: 'टेक्नोलॉजी' });
    }
    if (slug === 'lifestyle') {
      return getLocalized(language, { en: 'Lifestyle', gu: 'લાઈફસ્ટાઈલ', hi: 'लाइफस्टाइल' });
    }
    return getLocalized(language, {
      en: category?.name || '',
      gu: category?.nameGu || '',
      hi: category?.nameHi || '',
    });
  };

  const categoryName = getCategoryTitleLocalized();

  /* Get localized location */
  const getArticleLocation = (art: Article) => {
    if (language === 'gu') {
      return (art as any).categoryGu || art.tagsGu?.[0] || getCategoryLabel(art, language);
    }
    if (language === 'hi') {
      return (art as any).categoryHi || art.tagsHi?.[0] || getCategoryLabel(art, language);
    }
    return art.category || art.tags?.[0] || getCategoryLabel(art, language);
  };

  /* Get localized relative time / fallback to date */
  const getArticleTime = (art: Article) => {
    if (language === 'gu') return (art as any).relativeTimeGu || formatDate(art.publishedAt);
    if (language === 'hi') return (art as any).relativeTimeHi || formatDate(art.publishedAt);
    return art.relativeTime || formatDate(art.publishedAt);
  };

  /* Get localized views */
  const getArticleViews = (art: Article) => {
    if (language === 'gu') return (art as any).viewsGu || toGu(formatViews(art.views));
    if (language === 'hi') return (art as any).viewsHi || formatViews(art.views);
    return (art as any).views || formatViews(art.views);
  };

  /* Most-read = top 5 from all articles by views in this category */
  /* Most-read = Top 10 articles published/updated within current running month (last 30 days) sorted by views */
  const mostReadToDisplay = useMemo(() => {
    const all = articles || [];
    if (all.length === 0) return [];

    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    // Filter articles uploaded/updated within the last 30 days (current running month)
    const currentMonthArticles = all.filter((art) => {
      const artTime = new Date((art as any).updatedAt || art.publishedAt || (art as any).createdAt || 0).getTime();
      return !isNaN(artTime) && artTime > 0 && (now - artTime) <= THIRTY_DAYS_MS;
    });

    // If there are articles in the current running month, sort them by views; otherwise use overall category articles
    const pool = currentMonthArticles.length > 0 ? currentMonthArticles : all;
    return [...pool].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 10);
  }, [articles]);

  /* Trending tags */
  const trendingTags = useMemo(() => {
    const all = (articles || []).flatMap((a) => (language === 'gu' ? a.tagsGu : language === 'hi' ? a.tagsHi : a.tags));
    const freq: Record<string, number> = {};
    all.forEach((t) => { if (t) freq[t] = (freq[t] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, [articles, language]);

  /* Resolve displaying lists with dynamic filtering and sorting */
  const displayArticles = articles || [];

  const getArticleTimeMs = (art: Article) => {
    const updatedVal = (art as any).updatedAt;
    const publishedVal = art.publishedAt || (art as any).createdAt;
    const updatedMs = updatedVal ? new Date(updatedVal).getTime() : 0;
    const publishedMs = publishedVal ? new Date(publishedVal).getTime() : 0;
    const t = !isNaN(updatedMs) && updatedMs > 0 ? updatedMs : publishedMs;
    return isNaN(t) ? 0 : t;
  };

  const filteredArticles = useMemo(() => {
    let result = [...displayArticles];

    // 1. Filter by active tab format/category
    if (activeTab === 'analysis') {
      const matches = result.filter((a) =>
        a.titleGu?.includes('વિશ્લેષણ') ||
        a.title?.toLowerCase().includes('analysis') ||
        a.excerptGu?.includes('વિશ્લેષણ') ||
        a.tagsGu?.some(t => t.includes('વિશ્લેષણ')) ||
        a.tags?.some(t => t.toLowerCase().includes('analysis'))
      );
      result = matches.length > 0 ? matches : result.filter((_, idx) => idx % 2 === 0);
    } else if (activeTab === 'video') {
      const matches = result.filter((a) =>
        a.titleGu?.includes('વીડિયો') ||
        a.title?.toLowerCase().includes('video') ||
        Boolean((a as any).videoUrl) ||
        Boolean((a as any).youtubeId) ||
        a.tagsGu?.some(t => t.includes('વીડિયો')) ||
        a.tags?.some(t => t.toLowerCase().includes('video'))
      );
      result = matches.length > 0 ? matches : result.filter((_, idx) => idx % 3 === 0);
    } else if (activeTab === 'photo') {
      const matches = result.filter((a) =>
        a.titleGu?.includes('ફોટો') ||
        a.title?.toLowerCase().includes('photo') ||
        a.tagsGu?.some(t => t.includes('ફોટો')) ||
        a.tags?.some(t => t.toLowerCase().includes('photo'))
      );
      result = matches.length > 0 ? matches : result.filter((_, idx) => idx % 4 === 0);
    }

    // 2. Sort by latest or popular
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      // Default: latest first by updatedAt / publishedAt desc
      result.sort((a, b) => getArticleTimeMs(b) - getArticleTimeMs(a));
    }

    return result;
  }, [displayArticles, activeTab, sortBy]);

  const tagsToDisplay = trendingTags && trendingTags.length > 0 ? trendingTags : (GUJARAT_MOCK_TAGS[language] || GUJARAT_MOCK_TAGS.en);

  // #1 Latest News Article for Hero Card
  const heroArticle = filteredArticles[0];

  // Guaranteed 4 items (articles 2, 3, 4, 5) for Top Stories column on the right
  const topStories = useMemo(() => {
    const sliced = filteredArticles.slice(1, 5);
    if (sliced.length >= 4) return sliced;

    const usedIds = new Set([heroArticle?.id, ...sliced.map((a) => a.id)].filter(Boolean));
    const pool = displayArticles.length > 1 ? displayArticles : (GUJARAT_MOCK_ARTICLES as any[]);
    const fallbacks = pool.filter((a: any) => !usedIds.has(a.id));
    return [...sliced, ...fallbacks].slice(0, 4);
  }, [filteredArticles, heroArticle, displayArticles]);

  const topStoriesIds = useMemo(() => new Set([heroArticle?.id, ...topStories.map((a) => a.id)].filter(Boolean)), [heroArticle, topStories]);

  // Remaining articles (excluding Hero and Top Stories) for Lokpriya / Remaining Grid
  const popularArticles = useMemo(() => {
    return filteredArticles.filter((art) => !topStoriesIds.has(art.id));
  }, [filteredArticles, topStoriesIds]);

  /* Filter tabs */
  const tabs: { id: FilterTab; gu: string; hi: string; en: string }[] = [
    { id: 'all', gu: 'બધું', hi: 'सभी', en: 'All' },
    { id: 'latest', gu: 'તાજા સમાચાર', hi: 'ताज़ा समाचार', en: 'Latest' },
    { id: 'analysis', gu: 'વિશ્લેષણ', hi: 'विश्लेषण', en: 'Analysis' },
    { id: 'video', gu: 'વીડિયો', hi: 'वीडियो', en: 'Video' },
    { id: 'photo', gu: 'ફોટો', hi: 'फोटो', en: 'Photo' },
  ];

  if (!heroArticle) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16 text-center text-muted-foreground">
        {getLocalized(language, { en: 'No stories found.', gu: 'કોઈ સમાચાર મળ્યા નહીં.', hi: 'कोई खबर नहीं मिली.' })}
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-6">

        {/* ── TOP ROW: Category name (with Red Vertical Bar) + Sort buttons ──────────────── */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
          <div className="flex items-center gap-3">
            {/* Red vertical bar */}
            <span className="w-1.5 h-7 bg-accent rounded-sm inline-block" />
            <h1 className="text-2xl font-black text-foreground">{categoryName}</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition cursor-pointer ${sortBy === 'latest'
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:border-accent hover:text-accent bg-card'
                }`}
            >
              {getLocalized(language, { gu: 'તાજા', hi: 'ताजा', en: 'Latest' })}
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition cursor-pointer ${sortBy === 'popular'
                ? 'bg-foreground text-background'
                : 'border border-border text-muted-foreground hover:border-accent hover:text-accent bg-card'
                }`}
            >
              {getLocalized(language, { gu: 'લોકપ્રિય', hi: 'लोकप्रिय', en: 'Popular' })}
            </button>
          </div>
        </div>

        {/* ── FILTER TABS ────────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-black transition cursor-pointer ${activeTab === tab.id
                ? 'bg-accent text-white font-black'
                : 'border border-border bg-card text-foreground hover:border-accent hover:text-accent font-semibold'
                }`}
            >
              {getLocalized(language, { en: tab.en, gu: tab.gu, hi: tab.hi })}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT + SIDEBAR ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ── LEFT: Hero + Top Stories ─────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-8 min-w-0">
            {/* Hero Article */}
            <Link href={`/news/${heroArticle.slug}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-muted shadow-sm">
                <Image
                  src={heroArticle.image || '/assets/placeholder.jpg'}
                  alt={getArticleTitle(heroArticle, language)}
                  fill
                  priority
                  unoptimized={heroArticle.image?.includes('localhost')}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 45vw"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x500/e2e8f0/94a3b8?text=Gujarat+Post'; }}
                />
              </div>
              <div className="mt-3">
                <span className="text-xs font-black uppercase tracking-wide text-accent">
                  {getArticleLocation(heroArticle)}
                </span>
                <h2 className="mt-1 text-xl md:text-[23px] font-black leading-snug tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-3">
                  {getArticleTitle(heroArticle, language)}
                </h2>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground font-semibold">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground/70" />{getArticleTime(heroArticle)}</span>
                  <span>·</span>
                  <span>{formatDate(heroArticle.publishedAt)}</span>
                </div>
              </div>
            </Link>

            {/* Top Stories column */}
            <div>
              <div className="flex items-center gap-2.5 mb-3 pb-2 border-b-2 border-accent/25">
                <span className="w-1 h-4 bg-accent inline-block shrink-0 rounded-sm" />
                <span className="text-sm font-black text-foreground">
                  {getLocalized(language, { en: 'Top Stories', gu: 'ટોપ સ્ટોરીઝ', hi: 'टॉप स्टोरीज' })}
                </span>
              </div>
              <div className="flex flex-col divide-y divide-border">
                {topStories.map((art) => (
                  <Link key={art.id} href={`/news/${art.slug}`} className="group flex items-start gap-4 py-3 first:pt-1 last:pb-1">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase tracking-wide text-accent">
                        {getArticleLocation(art)}
                      </span>
                      <h3 className="mt-0.5 text-[13.5px] md:text-[14.5px] font-bold leading-snug tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-3">
                        {getArticleTitle(art, language)}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
                        <span>{getArticleTime(art)}</span>
                        <span>·</span>
                        <span>{formatDate(art.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm bg-muted shadow-sm">
                      <Image
                        src={art.image || '/assets/placeholder.jpg'}
                        alt={getArticleTitle(art, language)}
                        fill
                        unoptimized={art.image?.includes('localhost')}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="80px"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x64/e2e8f0/94a3b8?text=GP'; }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Most Read & Trending Tags ─────────────────── */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-border">
              <span className="w-2 h-2 bg-accent rotate-45 shrink-0 inline-block" />
              <span className="text-sm font-black text-foreground">
                {getLocalized(language, { en: 'Most Read', gu: 'સૌથી વધુ વંચાયેલા', hi: 'सबसे ज़्यादा पढ़े गए' })}
              </span>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {mostReadToDisplay.map((art: any, i: number) => (
                <Link key={art.id} href={`/news/${art.slug}`} className="group flex items-start gap-3 py-3 first:pt-1.5 last:pb-1.5">
                  <span className="text-[28px] font-extrabold leading-none select-none w-8 shrink-0 text-center"
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: 'transparent',
                      WebkitTextStroke: '1.5px var(--ink-3)'
                    }}>
                    {language === 'gu' ? toGu(i + 1) : i + 1}
                  </span>
                  <p className="text-[13px] md:text-[13.5px] font-bold leading-snug text-foreground/90 group-hover:text-accent transition-colors line-clamp-3">
                    {language === 'gu' ? art.titleGu : language === 'hi' ? art.titleHi : art.title}
                  </p>
                </Link>
              ))}
            </div>

            {/* Trending Tags */}
            {/* <div className="mt-6">
              <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-border">
                <span className="w-2 h-2 bg-accent rotate-45 shrink-0 inline-block" />
                <span className="text-sm font-black text-foreground">
                  {getLocalized(language, { en: 'Trending Topics', gu: 'ટ્રેન્ડિંગ વિષયો', hi: 'ट्रेंडिंग विषय' })}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagsToDisplay.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:border-accent hover:text-accent hover:bg-muted transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div> */}
          </div>
        </div>

        {/* ── POPULAR ARTICLES GRID ─────────────────────────────── */}
        <div className="mt-10">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-border">
            <span className="w-2 h-2 bg-accent rotate-45 shrink-0 inline-block" />
            <span className="text-base font-black text-foreground">
              {getLocalized(language, { en: 'Popular News', gu: 'લોકપ્રિય સમાચાર', hi: 'लोकप्रिय समाचार' })}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-8">
            {popularArticles.slice(0, visibleCount).map((article) => (
              <NewsCard key={article.id} article={article} variant="flat" />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < popularArticles.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + 9)}
                className="rounded border border-accent px-10 py-3 text-sm font-black text-accent hover:bg-accent hover:text-white transition cursor-pointer"
              >
                {getLocalized(language, { en: 'Load More', gu: 'વધુ લોડ કરો', hi: 'और लोड करें' })}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
