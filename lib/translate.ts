'use client';

import React, { useEffect, useState } from 'react';
import { Language } from '@/types';

const memoryCache: Record<string, string> = {};

/**
 * Cleanly translates text into target language (gu, hi, en) without external toolbars
 */
export async function translateOnFly(text: string, targetLang: Language): Promise<string> {
  if (!text || !text.trim()) return '';

  const trimmed = text.trim();

  // If target is Gujarati and text already contains Gujarati characters, return it
  if (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(trimmed)) {
    return trimmed;
  }
  // If target is Hindi and text already contains Devanagari characters, return it
  if (targetLang === 'hi' && /[\u0900-\u097F]/.test(trimmed)) {
    return trimmed;
  }
  // If target is English and text has no Indian script characters, return it
  if (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(trimmed)) {
    return trimmed;
  }

  const cacheKey = `${targetLang}:${trimmed}`;
  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (!res.ok) return trimmed;
    const data = await res.json();
    if (data && data[0] && Array.isArray(data[0])) {
      const translated = data[0].map((chunk: any) => chunk[0] || '').join('');
      if (translated && translated.trim()) {
        memoryCache[cacheKey] = translated;
        return translated;
      }
    }
  } catch (e) {
    console.warn('On-the-fly translation error:', e);
  }

  return trimmed;
}

/**
 * React Hook for automatic background text translation
 */
export function useAutoTranslate(text: string, targetLang: Language): string {
  const [translatedText, setTranslatedText] = useState(text);

  useEffect(() => {
    let isMounted = true;
    if (!text || !text.trim()) {
      setTranslatedText('');
      return;
    }

    if (
      (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(text)) ||
      (targetLang === 'hi' && /[\u0900-\u097F]/.test(text)) ||
      (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(text))
    ) {
      setTranslatedText(text);
      return;
    }

    setTranslatedText(text);

    translateOnFly(text, targetLang).then((result) => {
      if (isMounted && result) {
        setTranslatedText(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [text, targetLang]);

  return translatedText;
}

/**
 * React Component for inline auto-translation
 */
export function TranslatedText({ text, className = '' }: { text: string; className?: string }) {
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isMounted = true;
    if (!text) return;
    const lang = (document.documentElement.lang || 'gu') as Language;

    if (
      (lang === 'gu' && /[\u0A80-\u0AFF]/.test(text)) ||
      (lang === 'hi' && /[\u0900-\u097F]/.test(text)) ||
      (lang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(text))
    ) {
      setTranslated(text);
      return;
    }

    translateOnFly(text, lang).then((res) => {
      if (isMounted && res) setTranslated(res);
    });

    return () => {
      isMounted = false;
    };
  }, [text]);

  return React.createElement('span', { className }, translated);
}
