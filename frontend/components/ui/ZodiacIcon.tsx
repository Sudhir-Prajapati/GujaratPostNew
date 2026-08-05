import React from 'react';

export const GUJARAT_ZODIAC_LETTERS: Record<string, string> = {
  aries: '(અ, લ, ઈ)',
  taurus: '(બ, વ, ઉ)',
  gemini: '(ક, છ, ઘ)',
  cancer: '(ડ, હ)',
  leo: '(મ, ટ)',
  virgo: '(પ, ઠ, ણ)',
  libra: '(ર, ત)',
  scorpio: '(ન, ય)',
  sagittarius: '(ભ, ધ, ફ, ઢ)',
  capricorn: '(ખ, જ)',
  aquarius: '(ગ, સ, શ, ષ)',
  pisces: '(દ, ચ, ઝ, થ)',
};

export function ZodiacIcon({ id, className = "h-9 w-9" }: { id: string; className?: string }) {
  const cleanId = (id || '').toLowerCase();

  switch (cleanId) {
    case 'aries':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M32 24 Q24 6, 8 10 C4 20, 14 30, 26 26 Z" fill="#FFB74D" />
          <path d="M32 24 Q40 6, 56 10 C60 20, 50 30, 38 26 Z" fill="#FFB74D" />
          <path d="M22 24 Q32 18 42 24 L40 44 C40 52 24 52 24 44 Z" fill="#E65100" />
          <circle cx="27" cy="32" r="2" fill="#3E2723" />
          <circle cx="37" cy="32" r="2" fill="#3E2723" />
          <path d="M29 40 Q32 43 35 40" stroke="#FFE0B2" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'taurus':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M14 12 C8 24, 22 28, 26 28 C26 22, 20 14, 14 12 Z" fill="#FFA726" />
          <path d="M50 12 C56 24, 42 28, 38 28 C38 22, 44 14, 50 12 Z" fill="#FFA726" />
          <ellipse cx="32" cy="36" rx="12" ry="14" fill="#E65100" />
          <ellipse cx="32" cy="42" rx="7" ry="5" fill="#FFE0B2" />
          <circle cx="26" cy="32" r="2" fill="#3E2723" />
          <circle cx="38" cy="32" r="2" fill="#3E2723" />
        </svg>
      );
    case 'gemini':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="23" cy="22" r="7" fill="#FFB74D" />
          <path d="M15 48 C15 36, 31 36, 31 48 Z" fill="#FFE082" />
          <circle cx="41" cy="22" r="7" fill="#FF8A65" />
          <path d="M33 48 C33 36, 49 36, 49 48 Z" fill="#FFCC80" />
        </svg>
      );
    case 'cancer':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="36" rx="14" ry="10" fill="#E53935" />
          <path d="M16 28 C8 20, 8 10, 16 14 C20 16, 18 24, 18 28 Z" fill="#D32F2F" />
          <path d="M48 28 C56 20, 56 10, 48 14 C44 16, 46 24, 46 28 Z" fill="#D32F2F" />
          <circle cx="26" cy="32" r="2" fill="#FFF" />
          <circle cx="38" cy="32" r="2" fill="#FFF" />
          <circle cx="26" cy="32" r="1" fill="#000" />
          <circle cx="38" cy="32" r="1" fill="#000" />
        </svg>
      );
    case 'leo':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="32" r="20" fill="#FF9800" />
          <circle cx="32" cy="34" r="13" fill="#FFE082" />
          <polygon points="32,38 28,34 36,34" fill="#E65100" />
          <circle cx="26" cy="30" r="2" fill="#3E2723" />
          <circle cx="38" cy="30" r="2" fill="#3E2723" />
        </svg>
      );
    case 'virgo':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M22 18 Q32 10 42 18 Q44 32 38 44 Q32 52 24 44 Z" fill="#E53935" />
          <circle cx="32" cy="30" r="10" fill="#FFCC80" />
          <circle cx="40" cy="24" r="3.5" fill="#FFF59D" />
        </svg>
      );
    case 'libra':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M32 12 L32 48 M14 20 L50 20 M14 20 L8 38 L20 38 Z M50 20 L44 38 L56 38 Z" stroke="#FB8C00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M20 48 L44 48" stroke="#E65100" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'scorpio':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="34" rx="10" ry="13" fill="#D81B60" />
          <path d="M32 47 C32 55, 46 55, 46 44 C46 39, 40 39, 40 42" stroke="#AD1457" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M24 24 L14 16 L12 24 Z M40 24 L50 16 L52 24 Z" fill="#C2185B" />
        </svg>
      );
    case 'sagittarius':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M16 48 C32 32, 32 16, 48 16" stroke="#E65100" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M16 48 L48 16 M38 16 L48 16 L48 26" stroke="#FB8C00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case 'capricorn':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M22 12 Q16 22 26 28 M42 12 Q48 22 38 28" stroke="#FB8C00" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M24 26 L40 26 L35 48 C35 52, 29 52, 29 48 Z" fill="#F57C00" />
          <circle cx="28" cy="32" r="1.5" fill="#3E2723" />
          <circle cx="36" cy="32" r="1.5" fill="#3E2723" />
        </svg>
      );
    case 'aquarius':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M24 20 C24 16, 40 16, 40 20 L44 38 C44 48, 20 48, 20 38 Z" fill="#E65100" />
          <path d="M38 28 C48 28, 48 40, 56 42 C48 46, 44 36, 38 32 Z" fill="#FF8A65" />
        </svg>
      );
    case 'pisces':
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <path d="M24 14 C14 22, 14 34, 24 42 C28 32, 28 24, 24 14 Z" fill="#FF7043" />
          <path d="M40 22 C50 30, 50 42, 40 50 C36 40, 36 32, 40 22 Z" fill="#FF7043" />
          <circle cx="22" cy="24" r="1.5" fill="#FFF" />
          <circle cx="42" cy="40" r="1.5" fill="#FFF" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className}>
          <circle cx="32" cy="32" r="20" fill="#FF9800" />
        </svg>
      );
  }
}
