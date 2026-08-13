'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Clock, Play, Video as VideoIcon } from 'lucide-react';
import { Article } from '@/types';
import { useApp } from '@/components/AppProvider';
import {
  getLocalized,
  getArticleTitle,
  getCategoryLabel,
  formatViews,
  formatDate,
} from '@/data';
import { getCategoryColor, toGu } from '@/lib/utils';
import { getPublicVideos } from '@/lib/api';
import { safeYouTubeId, youtubeEmbedUrl } from '@/lib/youtube';
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

type FilterTab = 'all' | 'latest' | 'video';

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

  // Videos state for Video filter
  const [videos, setVideos] = useState<any[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Scroll page to top instantly whenever category page mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  // Fetch public videos stream for Video tab
  useEffect(() => {
    getPublicVideos('video')
      .then((res) => {
        if (res && Array.isArray(res)) {
          setVideos(res);
        }
      })
      .catch(() => {});
  }, []);

  // Get localized category name aligned exactly with header menu links
  const getCategoryTitleLocalized = () => {
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
      return getLocalized(language, { en: 'Technology', gu: 'ટેક્નોલોજી', hi: 'ટેક્નોલોજી' });
    }
    if (slug === 'lifestyle') {
      return getLocalized(language, { en: 'Lifestyle', gu: 'લાઈફસ્ટાઈલ', hi: 'લાઈફસ્ટાઈલ' });
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

  /* Most-read = Top 10 articles within last 30 days sorted by views */
  const mostReadToDisplay = useMemo(() => {
    const all = articles || [];
    if (all.length === 0) return [];

    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    const currentMonthArticles = all.filter((art) => {
      const artTime = new Date((art as any).updatedAt || art.publishedAt || (art as any).createdAt || 0).getTime();
      return !isNaN(artTime) && artTime > 0 && (now - artTime) <= THIRTY_DAYS_MS;
    });

    const pool = currentMonthArticles.length > 0 ? currentMonthArticles : all;
    return [...pool].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
  }, [articles]);

  const getArticleTimeMs = (art: Article) => {
    const updatedVal = (art as any).updatedAt;
    const publishedVal = art.publishedAt || (art as any).createdAt;
    const updatedMs = updatedVal ? new Date(updatedVal).getTime() : 0;
    const publishedMs = publishedVal ? new Date(publishedVal).getTime() : 0;
    const t = !isNaN(updatedMs) && updatedMs > 0 ? updatedMs : publishedMs;
    return isNaN(t) ? 0 : t;
  };

  /* Filter & Sort logic based on activeTab */
  const filteredArticles = useMemo(() => {
    let result = [...(articles || [])];

    if (activeTab === 'latest') {
      // Strictly latest news uploaded sorted by time descending
      result.sort((a, b) => getArticleTimeMs(b) - getArticleTimeMs(a));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else {
      // Default: latest first
      result.sort((a, b) => getArticleTimeMs(b) - getArticleTimeMs(a));
    }

    return result;
  }, [articles, activeTab, sortBy]);

  // #1 Hero Item
  const heroArticle = filteredArticles[0];

  // Top stories (items 2, 3, 4, 5)
  const topStories = useMemo(() => {
    const sliced = filteredArticles.slice(1, 5);
    if (sliced.length >= 4) return sliced;
    const usedIds = new Set([heroArticle?.id, ...sliced.map((a) => a.id)].filter(Boolean));
    const fallbacks = (articles || []).filter((a) => !usedIds.has(a.id));
    return [...sliced, ...fallbacks].slice(0, 4);
  }, [filteredArticles, heroArticle, articles]);

  const topStoriesIds = useMemo(
    () => new Set([heroArticle?.id, ...topStories.map((a) => a.id)].filter(Boolean)),
    [heroArticle, topStories]
  );

  // Popular / Remaining grid items for 'all' and 'latest' tabs
  const popularArticles = useMemo(() => {
    return filteredArticles.filter((art) => !topStoriesIds.has(art.id));
  }, [filteredArticles, topStoriesIds]);

  /* Mixed Feed for Video Tab (Video + Image Articles interleave) */
  const videoTabFeaturedVideo = useMemo(() => {
    if (videos.length > 0) return videos[0];
    return null;
  }, [videos]);

  const mixedVideoFeed = useMemo(() => {
    const result: any[] = [];
    const remainingVideos = videos.slice(1);
    const remainingArticles = articles || [];

    const maxLen = Math.max(remainingVideos.length, remainingArticles.length);
    for (let i = 0; i < maxLen; i++) {
      if (remainingVideos[i]) {
        result.push({ ...remainingVideos[i], isVideoItem: true });
      }
      if (remainingArticles[i]) {
        result.push({ ...remainingArticles[i], isVideoItem: false });
      }
    }
    return result;
  }, [videos, articles]);

  /* 3 Filter tabs */
  const tabs: { id: FilterTab; gu: string; hi: string; en: string }[] = [
    { id: 'all', gu: 'બધું', hi: 'सभी', en: 'All' },
    { id: 'latest', gu: 'તાજા સમાચાર', hi: 'ताज़ा समाचार', en: 'Latest' },
    { id: 'video', gu: 'વીડિયો', hi: 'वीडियो', en: 'Video' },
  ];

  if (!heroArticle && videos.length === 0) {
    return (
      <div className="mx-auto max-w-screen-xl px-4 py-16 text-center text-muted-foreground">
        {getLocalized(language, { en: 'No stories found.', gu: 'કોઈ સમાચાર મળ્યા નહીં.', hi: 'कोई खबर नहीं मिली.' })}
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-screen-xl px-4 py-6">

        {/* ── TOP ROW: Category name ─────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-7 bg-accent rounded-sm inline-block" />
            <h1 className="text-2xl font-black text-foreground">{categoryName}</h1>
          </div>
        </div>

        {/* ── FILTER TABS (3 Options: Badhu, Taja Samachar, Video) ────── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-black transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent text-white font-black shadow-sm'
                  : 'border border-border bg-card text-foreground hover:border-accent hover:text-accent font-semibold'
              }`}
            >
              {getLocalized(language, { en: tab.en, gu: tab.gu, hi: tab.hi })}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT AREA ─────────────────────────────────── */}
        {activeTab === 'video' ? (
          /* ════════════════════════════════════════════════════════
             VIDEO FILTER VIEW: 1st Big Video Player + Mixed Grid
             ════════════════════════════════════════════════════════ */
          <div className="space-y-8">
            {/* Top Featured Video Hero (First Big Latest Video) */}
            {videoTabFeaturedVideo && (
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                    <VideoIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-black uppercase text-accent tracking-wide">
                    {getLocalized(language, { en: 'Featured Video', gu: 'ખાસ વીડિયો', hi: 'खास वीडियो' })}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
                  {/* Big Video Container / Player */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
                    {playingVideoId === videoTabFeaturedVideo.id ? (
                      <iframe
                        src={youtubeEmbedUrl(videoTabFeaturedVideo.youtubeId || videoTabFeaturedVideo.id, 'autoplay=1')}
                        title={videoTabFeaturedVideo.title}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div
                        onClick={() => setPlayingVideoId(videoTabFeaturedVideo.id)}
                        className="group relative h-full w-full cursor-pointer"
                      >
                        <Image
                          src={
                            videoTabFeaturedVideo.thumbnail ||
                            `https://img.youtube.com/vi/${safeYouTubeId(videoTabFeaturedVideo.youtubeId || videoTabFeaturedVideo.id)}/hqdefault.jpg`
                          }
                          alt={videoTabFeaturedVideo.titleGu || videoTabFeaturedVideo.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/90 text-white shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-accent">
                            <Play className="h-7 w-7 fill-white text-white ml-1" />
                          </div>
                        </div>
                        {videoTabFeaturedVideo.duration && (
                          <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 text-xs font-bold text-white">
                            {videoTabFeaturedVideo.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Featured Video Meta Info */}
                  <div className="flex flex-col justify-between h-full space-y-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black leading-snug text-foreground">
                        {language === 'gu'
                          ? videoTabFeaturedVideo.titleGu || videoTabFeaturedVideo.title
                          : language === 'hi'
                          ? videoTabFeaturedVideo.titleHi || videoTabFeaturedVideo.title
                          : videoTabFeaturedVideo.title}
                      </h2>
                      <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-accent" />
                          {formatDate(videoTabFeaturedVideo.publishedAt)}
                        </span>
                        {videoTabFeaturedVideo.views > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatViews(videoTabFeaturedVideo.views)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setPlayingVideoId(playingVideoId === videoTabFeaturedVideo.id ? null : videoTabFeaturedVideo.id)}
                      className="inline-flex items-center gap-2 self-start rounded-full bg-accent px-5 py-2.5 text-xs font-black text-white shadow-md hover:bg-accent/90 transition cursor-pointer"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      {playingVideoId === videoTabFeaturedVideo.id
                        ? getLocalized(language, { en: 'Stop Playing', gu: 'વીડિયો બંધ કરો', hi: 'वीडियो बंद करें' })
                        : getLocalized(language, { en: 'Watch Now', gu: 'હવે જુઓ', hi: 'अभी देखें' })}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mixed Feed Section Header */}
            <div className="flex items-center gap-2.5 border-b border-border pb-3">
              <span className="w-2 h-2 bg-accent rotate-45 shrink-0 inline-block" />
              <h3 className="text-lg font-black text-foreground">
                {getLocalized(language, {
                  en: 'More Videos & Stories',
                  gu: 'વધુ વીડિયો અને સમાચાર',
                  hi: 'अधिक वीडियो और समाचार',
                })}
              </h3>
            </div>

            {/* Mixed Video + Image Article Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mixedVideoFeed.slice(0, visibleCount).map((item, idx) => {
                if (item.isVideoItem) {
                  // Video Item Card
                  const yId = safeYouTubeId(item.youtubeId || item.id);
                  const isPlaying = playingVideoId === item.id;
                  const itemTitle =
                    language === 'gu'
                      ? item.titleGu || item.title
                      : language === 'hi'
                      ? item.titleHi || item.title
                      : item.title;

                  return (
                    <div key={`video-${item.id}-${idx}`} className="group rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition">
                      <div className="relative aspect-video w-full bg-black">
                        {isPlaying ? (
                          <iframe
                            src={youtubeEmbedUrl(yId, 'autoplay=1')}
                            title={itemTitle}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div
                            onClick={() => setPlayingVideoId(item.id)}
                            className="relative h-full w-full cursor-pointer"
                          >
                            <Image
                              src={item.thumbnail || `https://img.youtube.com/vi/${yId}/hqdefault.jpg`}
                              alt={itemTitle}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/90 text-white shadow-lg backdrop-blur-sm group-hover:scale-110 transition">
                                <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                              </div>
                            </div>
                            {item.duration && (
                              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                {item.duration}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-3.5">
                        <span className="text-[10px] font-black uppercase text-accent tracking-wide flex items-center gap-1 mb-1">
                          <VideoIcon className="h-3 w-3" />
                          {getLocalized(language, { en: 'Video', gu: 'વીડિયો', hi: 'वीडियो' })}
                        </span>
                        <h4
                          onClick={() => setPlayingVideoId(item.id)}
                          className="text-sm font-bold leading-snug text-foreground line-clamp-2 cursor-pointer hover:text-accent transition"
                        >
                          {itemTitle}
                        </h4>
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground">
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Image Article Card
                return <NewsCard key={`art-${item.id}-${idx}`} article={item} variant="flat" />;
              })}
            </div>

            {/* Load More Button for Mixed Grid */}
            {visibleCount < mixedVideoFeed.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setVisibleCount((v) => v + 9)}
                  className="rounded-full border border-accent px-10 py-3 text-xs font-black text-accent hover:bg-accent hover:text-white transition cursor-pointer"
                >
                  {getLocalized(language, { en: 'Load More', gu: 'વધુ લોડ કરો', hi: 'और लोड करें' })}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ════════════════════════════════════════════════════════
             DEFAULT / LATEST FILTER VIEW: Standard Category Layout
             ════════════════════════════════════════════════════════ */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
              {/* LEFT COLUMN: Hero Article + Top Stories */}
              <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-8 min-w-0">
                {/* Hero Article */}
                {heroArticle && (
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
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/800x500/e2e8f0/94a3b8?text=Gujarat+Post';
                        }}
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
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground/70" />
                          {getArticleTime(heroArticle)}
                        </span>
                        <span>·</span>
                        <span>{formatDate(heroArticle.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Top Stories Column */}
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
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/80x64/e2e8f0/94a3b8?text=GP';
                            }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Most Read */}
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
                      <span
                        className="text-[28px] font-extrabold leading-none select-none w-8 shrink-0 text-center"
                        style={{
                          fontVariantNumeric: 'tabular-nums',
                          color: 'transparent',
                          WebkitTextStroke: '1.5px var(--ink-3)',
                        }}
                      >
                        {language === 'gu' ? toGu(i + 1) : i + 1}
                      </span>
                      <p className="text-[13px] md:text-[13.5px] font-bold leading-snug text-foreground/90 group-hover:text-accent transition-colors line-clamp-3">
                        {language === 'gu' ? art.titleGu : language === 'hi' ? art.titleHi : art.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* POPULAR ARTICLES GRID */}
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
          </>
        )}
      </div>
    </div>
  );
}
