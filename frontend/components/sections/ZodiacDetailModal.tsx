'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Calendar } from 'lucide-react';
import { ZodiacIcon, GUJARAT_ZODIAC_LETTERS, HINDI_ZODIAC_LETTERS, ENGLISH_ZODIAC_LETTERS } from '@/components/ui/ZodiacIcon';
import type { ZodiacSign } from '@/components/sections/AstrologySection';
import { getPublicAstrology } from '@/lib/api';

interface ZodiacDetailModalProps {
  sign: ZodiacSign | null;
  onClose: () => void;
  language: 'gu' | 'en' | 'hi';
}

export default function ZodiacDetailModal({ sign, onClose, language }: ZodiacDetailModalProps) {
  const [mounted, setMounted] = useState(false);
  const [dynamicSign, setDynamicSign] = useState<any>(sign);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDynamicSign(sign);

    if (sign) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      // Always fetch fresh live daily horoscope data from public API if horoscope is missing
      if (!(sign as any)?.horoscope && !(sign as any)?.apiDate) {
        setLoading(true);
        getPublicAstrology()
          .then((signs) => {
            if (Array.isArray(signs)) {
              const found = signs.find(
                (s: any) => (s.id || s.slug || '').toLowerCase() === (sign.id || '').toLowerCase()
              );
              if (found) {
                setDynamicSign(found);
              }
            }
          })
          .finally(() => setLoading(false));
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
      setMounted(false);
    };
  }, [sign]);

  if (!sign || !mounted || typeof document === 'undefined') return null;

  const currentSign = dynamicSign || sign;
  const signKey = (currentSign.id || sign.id || 'aries').toLowerCase();

  const now = new Date();
  const daysGu = ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'];
  const monthsGu = ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'];

  const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const monthsHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];

  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formattedDateGu = (currentSign as any)?.dateGu || `${daysGu[now.getDay()]}, ${now.getDate()} ${monthsGu[now.getMonth()]} ${now.getFullYear()}`;
  const formattedDateHi = (currentSign as any)?.dateHi || `${daysHi[now.getDay()]}, ${now.getDate()} ${monthsHi[now.getMonth()]} ${now.getFullYear()}`;
  const formattedDateEn = (currentSign as any)?.date || `${daysEn[now.getDay()]}, ${now.getDate()} ${monthsEn[now.getMonth()]} ${now.getFullYear()}`;

  // Multilingual content selection based on selected active language
  let primaryName = currentSign.nameGu || sign.nameGu;
  let secondaryName = currentSign.name || sign.name;
  let letters = (currentSign as any).lettersGu ? `(${(currentSign as any).lettersGu})` : GUJARAT_ZODIAC_LETTERS[signKey] || `(${primaryName})`;
  let formattedDate = formattedDateGu;
  let liveTitle = 'આજનું દૈનિક રાશિફળ (Live Update)';
  let headerBadge = 'આજનું રાશિફળ';
  // Use translated Gujarati live text from API, fall back to predictionGu template
  let liveHoroscope = (currentSign as any)?.horoscopeGu || currentSign.predictionGu || currentSign.prediction;

  if (language === 'hi') {
    primaryName = currentSign.nameHi || sign.nameHi || currentSign.name;
    secondaryName = currentSign.name || sign.name;
    letters = HINDI_ZODIAC_LETTERS[signKey] || ((currentSign as any).lettersGu ? `(${(currentSign as any).lettersGu})` : `(${primaryName})`);
    formattedDate = formattedDateHi;
    liveTitle = 'आज का दैनिक राशिफल (Live Update)';
    headerBadge = 'आज का राशिफल';
    // Use translated Hindi live text from API, fall back to predictionHi template
    liveHoroscope = (currentSign as any)?.horoscopeHi || currentSign.predictionHi || currentSign.prediction;
  } else if (language === 'en') {
    primaryName = currentSign.name || sign.name;
    secondaryName = currentSign.nameGu || sign.nameGu;
    letters = ENGLISH_ZODIAC_LETTERS[signKey] || `(${primaryName})`;
    formattedDate = formattedDateEn;
    liveTitle = 'Daily Horoscope (Live Feed)';
    headerBadge = 'Daily Horoscope';
    liveHoroscope = (currentSign as any)?.horoscope || currentSign.prediction;
  }

  const liveDate = (currentSign as any)?.apiDate || (currentSign as any)?.date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  return createPortal(
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card Box */}
      <div className="relative w-full max-w-xl flex flex-col rounded-2xl bg-card border border-border/80 shadow-2xl z-10 overflow-hidden text-foreground">
        
        {/* Top Header Controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-card/95 px-5 py-3.5 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-[#B3121B] text-white shadow-sm flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              {headerBadge}
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[85vh]">
          
          {/* Zodiac Header Block */}
          <div className="flex flex-col items-center text-center pb-2">
            <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#FFF5E9] dark:bg-amber-950/40 border-2 border-[#FFC775] dark:border-amber-700/60 shadow-md mb-3 p-2">
              <ZodiacIcon id={signKey} className="h-16 w-16 sm:h-20 sm:w-20 object-contain m-auto" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {primaryName} {secondaryName && secondaryName !== primaryName ? `| ${secondaryName}` : ''}
            </h2>

            <p className="text-xs sm:text-sm font-bold text-muted-foreground mt-1">
              {letters}
            </p>

            <p className="text-xs sm:text-sm font-extrabold text-[#B3121B] mt-1.5">
              {formattedDate}
            </p>
          </div>

          {/* Live Daily Public API Data Card */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  {liveTitle}
                </span>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {liveDate}
              </span>
            </div>

            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading live horoscope...
              </div>
            ) : (
              <p className="text-sm sm:text-[15px] leading-relaxed font-medium text-foreground/90">
                {liveHoroscope}
              </p>
            )}
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
