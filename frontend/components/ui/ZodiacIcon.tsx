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
  const validSigns = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  const signName = validSigns.includes(cleanId) ? cleanId : 'aries';

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/zodiac/${signName}.png`}
      alt={signName}
      className={`object-contain ${className}`}
      loading="lazy"
    />
  );
}
