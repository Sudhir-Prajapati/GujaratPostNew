'use client';

import React from 'react';
import { formatGujaratiDate } from '../types';
import { LucideIcon } from 'lucide-react';

interface SharedMastheadProps {
  pageNumber: number;
  totalPages: number;
  city: string;
  cityGu?: string;
  date: string;
  sectionTitle: string;
  sectionSubtitle: string;
  sectionIcon?: LucideIcon;
  volumeNumber?: number;
  issueNumber?: number;
}

export const SharedMasthead: React.FC<SharedMastheadProps> = ({
  pageNumber,
  totalPages,
  city,
  cityGu,
  date,
  sectionTitle,
  sectionSubtitle,
  sectionIcon: SectionIcon,
  volumeNumber = 14,
  issueNumber = 248,
}) => {
  const gujaratiDateStr = formatGujaratiDate(date);
  const displayCity = cityGu || city;

  return (
    <header className="border-b-2 border-slate-900 pb-1 shrink-0">
      {/* Top tagline and date bar */}
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 border-b border-slate-300 pb-0.5 mb-1">
        <div className="flex items-center gap-2">
          <span className="bg-[#B3121B] text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
            દૈનિક અખબાર
          </span>
          <span>{gujaratiDateStr}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold uppercase text-[#B3121B]">{displayCity} EDITION</span>
          <span>•</span>
          <span className="font-bold">પાનું નં. {pageNumber}</span>
          <span>•</span>
          <span className="font-bold">કિંમત ₹ ૫.૦૦</span>
        </div>
      </div>

      {/* Main Masthead Banner */}
      <div className="flex items-center justify-between py-0.5 px-1">
        <div className="text-left w-1/4">
          <div className="text-[9px] font-extrabold uppercase text-slate-600 tracking-wider">
            VOLUME {volumeNumber} • ISSUE {issueNumber}
          </div>
          <div className="text-[10px] font-black text-[#B3121B] mt-0.5 truncate">
            {sectionTitle}
          </div>
        </div>

        {/* Central Big Gujarati Logo */}
        <div className="text-center flex-1">
          <h1 className="text-[34px] font-black text-[#B3121B] tracking-tight leading-none drop-shadow-sm flex items-center justify-center gap-2">
            <span className="text-slate-950 font-black">ગુજરાત</span>
            <span>પોસ્ટ</span>
          </h1>
          <p className="text-[8.5px] font-bold text-slate-600 uppercase tracking-[0.25em] mt-0.5 border-t border-slate-300 pt-0.5 inline-block">
            GUJARAT POST • THE VOICE OF GUJARAT • WWW.GUJARATPOST.COM
          </p>
        </div>

        <div className="text-right w-1/4">
          <span className="inline-block border border-slate-400 bg-slate-100 px-2 py-0.5 rounded text-[8.5px] font-extrabold text-slate-800 uppercase">
            E-PAPER EDITION
          </span>
          <div className="text-[8px] font-bold text-slate-500 mt-0.5">
            તારીખ: {date}
          </div>
        </div>
      </div>

      {/* Red Breaking / Section Banner Strip */}
      <div className="mt-0.5 bg-[#B3121B] text-white px-2.5 py-0.5 flex items-center justify-between rounded text-[9.5px] font-black">
        <span className="flex items-center gap-1.5 truncate">
          {SectionIcon && <SectionIcon className="h-3.5 w-3.5 text-amber-300 shrink-0" />}
          <span className="truncate">{sectionSubtitle}</span>
        </span>
        <span className="text-[8.5px] font-bold text-amber-200 uppercase tracking-wider shrink-0 ml-2">
          {displayCity} • સત્ય અને સચોટ સમાચાર
        </span>
      </div>
    </header>
  );
};
