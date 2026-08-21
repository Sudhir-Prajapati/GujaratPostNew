'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

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

function clearGoogleTranslateCookie() {
  if (typeof document === 'undefined') return;

  try {
    const { hostname } = window.location;
    const domains = ['', hostname, `.${hostname}`];

    domains.forEach((domain) => {
      document.cookie = [
        'googtrans=',
        'expires=Thu, 01 Jan 1970 00:00:00 UTC',
        'path=/',
        domain ? `domain=${domain}` : '',
      ].filter(Boolean).join('; ');
    });
  } catch (e) {
    console.warn('Failed to clear Google Translate cookie:', e);
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('gu');
  const [fsLevel, setFsLevel] = useState<number>(1);
  const hydrated = useRef(false);

  useEffect(() => {
    let savedTheme: string | null = null;
    let savedLanguage: string | null = null;
    let savedFsLevel: string | null = null;

    clearGoogleTranslateCookie();

    try {
      savedTheme = localStorage.getItem('gp-theme');
      savedLanguage = sessionStorage.getItem('gp-lang'); // session-only: resets each new tab
      savedFsLevel = localStorage.getItem('gp-fs-level');
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }

    const frame = window.requestAnimationFrame(() => {
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);

      if (savedLanguage === 'gu' || savedLanguage === 'en' || savedLanguage === 'hi') {
        // User has an explicit saved preference — honour it
        setLanguage(savedLanguage as Language);
      } else {
        // First-time session: no preference saved → persist 'gu' as the session default
        try {
          sessionStorage.setItem('gp-lang', 'gu');
        } catch (e) {
          console.warn('Failed to save default language:', e);
        }
        // State already initialised to 'gu', nothing else to do
      }

      if (savedFsLevel !== null) {
        const level = parseInt(savedFsLevel, 10);
        if (!isNaN(level) && level >= 0 && level <= 3) setFsLevel(level);
      }

      hydrated.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--gp-font-size', FONT_SIZES[fsLevel]);

    if (!hydrated.current) return;
    try {
      localStorage.setItem('gp-theme', theme);
      localStorage.setItem('gp-fs-level', String(fsLevel));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [theme, fsLevel]);

  useEffect(() => {
    document.documentElement.lang = language;
    clearGoogleTranslateCookie();

    if (!hydrated.current) return;
    try {
      sessionStorage.setItem('gp-lang', language); // session-only: resets each new tab
    } catch (e) {
      console.warn('Failed to save language to sessionStorage:', e);
    }
  }, [language]);

  const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  const handleSetLanguage = (nextLanguage: Language) => setLanguage(nextLanguage);
  const incFs = () => setFsLevel((current) => Math.min(current + 1, 3));
  const decFs = () => setFsLevel((current) => Math.max(current - 1, 0));

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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
