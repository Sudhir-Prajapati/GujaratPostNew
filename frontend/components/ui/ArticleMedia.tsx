'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { isMediaVideo } from '@/lib/media';

interface ArticleMediaProps {
  src?: string | null;
  alt?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  showPlayBadge?: boolean;
  autoPlay?: boolean;
  autoPlayOnHover?: boolean;
  videoControls?: boolean;
  sizes?: string;
}

export default function ArticleMedia({
  src,
  alt = '',
  className = '',
  fill = false,
  priority = false,
  unoptimized = true,
  showPlayBadge = true,
  autoPlay = true,
  autoPlayOnHover = false,
  videoControls = false,
  sizes,
}: ArticleMediaProps) {
  const isVideo = isMediaVideo(src);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVideo && autoPlay && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted until user interacts, but muted autoPlay works on all modern browsers
      });
    }
  }, [isVideo, autoPlay, src]);

  if (!src || hasError) {
    return (
      <img
        src="/assets/demo/1.jpg"
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  if (isVideo) {
    if (videoControls) {
      return (
        <div className={`relative overflow-hidden bg-black ${fill ? 'w-full h-full' : ''}`}>
          <video
            ref={videoRef}
            src={src}
            controls
            autoPlay={autoPlay}
            muted
            loop
            playsInline
            preload="auto"
            className={`w-full h-full object-cover ${className}`}
            onError={() => setHasError(true)}
          />
        </div>
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden bg-zinc-900 group/media">
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
          preload="auto"
          className={`w-full h-full object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105 ${className}`}
          onMouseEnter={(e) => {
            if (autoPlayOnHover && !autoPlay) {
              e.currentTarget.play().catch(() => {});
            }
          }}
          onMouseLeave={(e) => {
            if (autoPlayOnHover && !autoPlay) {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }
          }}
          onError={() => setHasError(true)}
        />
        {showPlayBadge && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-black text-white shadow-sm border border-white/20 pointer-events-none">
            <Play className="h-2.5 w-2.5 fill-red-500 text-red-500" />
            <span className="text-[9px] uppercase tracking-wider font-bold">Video</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/assets/demo/1.jpg';
      }}
    />
  );
}
