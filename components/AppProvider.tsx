'use client';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import NewsLoader from '@/components/ui/NewsLoader';

type Theme = 'light' | 'dark';
type Language = 'gu' | 'en' | 'hi';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  fsLevel: number;
  incFs: () => void;
  decFs: () => void;
}

const AppContext = createContext<AppContextType>({
  theme: 'light',
  toggleTheme: () => {},
  language: 'gu',
  setLanguage: () => {},
  fsLevel: 1,
  incFs: () => {},
  decFs: () => {},
});

const FONT_SIZES = ['14px', '16px', '18px', '20px'];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('gu');
  const [fsLevel, setFsLevel] = useState<number>(1);
  const hydrated = useRef(false);

  // Bounded retry helper to trigger Google Translate when initialized
  const triggerGoogleTranslate = (targetLang: Language, retries = 5) => {
    if (typeof window === 'undefined') return;

    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectEl) {
      if (selectEl.value !== targetLang) {
        selectEl.value = targetLang;
        selectEl.dispatchEvent(new Event('change'));
      }
    } else if (targetLang !== 'gu' && retries > 0) {
      setTimeout(() => triggerGoogleTranslate(targetLang, retries - 1), 500);
    }
  };

  useEffect(() => {
    let savedTheme: string | null = null;
    let savedLanguage: string | null = null;
    let savedFsLevel: string | null = null;
    try {
      savedTheme = localStorage.getItem('gp-theme');
      savedLanguage = localStorage.getItem('gp-lang');
      savedFsLevel = localStorage.getItem('gp-fs-level');
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }

    const frame = window.requestAnimationFrame(() => {
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }

      if (savedLanguage === 'gu' || savedLanguage === 'en' || savedLanguage === 'hi') {
        setLanguage(savedLanguage as Language);
        if (savedLanguage !== 'gu') {
          triggerGoogleTranslate(savedLanguage as Language);
        }
      }

      hydrated.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Keep body.style.top reset to 0px to prevent Google Translate top bar offset
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new MutationObserver(() => {
      if (document.body.style.top !== '0px' && document.body.style.top !== '') {
        document.body.style.top = '0px';
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  const resetGoogleTranslate = () => {
    if (typeof window === 'undefined') return;

    try {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;

      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.value = 'gu';
        selectEl.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.lang = 'gu'; // Keep source language as 'gu' so Google Translate translates Gujarati DOM text
    document.documentElement.style.setProperty('--gp-font-size', FONT_SIZES[fsLevel]);

    if (!hydrated.current) return;

    try {
      localStorage.setItem('gp-theme', theme);
      localStorage.setItem('gp-lang', language);
      localStorage.setItem('gp-fs-level', String(fsLevel));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }

    if (language === 'gu') {
      resetGoogleTranslate();
    } else {
      triggerGoogleTranslate(language);
    }
  }, [theme, language, fsLevel]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  const handleSetLanguage = (l: Language) => {
    setLanguage(l);
    if (l === 'gu') {
      resetGoogleTranslate();
    } else {
      triggerGoogleTranslate(l);
    }
  };

  const incFs = () => {
    setFsLevel((current) => Math.min(current + 1, 3));
  };

  const decFs = () => {
    setFsLevel((current) => Math.max(current - 1, 0));
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      language,
      setLanguage: handleSetLanguage,
      fsLevel,
      incFs,
      decFs,
    }),
    [theme, language, fsLevel],
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
