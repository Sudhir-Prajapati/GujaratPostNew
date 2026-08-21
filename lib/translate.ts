'use client';

import React, { useEffect, useState } from 'react';
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

function isAlreadyTargetLanguage(text: string, targetLang: Language): boolean {
  const plain = text.replace(/<[^>]*>/g, '').trim();
  if (!plain) return true;

  return (
    (targetLang === 'gu' && /[\u0A80-\u0AFF]/.test(plain)) ||
    (targetLang === 'hi' && /[\u0900-\u097F]/.test(plain)) ||
    (targetLang === 'en' && !/[\u0A80-\u0AFF\u0900-\u097F]/.test(plain))
  );
}

function shouldTranslateTextNode(text: string, targetLang: Language): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return false;
  return !isAlreadyTargetLanguage(trimmed, targetLang);
}

export async function translateHtmlOnFly(html: string, targetLang: Language): Promise<string> {
  if (!html || !html.trim()) return html || '';
  if (isAlreadyTargetLanguage(html, targetLang)) return html;

  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    return translateOnFly(html, targetLang);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
  const root = doc.body.firstElementChild;
  if (!root) return html;

  const nodes: Text[] = [];
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const textNode = current as Text;
    const parentTag = textNode.parentElement?.tagName.toLowerCase();
    if (parentTag !== 'script' && parentTag !== 'style' && shouldTranslateTextNode(textNode.nodeValue || '', targetLang)) {
      nodes.push(textNode);
    }
    current = walker.nextNode();
  }

  await Promise.all(nodes.map(async (node) => {
    const original = node.nodeValue || '';
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    const translated = await translateOnFly(original.trim(), targetLang);
    node.nodeValue = `${leading}${translated}${trailing}`;
  }));

  return root.innerHTML || html;
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

export function useAutoTranslateHtml(html: string, targetLang: Language): string {
  const getInitialValue = (): string => {
    if (!html || typeof html !== 'string' || !html.trim()) return html || '';
    if (
      html.includes('<figure') ||
      html.includes('<iframe') ||
      html.includes('<img') ||
      html.includes('<table')
    ) return html;
    return isAlreadyTargetLanguage(html, targetLang) ? html : '';
  };

  const [translatedHtml, setTranslatedHtml] = useState<string>(getInitialValue);

  useEffect(() => {
    let cancelled = false;

    if (!html || typeof html !== 'string' || !html.trim()) {
      setTranslatedHtml(html || '');
      return;
    }

    if (
      html.includes('<figure') ||
      html.includes('<iframe') ||
      html.includes('<img') ||
      html.includes('<table')
    ) {
      setTranslatedHtml(html);
      return;
    }

    if (isAlreadyTargetLanguage(html, targetLang)) {
      setTranslatedHtml(html);
      return;
    }

    translateHtmlOnFly(html, targetLang).then((result) => {
      if (!cancelled && result) {
        setTranslatedHtml(result);
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
export function TranslatedText({ text, className = '' }: { text: string; className?: string }) {
  return React.createElement('span', { className }, text || '');
}
