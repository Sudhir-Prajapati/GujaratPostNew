'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Play, ExternalLink, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/components/AppProvider';
import { getLocalized } from '@/data';

import { getPublicVideos } from '@/lib/api';

interface ShortItem {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  videoUrl: string;
}

// Real YouTube Shorts video IDs and titles from the Gujarat Post channel
const DUMMY_SHORTS: ShortItem[] = [
  {
    id: 'qDOdT087s4A',
    title: 'સરકારી તિજોરીમાંથી લૂંટ, પિતા- પુત્રએ રૂ. 128 કરોડનું GST નું કૌભાંડ કરી નાખ્યું #gst #gujaratpost',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    thumbnail: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=qDOdT087s4A',
  },
];

export default function YouTubeShorts() {
  const { language } = useApp();
  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const loadShortsData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const liveRes = await getPublicVideos('short');
      if (liveRes && liveRes.length > 0) {
        const mapped: ShortItem[] = liveRes.map((v) => ({
          id: v.youtubeId || v.id,
          title: v.titleGu || v.title,
          publishedAt: v.publishedAt || new Date().toISOString(),
          thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
          videoUrl: `https://www.youtube.com/watch?v=${v.youtubeId || v.id}`,
        }));
        setShorts(mapped);
      } else {
        setShorts(DUMMY_SHORTS);
      }
    } catch {
      setShorts(DUMMY_SHORTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadShortsData();
  }, [loadShortsData]);

  const updateArrows = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    
    updateArrows();
    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [shorts, loading, updateArrows]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-card border-b border-border py-6 relative overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 relative">
        {/* Header Block */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            {/* Styled exactly like the user's screenshot - a red solid title block */}
            <span className="rounded bg-[#c0392b] px-3.5 py-1.5 text-xs sm:text-sm font-black text-white uppercase tracking-wider shadow-sm">
              {getLocalized(language, { en: 'Short Videos', gu: 'શોર્ટ વીડિયો', hi: 'शॉर्ट वीडियो' })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadShortsData(true)}
              disabled={refreshing || loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-muted disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <a
              href="https://www.youtube.com/@Gujaratpostnews/shorts"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-border bg-card px-3 text-xs font-bold text-foreground hover:text-accent hover:border-accent/40 transition"
            >
              {getLocalized(language, { en: 'View All', gu: 'વધુ જુઓ', hi: 'और देखें' })}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Slider Container Wrapper */}
        <div className="relative group/slider-wrap">
          {/* Left Arrow Button */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="absolute left-1 sm:-left-5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/85 dark:bg-slate-900/85 backdrop-blur shadow-lg text-foreground hover:bg-white dark:hover:bg-slate-950 transition-all duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
          )}

          {/* Right Arrow Button */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="absolute right-1 sm:-right-5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/85 dark:bg-slate-900/85 backdrop-blur shadow-lg text-foreground hover:bg-white dark:hover:bg-slate-950 transition-all duration-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 stroke-[2.5]" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="scrollbar-hide flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-none w-[150px] sm:w-[180px] aspect-[9/16] rounded-2xl bg-muted animate-pulse border border-border/60" />
              ))
            ) : (
              shorts.map((short) => (
                <article
                  key={short.title}
                  onClick={() => setSelectedVideoId(short.id)}
                  className="group flex-none w-[155px] sm:w-[185px] aspect-[9/16] snap-start relative rounded-2xl border border-border bg-black overflow-hidden shadow-sm hover:shadow-md hover:border-[#ff0000]/40 transition duration-300 cursor-pointer"
                >
                  {/* Thumbnail Image - full bleed vertical Unsplash - style override to force full cover */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />

                  {/* Top-left Play/Short overlay badge matching screenshot */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff0000] text-white shadow-md">
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  </div>

                  {/* Gradient & Title overlay matching screenshot */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent flex flex-col justify-end p-3">
                    <h3 className="text-white text-[11.5px] sm:text-[12px] font-black leading-snug line-clamp-3 group-hover:text-red-300 transition-colors duration-200">
                      {short.title}
                    </h3>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedVideoId(null)} />
          
          <div className="relative w-full max-w-md aspect-[9/16] max-h-[85vh] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 z-10 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedVideoId(null)}
              className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/80 hover:bg-black/90 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Video Player Embed configured specifically for YouTube Shorts format */}
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube Shorts player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
