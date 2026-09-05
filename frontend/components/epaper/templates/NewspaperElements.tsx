'use client';

import React from 'react';
import { BroadsheetArticle, formatGujaratiDate, getCleanText } from '../types';
import { LucideIcon, TrendingUp, CloudSun } from 'lucide-react';

export function getDatelinePrefix(location?: string | null, defaultCity: string = 'અમદાવાદ'): string {
  const loc = (location || '').trim();
  if (!loc) return `${defaultCity}: `;
  if (loc.endsWith(':')) return `${loc} `;
  return `${loc}: `;
}

export function getPhotoCreditText(photoCredit?: string | null, location?: string | null, defaultCity: string = 'અમદાવાદ'): string {
  if (photoCredit && photoCredit.trim()) return photoCredit.trim();
  const loc = location || defaultCity;
  return `તસવીર: ${loc} બ્યુરો - ગુજરાત પોસ્ટ`;
}

export function getReporterByline(byline?: string | null, authorName?: string | null, location?: string | null, defaultCity: string = 'અમદાવાદ'): string {
  if (byline && byline.trim()) return byline.trim();
  if (authorName && authorName.trim()) return `${authorName} • ${location || defaultCity}`;
  return `વિશેષ સંવાદદાતા • ${location || defaultCity}`;
}

/**
 * Compact Print Running Folio Header for Inside Pages (Pages 2–14)
 * Takes only ~28px height, allocating 95%+ of vertical space to editorial news.
 */
interface NewspaperFolioProps {
  pageNumber: number;
  totalPages?: number;
  city: string;
  cityGu?: string;
  date: string;
  sectionTitle: string;
  sectionSubtitle?: string;
  sectionIcon?: LucideIcon;
  price?: string;
}

export const NewspaperFolioHeader: React.FC<NewspaperFolioProps> = ({
  pageNumber,
  totalPages = 14,
  city,
  cityGu,
  date,
  sectionTitle,
  sectionSubtitle,
  sectionIcon: SectionIcon,
  price = '₹ ૫.૦૦',
}) => {
  const gujaratiDateStr = formatGujaratiDate(date);
  const displayCity = (cityGu || city).toUpperCase();

  return (
    <header className="shrink-0 mb-1.5 select-none">
      {/* Top micro dateline bar */}
      <div className="flex items-center justify-between text-[8px] font-extrabold text-slate-700 uppercase tracking-wide border-b border-slate-900 pb-0.5 mb-0.5">
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-950">ગુજરાત પોસ્ટ</span>
          <span className="text-slate-400">•</span>
          <span className="text-[#B3121B] font-black">{displayCity} આવૃત્તિ</span>
          <span className="text-slate-400">•</span>
          <span>{gujaratiDateStr}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">કિંમત {price}</span>
          <span className="text-slate-400">•</span>
          <span className="font-black text-slate-950 bg-slate-200/80 px-1.5 py-0.2 rounded">
            પાનું {pageNumber} / {totalPages}
          </span>
        </div>
      </div>

      {/* Main running section bar with red flag */}
      <div className="flex items-center justify-between bg-slate-950 text-white px-2 py-0.5 text-[9.5px] font-black">
        <div className="flex items-center gap-1.5 truncate">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8.5px] font-black uppercase tracking-wider rounded-xs">
            {sectionTitle}
          </span>
          {sectionSubtitle && (
            <span className="text-slate-300 text-[8px] font-bold truncate hidden sm:inline">
              — {sectionSubtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[8px] font-bold text-amber-300 uppercase shrink-0">
          <span>GUJARATPOST.COM</span>
          <span>•</span>
          <span>THE VOICE OF GUJARAT</span>
        </div>
      </div>
      <div className="h-[1.5px] bg-slate-900 mt-0.5" />
    </header>
  );
};

/**
 * Editorial Lead Story Block
 * Supports Variant A (5-col image / 7-col text), Variant B (7-col image / 5-col text), and Variant C (12-col headline banner)
 */
interface LeadStoryProps {
  article?: BroadsheetArticle | null;
  defaultCity: string;
  variant?: 'A' | 'B' | 'C';
  categoryBadge?: string;
  summaryLength?: number;
  imageHeightClass?: string;
}

export const LeadStoryBlock: React.FC<LeadStoryProps> = ({
  article,
  defaultCity,
  variant = 'A',
  categoryBadge,
  summaryLength = 260,
  imageHeightClass = 'h-40',
}) => {
  const headline = article?.printHeadline || article?.titleGu || article?.title || `${defaultCity}: વિકાસ કાર્યો અને નવી યોજનાઓની જાહેરાત`;
  const summary = article?.printSummary || getCleanText(article?.excerptGu || article?.excerpt || article?.contentGu || article?.content || `${defaultCity} વિસ્તારના સર્વાંગી વિકાસ માટે તંત્ર દ્વારા નવી યોજનાઓ જાહેર કરાઈ છે. નાગરિકો માટે ઉપયોગી સુવિધાઓ અને ઝડપી અમલીકરણ હાથ ધરવામાં આવ્યું છે.`, summaryLength);
  const secondaryContent = getCleanText(article?.contentGu || article?.content || '', 180);
  const location = article?.location || defaultCity;
  const dateline = getDatelinePrefix(location, defaultCity);
  const photoCredit = getPhotoCreditText(article?.photoCredit, location, defaultCity);
  const byline = getReporterByline(article?.byline, article?.author?.name, location, defaultCity);
  const category = categoryBadge || article?.category?.nameGu || 'મુખ્ય સમાચાર';
  const hasImage = Boolean(article?.featuredImage && article.featuredImage.trim().length > 0);

  // Variant C: Full width 12-column headline above image + summary
  if (variant === 'C' || (!hasImage)) {
    return (
      <article className="border-b-2 border-slate-900 pb-2">
        <div className="flex items-center justify-between mb-0.5 text-[8px] font-bold text-slate-600">
          <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8px] font-black uppercase">
            {category}
          </span>
          <span>{byline}</span>
        </div>

        <h2 className="text-[24px] font-black leading-[1.18] text-slate-950 my-1 tracking-tight">
          {headline}
        </h2>

        <div className={hasImage ? "grid grid-cols-12 gap-2.5 items-start mt-1" : "space-y-1 mt-1"}>
          {hasImage && (
            <div className="col-span-6 space-y-0.5">
              <div className={`w-full ${imageHeightClass} overflow-hidden border border-slate-300 bg-slate-100`}>
                <img src={article!.featuredImage} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
              <p className="text-[7.5px] font-semibold text-slate-500 italic">{photoCredit}</p>
            </div>
          )}

          <div className={hasImage ? "col-span-6 space-y-1 text-justify" : "grid grid-cols-2 gap-2.5 text-justify"}>
            <p className="text-[9.5px] font-semibold text-slate-800 leading-[1.38]">
              <span className="float-left text-2xl font-black text-[#B3121B] mr-1.5 leading-none">{location.charAt(0)}</span>
              <strong>{dateline}</strong>
              {summary}
            </p>
            {secondaryContent && (
              <p className="text-[8.5px] font-medium text-slate-700 leading-snug pt-1 border-t border-dashed border-slate-300">
                {secondaryContent}
              </p>
            )}
          </div>
        </div>
      </article>
    );
  }

  // Variant B: 7-column image + 5-column headline & text
  if (variant === 'B') {
    return (
      <article className="border-b-2 border-slate-900 pb-2">
        <div className="grid grid-cols-12 gap-2.5 items-start">
          <div className="col-span-7 space-y-0.5">
            <div className="flex items-center justify-between mb-0.5 text-[8px] font-bold text-slate-600">
              <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8px] font-black uppercase">
                {category}
              </span>
              <span>{location}</span>
            </div>
            <div className={`w-full ${imageHeightClass} overflow-hidden border border-slate-300 bg-slate-100`}>
              <img src={article!.featuredImage} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <p className="text-[7.5px] font-semibold text-slate-500 italic">{photoCredit}</p>
          </div>

          <div className="col-span-5 space-y-1 text-justify">
            <h2 className="text-[19px] font-black leading-[1.18] text-slate-950 tracking-tight">
              {headline}
            </h2>
            <div className="text-[7.5px] font-bold text-slate-500 border-b border-slate-200 pb-0.5 mb-0.5">
              {byline}
            </div>
            <p className="text-[9px] font-semibold text-slate-800 leading-[1.35]">
              <span className="float-left text-xl font-black text-[#B3121B] mr-1 leading-none">{location.charAt(0)}</span>
              <strong>{dateline}</strong>
              {summary}
            </p>
          </div>
        </div>
      </article>
    );
  }

  // Variant A (Default): 5-column image + 7-column headline & 2-column text
  return (
    <article className="border-b-2 border-slate-900 pb-2">
      <div className="flex items-center justify-between mb-0.5 text-[8px] font-bold text-slate-600">
        <span className="bg-[#B3121B] text-white px-1.5 py-0.2 text-[8px] font-black uppercase">
          {category}
        </span>
        <span>{byline}</span>
      </div>

      <h2 className="text-[23px] font-black leading-[1.18] text-slate-950 my-0.5 tracking-tight">
        {headline}
      </h2>

      <div className="grid grid-cols-12 gap-2.5 items-start mt-1">
        {hasImage && (
          <div className="col-span-5 space-y-0.5">
            <div className={`w-full ${imageHeightClass} overflow-hidden border border-slate-300 bg-slate-100`}>
              <img src={article!.featuredImage} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <p className="text-[7.5px] font-semibold text-slate-500 italic">{photoCredit}</p>
          </div>
        )}

        <div className={hasImage ? "col-span-7 space-y-1 text-justify" : "col-span-12 space-y-1 text-justify"}>
          <p className="text-[9.5px] font-semibold text-slate-800 leading-[1.38]">
            <span className="float-left text-2xl font-black text-[#B3121B] mr-1.5 leading-none">{location.charAt(0)}</span>
            <strong>{dateline}</strong>
            {summary}
          </p>
          {secondaryContent && (
            <p className="text-[8.5px] font-medium text-slate-700 leading-snug pt-0.5 border-t border-dashed border-slate-300">
              {secondaryContent}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

/**
 * Editorial Secondary Story
 */
interface SecondaryStoryProps {
  article?: BroadsheetArticle | null;
  defaultCity: string;
  categoryBadge?: string;
  hasImage?: boolean;
  borderRight?: boolean;
  summaryLength?: number;
}

export const SecondaryStoryBlock: React.FC<SecondaryStoryProps> = ({
  article,
  defaultCity,
  categoryBadge,
  hasImage = true,
  borderRight = false,
  summaryLength = 140,
}) => {
  const headline = article?.printHeadline || article?.titleGu || article?.title || 'શહેરી ઈન્ફ્રાસ્ટ્રક્ચર અને નાગરિક સેવાઓનો વ્યાપ વધારવાની કામગીરી';
  const summary = article?.printSummary || getCleanText(article?.excerptGu || article?.excerpt || article?.contentGu || article?.content || 'વહીવટી તંત્ર દ્વારા નાગરિકો માટે નવી માર્ગદર્શિકા જાહેર કરાઈ છે.', summaryLength);
  const location = article?.location || defaultCity;
  const dateline = getDatelinePrefix(location, defaultCity);
  const category = categoryBadge || article?.category?.nameGu || 'વિશેષ અહેવાલ';
  const showImage = hasImage && Boolean(article?.featuredImage);

  return (
    <article className={`space-y-0.5 ${borderRight ? 'border-r border-slate-300 pr-2' : ''}`}>
      <div className="flex items-center justify-between text-[7px] font-bold text-slate-500">
        <span className="text-[#B3121B] font-black uppercase">{category}</span>
        <span>{location}</span>
      </div>

      <h3 className="text-[12.5px] font-black leading-[1.2] text-slate-950 line-clamp-2">
        {headline}
      </h3>

      <div className="flex gap-1.5 items-start mt-0.5">
        {showImage && (
          <img
            src={article!.featuredImage}
            alt=""
            className="w-16 h-13 object-cover border border-slate-300 shrink-0 bg-slate-100"
            crossOrigin="anonymous"
          />
        )}
        <p className="text-[8.5px] font-medium text-slate-700 leading-[1.32] text-justify line-clamp-3 flex-1">
          <strong>{dateline}</strong>{summary}
        </p>
      </div>
    </article>
  );
};

/**
 * Editorial Standard Story Block (Text or Compact Photo)
 */
interface StandardStoryProps {
  article?: BroadsheetArticle | null;
  defaultCity: string;
  categoryBadge?: string;
  borderRight?: boolean;
}

export const StandardStoryBlock: React.FC<StandardStoryProps> = ({
  article,
  defaultCity,
  categoryBadge,
  borderRight = false,
}) => {
  const headline = article?.printHeadline || article?.titleGu || article?.title || 'વહીવટી તંત્ર દ્વારા વિશેષ વિકાસ કાર્યોની સમીક્ષા';
  const summary = article?.printSummary || getCleanText(article?.excerptGu || article?.excerpt || article?.contentGu || article?.content || 'નાગરિકોની સુખાકારી માટે નવા પ્રોજેક્ટ્સને મંજૂરી આપવામાં આવી છે.', 100);
  const location = article?.location || defaultCity;
  const dateline = getDatelinePrefix(location, defaultCity);
  const category = categoryBadge || article?.category?.nameGu || 'સમાચાર';

  return (
    <article className={`space-y-0.5 ${borderRight ? 'border-r border-slate-300 pr-2' : ''}`}>
      <span className="text-[7px] font-black uppercase text-slate-600 block">{category}</span>
      <h4 className="text-[10.5px] font-black leading-[1.2] text-slate-950 line-clamp-2">
        {headline}
      </h4>
      <p className="text-[8px] font-medium text-slate-700 leading-tight text-justify line-clamp-3">
        <strong>{dateline}</strong>{summary}
      </p>
    </article>
  );
};

/**
 * Compact Brief Item
 */
interface BriefItemProps {
  article?: BroadsheetArticle | null;
  defaultCity: string;
  defaultHeadline?: string;
  defaultSummary?: string;
  bulletColor?: string;
}

export const BriefItemBlock: React.FC<BriefItemProps> = ({
  article,
  defaultCity,
  defaultHeadline = 'સ્થાનિક સમાચાર સંક્ષિપ્ત',
  defaultSummary = 'સત્તાવાર સૂચના મુજબ વિવિધ કાર્યો હાથ ધરવામાં આવ્યા છે.',
  bulletColor = 'text-[#B3121B]',
}) => {
  const headline = article?.printHeadline || article?.titleGu || article?.title || defaultHeadline;
  const summary = article?.printSummary || getCleanText(article?.excerptGu || article?.excerpt || article?.contentGu || article?.content || defaultSummary, 90);
  const location = article?.location || defaultCity;

  return (
    <div className="space-y-0.5 text-justify">
      <h5 className="text-[9.5px] font-black leading-tight text-slate-950 line-clamp-2 flex items-start gap-1">
        <span className={`${bulletColor} font-black shrink-0`}>►</span>
        <span>{headline}</span>
      </h5>
      <p className="text-[7.5px] font-medium text-slate-700 leading-tight line-clamp-2 pl-2">
        <strong>{location}: </strong>{summary}
      </p>
    </div>
  );
};

/**
 * Printed Market Close & Weather Snapshot Bar (Page 1)
 */
interface MarketWeatherBarProps {
  date: string;
  city: string;
}

export const MarketWeatherBar: React.FC<MarketWeatherBarProps> = ({ date, city }) => {
  return (
    <div className="border-t border-b border-slate-900 py-0.5 my-1 grid grid-cols-12 gap-1 items-center text-[7.5px] font-bold text-slate-800 bg-[#fdfbf7] shrink-0">
      {/* Market Snapshot (8 cols) */}
      <div className="col-span-8 border-r border-slate-300 pr-1 flex items-center justify-between">
        <span className="font-black text-[#B3121B] uppercase flex items-center gap-0.5 shrink-0">
          <TrendingUp className="h-2.5 w-2.5" />
          <span>બજાર ક્લોઝિંગ:</span>
        </span>
        <span className="truncate">
          સેન્સેક્સ <strong>81,735</strong> <span className="text-emerald-700">(+1.2%)</span> |
          નિફ્ટી <strong>25,001</strong> <span className="text-emerald-700">(+1.1%)</span> |
          સોનું (10g) <strong>₹ 72,150</strong> |
          ચાંદી (1kg) <strong>₹ 84,900</strong> |
          USD <strong>₹ 83.12</strong>
        </span>
      </div>

      {/* Weather Snapshot (4 cols) */}
      <div className="col-span-4 pl-1 flex items-center justify-between">
        <span className="font-black text-slate-700 uppercase flex items-center gap-0.5 shrink-0">
          <CloudSun className="h-2.5 w-2.5 text-amber-600" />
          <span>હવામાન:</span>
        </span>
        <span className="truncate text-slate-700">
          {city}: <strong>34°C / 26°C</strong> (સામાન્ય વાદળછાયું)
        </span>
      </div>
    </div>
  );
};
