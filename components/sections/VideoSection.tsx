'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Eye, Play, Video } from 'lucide-react';
import { formatViews, getLocalized } from '@/data';
import { getPublicVideos } from '@/lib/api';
import { safeYouTubeId } from '@/lib/youtube';
import SectionHeader from '@/components/ui/SectionHeader';
import { useApp } from '@/components/AppProvider';

// VideoSection shows only regular YouTube videos (no Shorts)

export default function VideoSection() {
  const { language } = useApp();
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Pass 'video' type — excludes Shorts from YouTube RSS feed
    getPublicVideos('video').then((res) => {
      setVideos(res || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-muted py-3">
      <div className="mx-auto max-w-screen-xl px-4">
        <SectionHeader title="Videos" titleGu="વીડિયો" titleHi="वीडियो" language={language} href="/videos" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Loading skeleton cards
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-card animate-pulse">
                <div className="aspect-video w-full bg-muted" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2 mt-2" />
                </div>
              </div>
            ))
          ) : videos.length === 0 ? (
            // Empty state
            <div className="col-span-4 flex flex-col items-center justify-center py-10 text-center text-muted-foreground gap-2">
              <Video className="h-10 w-10 opacity-30" />
              <p className="text-sm font-semibold">
                {getLocalized(language, {
                  en: 'No videos found yet.',
                  gu: 'હજી કોઈ વીડિયો મળ્યો નથી.',
                  hi: 'अभी कोई वीडियो नहीं मिला।',
                })}
              </p>
            </div>
          ) : (
            videos.map((item) => (
              <article key={item.id} className="news-card overflow-hidden rounded-xl border border-border bg-card">
                <div className="relative aspect-video">
                  {playingVideoId === item.id ? (
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${safeYouTubeId(item.youtubeId)}?autoplay=1&controls=1&mute=0&rel=0`}
                      title={getLocalized(language, { en: item.title, gu: item.titleGu, hi: item.titleHi })}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="group/video relative h-full w-full cursor-pointer" onClick={() => setPlayingVideoId(item.id)}>
                      <Image src={item.thumbnail} alt={item.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 transition-all group-hover/video:bg-black/20">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform group-hover/video:scale-110">
                          <Play className="h-5 w-5 fill-current" />
                        </span>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded bg-black/75 px-2 py-0.5 text-xs font-bold text-white">{item.duration}</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-black leading-snug text-foreground">
                    {getLocalized(language, { en: item.title, gu: item.titleGu, hi: item.titleHi })}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatViews(item.views)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(item.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
