'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { getPublicAdBySection } from '@/lib/api';

export interface AdSectionBannerProps {
  section: string;
  initialAd?: any;
  className?: string;
}

export interface AdItemData {
  image: string;
  link: string;
}

export default function AdSectionBanner({ section, initialAd, className = '' }: AdSectionBannerProps) {
  const [adData, setAdData] = useState<any>(initialAd || null);
  const [loading, setLoading] = useState<boolean>(!initialAd);

  useEffect(() => {
    if (!initialAd && section) {
      let isMounted = true;
      getPublicAdBySection(section).then((data) => {
        if (isMounted) {
          setAdData(data);
          setLoading(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [section, initialAd]);

  if (loading) {
    return null; // Silent skeleton or null during initial quick load
  }

  if (!adData || !adData.isActive) {
    return null;
  }

  // Extract non-empty image items (up to 3)
  const items: AdItemData[] = [];
  if (adData.image1 && adData.image1.trim() !== '') {
    items.push({ image: adData.image1, link: adData.link1 || '#' });
  }
  if (adData.image2 && adData.image2.trim() !== '') {
    items.push({ image: adData.image2, link: adData.link2 || '#' });
  }
  if (adData.image3 && adData.image3.trim() !== '') {
    items.push({ image: adData.image3, link: adData.link3 || '#' });
  }

  if (items.length === 0) {
    return null;
  }

  const count = items.length;

  // Grid system setting proper width based on image count:
  // 1 image  -> 100% full width (grid-cols-1)
  // 2 images -> 50%/50% width (grid-cols-1 md:grid-cols-2)
  // 3 images -> 33.3%/33.3%/33.3% width (grid-cols-1 sm:grid-cols-2 md:grid-cols-3)
  let gridColsClass = 'grid-cols-1';
  let aspectRatioClass = 'aspect-[21/6] sm:aspect-[24/5]'; // Wide banner for 1 item

  if (count === 2) {
    gridColsClass = 'grid-cols-1 md:grid-cols-2';
    aspectRatioClass = 'aspect-[16/7] sm:aspect-[16/6]'; // 50% split width aspect ratio
  } else if (count === 3) {
    gridColsClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    aspectRatioClass = 'aspect-[16/8] sm:aspect-[16/7]'; // 33.3% split width aspect ratio
  }

  return (
    <aside
      aria-label={`Advertisement section ${section}`}
      className={`my-6 w-full ${className}`}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className={`grid ${gridColsClass} gap-4 items-stretch`}>
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.link && item.link !== '#' ? item.link : undefined}
              target={item.link && item.link !== '#' ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="group relative flex w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-red-500/30"
            >
              <div className={`relative w-full ${aspectRatioClass} min-h-[100px] overflow-hidden`}>
                <Image
                  src={item.image}
                  alt={`Advertisement ${idx + 1}`}
                  fill
                  unoptimized={item.image.startsWith('http')}
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Badge top-right */}
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white/90 shadow-sm">
                  <span>AD</span>
                  {item.link && item.link !== '#' && (
                    <ExternalLink className="h-2.5 w-2.5 opacity-70 group-hover:opacity-100" />
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
