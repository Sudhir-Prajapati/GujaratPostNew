'use client';

import React from 'react';

interface SharedFooterProps {
  pageNumber: number;
  totalPages: number;
  city: string;
  cityGu?: string;
}

export const SharedFooter: React.FC<SharedFooterProps> = ({
  pageNumber,
  totalPages,
  city,
  cityGu,
}) => {
  const displayCity = cityGu || city;

  return (
    <footer className="border-t border-slate-400 pt-0.5 mt-1 flex items-center justify-between text-[8px] font-bold text-slate-600 shrink-0">
      <div>
        <span>પ્રકાશક: ગુજરાત પોસ્ટ મીડિયા નેટવર્ક • મુદ્રક & પ્રકાશક: ગુજરાત પોસ્ટ પ્રેસ, {displayCity}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[#B3121B] font-black uppercase">WWW.GUJARATPOST.COM</span>
        <span>•</span>
        <span>પાનું {pageNumber} / {totalPages}</span>
      </div>
    </footer>
  );
};
