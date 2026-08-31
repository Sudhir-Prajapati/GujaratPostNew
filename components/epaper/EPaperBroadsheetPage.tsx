'use client';

import React from 'react';
import { Newspaper, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

export interface BroadsheetArticle {
  id: string;
  title: string;
  titleGu?: string;
  titleHi?: string;
  excerpt?: string;
  excerptGu?: string;
  content?: string;
  contentGu?: string;
  featuredImage?: string;
  location?: string;
  category?: {
    name?: string;
    nameGu?: string;
    slug?: string;
  };
  author?: {
    name?: string;
    nameGu?: string;
  };
  createdAt?: string;
}

export interface EPaperPageData {
  pageNumber: number;
  totalPages: number;
  city: string;
  cityGu?: string;
  date: string;
  pageTitle?: string;
  leadArticle?: BroadsheetArticle | null;
  secondArticle?: BroadsheetArticle | null;
  sideArticles?: BroadsheetArticle[];
  bottomArticles?: BroadsheetArticle[];
}

interface EPaperBroadsheetPageProps {
  data: EPaperPageData;
  scale?: number;
  isPrintPreview?: boolean;
}

function formatGujaratiDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('gu-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getCleanText(htmlOrText?: string, maxLen: number = 300): string {
  if (!htmlOrText) return '';
  const clean = htmlOrText.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.substring(0, maxLen) + '...';
}

export const EPaperBroadsheetPage: React.FC<EPaperBroadsheetPageProps> = ({
  data,
  scale = 1,
  isPrintPreview = false,
}) => {
  const {
    pageNumber = 1,
    totalPages = 4,
    city = 'Ahmedabad',
    cityGu = 'અમદાવાદ',
    date = '',
    pageTitle,
    leadArticle,
    secondArticle,
    sideArticles = [],
    bottomArticles = [],
  } = data;

  const gujaratiDateStr = formatGujaratiDate(date);
  const displayCity = cityGu || city;

  // Placeholder texts if no articles are assigned
  const defaultLeadHeadline = `${displayCity} આવૃત્તિ: મુખ્ય દૈનિક અહેવાલ અને તાજા સમાચાર`;
  const defaultLeadContent = `ગુજરાત પોસ્ટ સમાચાર સેવા: રાજ્ય, દેશ અને ${displayCity} શહેરના મહત્વપૂર્ણ સમાચારો અને વિકાસ કાર્યોની વિગતવાર માહિતી. નાગરિકો માટે ઉપયોગી જાહેરાતો અને વિશ્લેષણાત્મક અહેવાલો.`;

  return (
    <div
      className="bg-white text-slate-900 font-sans mx-auto overflow-hidden shadow-2xl relative select-none"
      style={{
        width: '794px',
        minHeight: '1123px',
        height: '1123px',
        boxSizing: 'border-box',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        fontFamily: "'Noto Sans Gujarati', 'Hind Vadodara', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div className="h-full flex flex-col justify-between p-7 bg-[#fffdfa] border-[3px] border-slate-900">
        {/* ─── 1. TOP MASTHEAD & NEWSPAPER HEADER ─── */}
        <header className="border-b-2 border-slate-900 pb-2">
          {/* Top tagline and date bar */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-slate-300 pb-1.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#B3121B] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase">
                દૈનિક અખબાર
              </span>
              <span>{gujaratiDateStr}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-extrabold uppercase text-[#B3121B]">{displayCity} EDITION</span>
              <span>•</span>
              <span className="font-bold">પાનું નં. {pageNumber}</span>
              <span>•</span>
              <span className="font-bold">કિંમત ₹ ૫.૦૦</span>
            </div>
          </div>

          {/* Main Masthead Banner */}
          <div className="flex items-center justify-between py-1 px-1">
            <div className="text-left w-1/4">
              <div className="text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">
                VOLUME 14 • ISSUE 248
              </div>
              <div className="text-[11px] font-black text-[#B3121B] mt-0.5">
                {pageTitle || (pageNumber === 1 ? 'મુખપૃષ્ઠ (FRONT PAGE)' : pageNumber === 2 ? 'શહેર વિશેષ (CITY NEWS)' : pageNumber === 3 ? 'રાજ્ય અને દેશ (STATE & NATION)' : 'વ્યાપાર અને રમતગમત')}
              </div>
            </div>

            {/* Central Big Gujarati Logo */}
            <div className="text-center flex-1">
              <h1 className="text-4xl font-black text-[#B3121B] tracking-tight leading-none drop-shadow-sm flex items-center justify-center gap-2">
                <span className="text-slate-950 font-black">ગુજરાત</span>
                <span>પોસ્ટ</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.25em] mt-1 border-t border-slate-300 pt-0.5 inline-block">
                GUJARAT POST • THE VOICE OF GUJARAT • WWW.GUJARATPOST.COM
              </p>
            </div>

            <div className="text-right w-1/4">
              <span className="inline-block border border-slate-400 bg-slate-100 px-2 py-1 rounded text-[10px] font-extrabold text-slate-800 uppercase">
                E-PAPER EDITION
              </span>
              <div className="text-[9px] font-bold text-slate-500 mt-1">
                તારીખ: {date}
              </div>
            </div>
          </div>

          {/* Red Breaking / Sub-Masthead News Flash Bar */}
          <div className="mt-1.5 bg-[#B3121B] text-white px-3 py-1 flex items-center justify-between rounded text-[11px] font-black">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              <span>આજના મુખ્ય સમાચાર અને વિશેષ અહેવાલ</span>
            </span>
            <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">
              {displayCity} • સત્ય અને સચોટ સમાચાર
            </span>
          </div>
        </header>

        {/* ─── 2. MAIN BROADSHEET EDITORIAL GRID (Multi-column layout) ─── */}
        <main className="flex-1 my-3 grid grid-cols-12 gap-3.5 overflow-hidden">
          
          {/* ── LEFT & CENTER: LEAD STORY + SECOND STORY (8 Columns) ── */}
          <div className="col-span-8 flex flex-col justify-between border-r-2 border-slate-300 pr-3.5 space-y-3">
            
            {/* ── LEAD HEADLINE STORY (ટોચનો અહેવાલ) ── */}
            <div className="border-b-2 border-slate-300 pb-3">
              {/* Category Pill + Byline */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="bg-[#B3121B] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {leadArticle?.category?.nameGu || leadArticle?.category?.name || 'મુખ્ય અહેવાલ'}
                </span>
                <span className="text-[10px] font-bold text-slate-600">
                  {leadArticle?.location || displayCity} | {leadArticle?.author?.name || 'વિશેષ પ્રતિનિધિ'}
                </span>
              </div>

              {/* Big Gujarati Headline */}
              <h2 className="text-[21px] font-black leading-tight text-slate-950 hover:text-[#B3121B] transition-colors mb-2">
                {leadArticle?.titleGu || leadArticle?.title || defaultLeadHeadline}
              </h2>

              {/* Lead Image & Content Layout */}
              <div className="grid grid-cols-12 gap-3 mt-2">
                {leadArticle?.featuredImage ? (
                  <div className="col-span-6 space-y-1">
                    <div className="w-full h-44 overflow-hidden rounded border border-slate-300 bg-slate-200">
                      <img
                        src={leadArticle.featuredImage}
                        alt="Lead News"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-[9px] font-semibold text-slate-500 italic leading-tight">
                      તસવીર: {leadArticle?.location || displayCity} - ગુજરાત પોસ્ટ
                    </p>
                  </div>
                ) : null}

                <div className={leadArticle?.featuredImage ? 'col-span-6' : 'col-span-12'}>
                  <p className="text-[11.5px] font-semibold text-slate-800 leading-relaxed text-justify">
                    <span className="text-base font-black text-[#B3121B] float-left mr-1.5 leading-none">
                      {(leadArticle?.location || displayCity).charAt(0)}
                    </span>
                    <strong>{leadArticle?.location || displayCity}: </strong>
                    {getCleanText(leadArticle?.excerptGu || leadArticle?.excerpt || leadArticle?.contentGu || leadArticle?.content || defaultLeadContent, 340)}
                  </p>
                  <div className="mt-2 pt-2 border-t border-dashed border-slate-300 text-[10.5px] font-bold text-slate-700 leading-snug">
                    {getCleanText(leadArticle?.contentGu || leadArticle?.content, 180)}
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECOND STORY (દ્વિતીય અહેવાલ) ── */}
            <div className="grid grid-cols-12 gap-3 flex-1 items-start">
              {secondArticle?.featuredImage && (
                <div className="col-span-4 h-32 overflow-hidden rounded border border-slate-300 bg-slate-200">
                  <img
                    src={secondArticle.featuredImage}
                    alt="Second Story"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              <div className={secondArticle?.featuredImage ? 'col-span-8' : 'col-span-12'}>
                <span className="text-[9.5px] font-black text-[#B3121B] uppercase tracking-wide">
                  {secondArticle?.category?.nameGu || secondArticle?.category?.name || 'વિશેષ સમાચાર'}
                </span>
                <h3 className="text-base font-black leading-snug text-slate-950 mt-0.5 mb-1">
                  {secondArticle?.titleGu || secondArticle?.title || `${displayCity} અને આસપાસના વિસ્તારોમાં મહત્વના વિકાસ કાર્યો`}
                </h3>
                <p className="text-[10.5px] font-medium text-slate-700 leading-relaxed text-justify">
                  {getCleanText(secondArticle?.excerptGu || secondArticle?.excerpt || secondArticle?.contentGu || secondArticle?.content, 200)}
                </p>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: SIDEBAR STORIES (4 Columns) ── */}
          <div className="col-span-4 flex flex-col justify-between space-y-2.5">
            {sideArticles && sideArticles.length > 0 ? (
              sideArticles.slice(0, 3).map((art, idx) => (
                <div
                  key={art.id || idx}
                  className={`pb-2.5 ${idx < 2 ? 'border-b border-slate-300' : ''}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B3121B]" />
                    <span className="text-[9px] font-black uppercase text-[#B3121B]">
                      {art.category?.nameGu || art.category?.name || 'સમાચાર સંક્ષિપ્ત'}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-950 leading-snug hover:text-[#B3121B] mb-1">
                    {art.titleGu || art.title}
                  </h4>

                  {art.featuredImage && (
                    <div className="w-full h-20 overflow-hidden rounded border border-slate-200 my-1 bg-slate-100">
                      <img
                        src={art.featuredImage}
                        alt="Sidebar"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}

                  <p className="text-[10px] font-medium text-slate-600 leading-snug text-justify">
                    {getCleanText(art.excerptGu || art.excerpt || art.contentGu || art.content, 120)}
                  </p>
                </div>
              ))
            ) : (
              <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="text-xs font-black text-[#B3121B] uppercase border-b border-slate-300 pb-1">
                  રાજ્ય અને રાષ્ટ્રીય અપડેટ્સ
                </div>
                <div className="text-[10.5px] font-bold text-slate-700">
                  • ગુજરાતમાં નવી ઔદ્યોગિક નીતિ હેઠળ રોકાણકારો માટે મોટી યોજનાઓની જાહેરાત.
                </div>
                <div className="text-[10.5px] font-bold text-slate-700">
                  • શિક્ષણ અને આરોગ્ય ક્ષેત્રે બજેટ ફાળવણીમાં વધારો કરવાનો રાજ્ય સરકારનો નિર્ણય.
                </div>
                <div className="text-[10.5px] font-bold text-slate-700">
                  • હવામાન વિભાગની આગાહી: આગામી દિવસોમાં રાજ્યભરમાં મધ્યમથી ભારે વરસાદની શક્યતા.
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ─── 3. BOTTOM 3-GRID COMPACT SECTION ─── */}
        <section className="border-t-2 border-slate-900 pt-2.5 mt-1 grid grid-cols-3 gap-3">
          {bottomArticles && bottomArticles.length > 0 ? (
            bottomArticles.slice(0, 3).map((bArt, bIdx) => (
              <div
                key={bArt.id || bIdx}
                className={`${bIdx < 2 ? 'border-r border-slate-300 pr-2.5' : ''}`}
              >
                <span className="text-[8.5px] font-black bg-slate-800 text-white px-1.5 py-0.5 rounded uppercase">
                  {bArt.category?.nameGu || bArt.category?.name || 'ઝડપી સમાચાર'}
                </span>
                <h5 className="text-[11px] font-black text-slate-950 leading-tight mt-1 mb-0.5 line-clamp-2">
                  {bArt.titleGu || bArt.title}
                </h5>
                <p className="text-[9.5px] font-medium text-slate-600 leading-snug line-clamp-2">
                  {getCleanText(bArt.excerptGu || bArt.excerpt || bArt.contentGu || bArt.content, 90)}
                </p>
              </div>
            ))
          ) : (
            <>
              <div className="border-r border-slate-300 pr-2.5">
                <span className="text-[8.5px] font-black bg-[#B3121B] text-white px-1.5 py-0.5 rounded uppercase">
                  વ્યાપાર બજાર
                </span>
                <h5 className="text-[11px] font-black text-slate-950 leading-tight mt-1 mb-0.5">
                  શેરબજાર અને સોના-ચાંદીના આજના તાજા ભાવ
                </h5>
                <p className="text-[9.5px] font-medium text-slate-600 leading-snug">
                  સેન્સેક્સ અને નિફ્ટીમાં તેજીનો માહોલ, સોનાના ભાવમાં સામાન્ય ઘટાડો નોંધાયો.
                </p>
              </div>

              <div className="border-r border-slate-300 pr-2.5">
                <span className="text-[8.5px] font-black bg-blue-700 text-white px-1.5 py-0.5 rounded uppercase">
                  રમત જગત
                </span>
                <h5 className="text-[11px] font-black text-slate-950 leading-tight mt-1 mb-0.5">
                  ભારતીય ક્રિકેટ ટીમની શાનદાર જીત
                </h5>
                <p className="text-[9.5px] font-medium text-slate-600 leading-snug">
                  રોમાંચક મેચમાં બોલરોના ઉત્કૃષ્ટ પ્રદર્શન સાથે શ્રેણીમાં વિજય હાંસલ કર્યો.
                </p>
              </div>

              <div>
                <span className="text-[8.5px] font-black bg-emerald-700 text-white px-1.5 py-0.5 rounded uppercase">
                  સિટી લાઈફ
                </span>
                <h5 className="text-[11px] font-black text-slate-950 leading-tight mt-1 mb-0.5">
                  {displayCity}માં સાંસ્કૃતિક મહોત્સવનું ભવ્ય આયોજન
                </h5>
                <p className="text-[9.5px] font-medium text-slate-600 leading-snug">
                  વિવિધ કલાકારો દ્વારા પ્રસ્તુતિ અને નાગરિકો માટે મનોરંજન કાર્યક્રમો.
                </p>
              </div>
            </>
          )}
        </section>

        {/* ─── 4. BOTTOM FOOTER & COPYRIGHT ─── */}
        <footer className="border-t border-slate-400 pt-1.5 mt-2 flex items-center justify-between text-[9.5px] font-bold text-slate-600">
          <div>
            <span>પ્રકાશક: ગુજરાત પોસ્ટ મીડિયા નેટવર્ક • મુદ્રક & પ્રકાશક: ગુજરાત પોસ્ટ પ્રેસ, {displayCity}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.COM</span>
            <span>•</span>
            <span>પાનું {pageNumber} / {totalPages}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default EPaperBroadsheetPage;
