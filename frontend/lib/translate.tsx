'use client';

import { useEffect, useState } from 'react';
import { Language } from '@/types';

// ─── In-memory cache ──────────────────────────────────────────────────────────
const memoryCache: Record<string, string> = {};

// ─── In-flight deduplication: same key won't fire a second fetch ──────────────
const inFlight: Record<string, Promise<string>> = {};

// ─── Concurrency limiter: max 3 parallel translate requests ──────────────────
const MAX_CONCURRENT = 3;
let activeCount = 0;
const waitQueue: Array<() => void> = [];

function acquireSlot(): Promise<void> {
  if (activeCount < MAX_CONCURRENT) {
    activeCount++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    waitQueue.push(() => {
      activeCount++;
      resolve();
    });
  });
}

function releaseSlot(): void {
  activeCount--;
  const next = waitQueue.shift();
  if (next) next();
}

/**
 * Translates text to the target language using the Google Translate API.
 * - Uses in-memory cache to avoid re-translating the same text.
 * - Deduplicates identical in-flight requests (same text + lang won't fetch twice).
 * - Limits to MAX_CONCURRENT parallel fetches to prevent API flooding.
 */
export async function translateOnFly(text: string, targetLang: Language): Promise<string> {
  if (!text || !text.trim()) return '';

  const trimmed = text.trim();

  // Handle HTML: extract plain text for translation
  const hasHtml = /<[a-z][\s\S]*>/i.test(trimmed);
  let textToTranslate = trimmed;
  if (hasHtml) {
    // Preserve complex multi-block HTML (figure/img/iframe/table) as-is
    if (
      trimmed.includes('<figure') ||
      trimmed.includes('<iframe') ||
      trimmed.includes('<img') ||
      trimmed.includes('<table')
    ) {
      return trimmed;
    }
    textToTranslate = trimmed.replace(/<[^>]*>/g, '').trim();
  }

  if (!textToTranslate) return trimmed;

  // Early-exit: text is already in the target script
  if (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(textToTranslate)) return trimmed;
  if (targetLang === 'hi' && /[\u0900-\u097F]/.test(textToTranslate)) return trimmed;
  if (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(textToTranslate)) return trimmed;

  const cacheKey = `${targetLang}:${textToTranslate}`;

  // Cache hit
  if (memoryCache[cacheKey]) {
    const cached = memoryCache[cacheKey];
    return hasHtml ? trimmed.replace(textToTranslate, cached) : cached;
  }

  // Deduplicate: if already in-flight for this key, await the same promise
  if (cacheKey in inFlight) {
    const result = await inFlight[cacheKey];
    return hasHtml && result ? trimmed.replace(textToTranslate, result) : result || trimmed;
  }

  // Start a new fetch — guarded by the concurrency limiter
  const fetchPromise: Promise<string> = (async () => {
    await acquireSlot();
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
      const res = await fetch(url);
      if (!res.ok) return trimmed;
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translated = data[0].map((chunk: any) => chunk[0] || '').join('');
        if (translated && translated.trim()) {
          memoryCache[cacheKey] = translated;
          return hasHtml ? trimmed.replace(textToTranslate, translated) : translated;
        }
      }
    } catch (e) {
      console.warn('translateOnFly error:', e);
    } finally {
      releaseSlot();
      delete inFlight[cacheKey];
    }
    return trimmed;
  })();

  inFlight[cacheKey] = fetchPromise;
  return fetchPromise;
}

/**
 * React hook: translates `text` to `targetLang` in the background.
 * - Resolves synchronously from cache when possible (no flash).
 * - Uses a cancellation flag so stale async results are discarded.
 */
export function useAutoTranslate(text: string, targetLang: Language): string {
  // Resolve the initial value synchronously from cache to avoid a flash of the wrong language
  const getInitialValue = (): string => {
    if (!text || typeof text !== 'string' || !text.trim()) return text || '';
    if (
      text.includes('<figure') ||
      text.includes('<iframe') ||
      text.includes('<img') ||
      text.includes('<table')
    ) return text;

    const plain = text.replace(/<[^>]*>/g, '').trim();
    const alreadyRight =
      (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(plain)) ||
      (targetLang === 'hi' && /[\u0900-\u097F]/.test(plain)) ||
      (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(plain));
    if (alreadyRight) return text;

    const cached = memoryCache[`${targetLang}:${plain}`];
    return cached || ''; // empty means "loading", avoids flash of Gujarati
  };

  const [translatedText, setTranslatedText] = useState<string>(getInitialValue);

  useEffect(() => {
    let cancelled = false;

    if (!text || typeof text !== 'string' || !text.trim()) {
      setTranslatedText(text || '');
      return;
    }

    if (
      text.includes('<figure') ||
      text.includes('<iframe') ||
      text.includes('<img') ||
      text.includes('<table')
    ) {
      setTranslatedText(text);
      return;
    }

    const plain = text.replace(/<[^>]*>/g, '').trim();
    const alreadyRight =
      (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(plain)) ||
      (targetLang === 'hi' && /[\u0900-\u097F]/.test(plain)) ||
      (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(plain));

    if (alreadyRight) {
      setTranslatedText(text);
      return;
    }

    translateOnFly(text, targetLang).then((result) => {
      if (!cancelled && result) {
        setTranslatedText(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [text, targetLang]);

  return translatedText;
}

/**
 * React hook: translates HTML content to `targetLang` in the background.
 * - Passes through complex HTML (figure/iframe/img/table) as-is.
 * - For simpler HTML, strips tags then translates the plain text via translateOnFly.
 * - Falls back to the original HTML if translation is unnecessary or fails.
 */
export function useAutoTranslateHtml(html: string, targetLang: Language): string {
  const getInitialValue = (): string => {
    if (!html || typeof html !== 'string' || !html.trim()) return html || '';

    // Pass through complex multi-block HTML as-is
    if (
      html.includes('<figure') ||
      html.includes('<iframe') ||
      html.includes('<img') ||
      html.includes('<table')
    ) return html;

    const plain = html.replace(/<[^>]*>/g, '').trim();
    if (!plain) return html;

    const alreadyRight =
      (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(plain)) ||
      (targetLang === 'hi' && /[\u0900-\u097F]/.test(plain)) ||
      (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(plain));
    if (alreadyRight) return html;

    const cached = memoryCache[`${targetLang}:${plain}`];
    return cached ? html.replace(plain, cached) : '';
  };

  const [translatedHtml, setTranslatedHtml] = useState<string>(getInitialValue);

  useEffect(() => {
    let cancelled = false;

    if (!html || typeof html !== 'string' || !html.trim()) {
      setTranslatedHtml(html || '');
      return;
    }

    // Pass through complex multi-block HTML as-is
    if (
      html.includes('<figure') ||
      html.includes('<iframe') ||
      html.includes('<img') ||
      html.includes('<table')
    ) {
      setTranslatedHtml(html);
      return;
    }

    const plain = html.replace(/<[^>]*>/g, '').trim();
    if (!plain) {
      setTranslatedHtml(html);
      return;
    }

    const alreadyRight =
      (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(plain)) ||
      (targetLang === 'hi' && /[\u0900-\u097F]/.test(plain)) ||
      (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(plain));

    if (alreadyRight) {
      setTranslatedHtml(html);
      return;
    }

    translateOnFly(plain, targetLang).then((result) => {
      if (!cancelled && result && result !== plain) {
        // Replace the plain text inside the HTML with the translated text
        setTranslatedHtml(html.replace(plain, result));
      } else if (!cancelled) {
        setTranslatedHtml(html);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [html, targetLang]);

  return translatedHtml;
}

/**
 * React Component for inline translated text.
 */
import React from 'react';
export function TranslatedText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span suppressHydrationWarning className={className}>
      {text || ''}
    </span>
  );
}
