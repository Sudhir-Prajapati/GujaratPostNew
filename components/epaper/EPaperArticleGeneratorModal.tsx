'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Newspaper,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Eye,
  Layers,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  MapPin,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  SlidersHorizontal,
  FileCheck,
} from 'lucide-react';
import { getBackendApiUrl, authFetch } from '@/lib/api';
import { CityItem, createEPaperEdition, getTodayDateStr } from '@/lib/epaper';
import { EPaperBroadsheetPage, EPaperPageData, BroadsheetArticle } from './EPaperBroadsheetPage';
import { generateEPaperPdfFromElements, GeneratePdfProgress } from '@/lib/pdfGenerator';

interface EPaperArticleGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  citiesList: CityItem[];
  defaultCity?: string;
  defaultDate?: string;
  onEditionCreated: () => void;
}

const PAGE_TEMPLATES = [
  { id: 1, title: 'મુખપૃષ્ઠ (Front Page)', category: 'breaking' },
  { id: 2, title: 'શહેર વિશેષ (City News)', category: 'city' },
  { id: 3, title: 'રાજ્ય અને દેશ (State & Nation)', category: 'state' },
  { id: 4, title: 'વ્યાપાર અને રમતગમત (Business & Sports)', category: 'business' },
  { id: 5, title: 'વિશ્વ અને સંસ્કૃતિ (World & Culture)', category: 'world' },
  { id: 6, title: 'મનોરંજન & સિનેમા (Entertainment)', category: 'entertainment' },
  { id: 7, title: 'ટેકનોલોજી & વિજ્ઞાન (Tech & Science)', category: 'tech' },
  { id: 8, title: 'વિશેષ પૂર્તિ (Special Feature)', category: 'special' },
];

export const EPaperArticleGeneratorModal: React.FC<EPaperArticleGeneratorModalProps> = ({
  isOpen,
  onClose,
  citiesList,
  defaultCity,
  defaultDate,
  onEditionCreated,
}) => {
  // Edition Basic Meta
  const [city, setCity] = useState(defaultCity || citiesList[0]?.city || 'Ahmedabad');
  const [cityGu, setCityGu] = useState(defaultCity || citiesList[0]?.cityGu || 'અમદાવાદ');
  const [date, setDate] = useState(defaultDate || getTodayDateStr());
  const [title, setTitle] = useState(`${(defaultCity || 'Ahmedabad').toUpperCase()} EDITION`);
  const [totalPages, setTotalPages] = useState<number>(4);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  // Active View Tab: 'composer' vs 'preview'
  const [viewMode, setViewMode] = useState<'composer' | 'preview'>('composer');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  // Available Articles from Database
  const [availableArticles, setAvailableArticles] = useState<BroadsheetArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articleSearch, setArticleSearch] = useState('');

  // Pages Configuration State
  const [pagesData, setPagesData] = useState<EPaperPageData[]>([]);

  // Generation & Publishing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GeneratePdfProgress | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Ref for hidden render container
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Sync city name
  const handleCitySelect = (cityName: string) => {
    const found = citiesList.find((c) => c.city === cityName);
    setCity(found ? found.city : cityName);
    setCityGu(found ? found.cityGu || found.city : cityName);
    setTitle(`${cityName.toUpperCase()} EDITION`);
  };

  // Fetch Published Website Articles
  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const res = await authFetch(getBackendApiUrl('/api/admin/articles?status=PUBLISHED&limit=60'));
      const json = await res.json();
      const items = json?.data?.articles || json?.articles || [];
      setAvailableArticles(items);
      return items;
    } catch (err) {
      console.error('Error fetching articles for e-paper:', err);
      showToast('error', 'Failed to fetch website articles.');
      return [];
    } finally {
      setLoadingArticles(false);
    }
  };

  // Initialize Page Structures
  const initPages = (count: number, articles: BroadsheetArticle[] = availableArticles) => {
    const initialPages: EPaperPageData[] = [];

    for (let i = 0; i < count; i++) {
      const template = PAGE_TEMPLATES[i] || {
        id: i + 1,
        title: `પાનું ${i + 1}`,
        category: 'general',
      };

      initialPages.push({
        pageNumber: i + 1,
        totalPages: count,
        city,
        cityGu,
        date,
        pageTitle: template.title,
        leadArticle: null,
        secondArticle: null,
        sideArticles: [],
        bottomArticles: [],
      });
    }

    setPagesData(initialPages);
  };

  // Auto-Fill Articles Across All Pages
  const handleAutoFill = (articlesToUse: BroadsheetArticle[] = availableArticles) => {
    if (!articlesToUse || articlesToUse.length === 0) {
      showToast('error', 'No published articles found to auto-fill.');
      return;
    }

    const updatedPages: EPaperPageData[] = [];
    let articleIndex = 0;

    for (let i = 0; i < totalPages; i++) {
      const template = PAGE_TEMPLATES[i] || {
        id: i + 1,
        title: `પાનું ${i + 1}`,
        category: 'general',
      };

      // Assign Lead Story
      const lead = articlesToUse[articleIndex] || null;
      if (lead) articleIndex++;

      // Assign Second Story
      const second = articlesToUse[articleIndex] || null;
      if (second) articleIndex++;

      // Assign Side Stories (up to 3)
      const sides: BroadsheetArticle[] = [];
      for (let s = 0; s < 3; s++) {
        if (articlesToUse[articleIndex]) {
          sides.push(articlesToUse[articleIndex]);
          articleIndex++;
        }
      }

      // Assign Bottom Stories (up to 3)
      const bottoms: BroadsheetArticle[] = [];
      for (let b = 0; b < 3; b++) {
        if (articlesToUse[articleIndex]) {
          bottoms.push(articlesToUse[articleIndex]);
          articleIndex++;
        }
      }

      updatedPages.push({
        pageNumber: i + 1,
        totalPages,
        city,
        cityGu,
        date,
        pageTitle: template.title,
        leadArticle: lead,
        secondArticle: second,
        sideArticles: sides,
        bottomArticles: bottoms,
      });
    }

    setPagesData(updatedPages);
    showToast('success', `⚡ Auto-filled ${totalPages} pages with ${Math.min(articleIndex, articlesToUse.length)} website articles!`);
  };

  // On Modal Open
  useEffect(() => {
    if (isOpen) {
      fetchArticles().then((items) => {
        initPages(totalPages, items);
        if (items.length > 0) {
          handleAutoFill(items);
        }
      });
    }
  }, [isOpen]);

  // Adjust when totalPages changes
  const handlePageCountChange = (newCount: number) => {
    setTotalPages(newCount);
    if (activePageIndex >= newCount) {
      setActivePageIndex(0);
    }
    initPages(newCount);
    setTimeout(() => handleAutoFill(), 50);
  };

  // Assign an article to a specific slot on active page
  const assignArticleToSlot = (
    slot: 'lead' | 'second' | 'side' | 'bottom',
    article: BroadsheetArticle,
    indexInSlot?: number
  ) => {
    setPagesData((prev) => {
      const copy = [...prev];
      const page = { ...copy[activePageIndex] };

      if (slot === 'lead') {
        page.leadArticle = article;
      } else if (slot === 'second') {
        page.secondArticle = article;
      } else if (slot === 'side') {
        const sides = [...(page.sideArticles || [])];
        if (indexInSlot !== undefined && indexInSlot < sides.length) {
          sides[indexInSlot] = article;
        } else {
          sides.push(article);
        }
        page.sideArticles = sides.slice(0, 3);
      } else if (slot === 'bottom') {
        const bottoms = [...(page.bottomArticles || [])];
        if (indexInSlot !== undefined && indexInSlot < bottoms.length) {
          bottoms[indexInSlot] = article;
        } else {
          bottoms.push(article);
        }
        page.bottomArticles = bottoms.slice(0, 3);
      }

      copy[activePageIndex] = page;
      return copy;
    });

    showToast('success', `Article assigned to ${slot.toUpperCase()} slot on Page ${activePageIndex + 1}`);
  };

  const removeArticleFromSlot = (
    slot: 'lead' | 'second' | 'side' | 'bottom',
    indexInSlot?: number
  ) => {
    setPagesData((prev) => {
      const copy = [...prev];
      const page = { ...copy[activePageIndex] };

      if (slot === 'lead') page.leadArticle = null;
      else if (slot === 'second') page.secondArticle = null;
      else if (slot === 'side' && indexInSlot !== undefined) {
        page.sideArticles = (page.sideArticles || []).filter((_, idx) => idx !== indexInSlot);
      } else if (slot === 'bottom' && indexInSlot !== undefined) {
        page.bottomArticles = (page.bottomArticles || []).filter((_, idx) => idx !== indexInSlot);
      }

      copy[activePageIndex] = page;
      return copy;
    });
  };

  // Filter available articles
  const filteredArticles = availableArticles.filter((art) => {
    if (!articleSearch) return true;
    const q = articleSearch.toLowerCase();
    return (
      art.title?.toLowerCase().includes(q) ||
      art.titleGu?.toLowerCase().includes(q) ||
      art.category?.name?.toLowerCase().includes(q) ||
      art.category?.nameGu?.toLowerCase().includes(q)
    );
  });

  // ─── GENERATE PDF & PUBLISH EDITION ───
  const handleGenerateAndPublish = async () => {
    if (!renderContainerRef.current) {
      showToast('error', 'Render container not ready.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress({
      currentPage: 1,
      totalPages,
      stage: 'rendering',
      message: 'Starting PDF rendering... (ન્યૂઝપેપર તૈયાર થઈ રહ્યું છે)',
    });

    try {
      const pageElements = Array.from(
        renderContainerRef.current.querySelectorAll('.broadsheet-render-page')
      ) as HTMLElement[];

      if (pageElements.length === 0) {
        throw new Error('No broadsheet pages found to render.');
      }

      // 1. Generate PDF from DOM
      const { pdfFile, firstPageThumbnail } = await generateEPaperPdfFromElements(
        pageElements,
        `Gujarat_Post_${city}_${date}.pdf`,
        (prog) => setGenerationProgress(prog)
      );

      // 2. Upload PDF file and Thumbnail to Server
      setGenerationProgress({
        currentPage: totalPages,
        totalPages,
        stage: 'compiling',
        message: 'Uploading generated PDF to server... (સર્વર પર અપલોડ થઈ રહ્યું છે)',
      });

      const formData = new FormData();
      formData.append('file', pdfFile);

      const uploadRes = await authFetch(getBackendApiUrl('/api/admin/upload'), {
        method: 'POST',
        body: formData,
      });

      const uploadJson = await uploadRes.json();
      if (uploadRes.status === 401 || uploadJson?.error?.includes('token') || uploadJson?.error?.includes('expired')) {
        throw new Error('Your admin session has expired. Please log in again to continue.');
      }

      const remotePdfUrl = uploadJson?.data?.url || uploadJson?.url;

      if (!remotePdfUrl) {
        throw new Error(uploadJson?.error || 'Failed to upload generated PDF.');
      }

      // Upload First Page Thumbnail to Server
      let remoteThumbUrl = '';
      if (firstPageThumbnail && firstPageThumbnail.startsWith('data:image/')) {
        try {
          const res = await fetch(firstPageThumbnail);
          const blob = await res.blob();
          const thumbFile = new File([blob], 'epaper_thumbnail.jpg', { type: 'image/jpeg' });
          const thumbFormData = new FormData();
          thumbFormData.append('file', thumbFile);
          const thumbRes = await authFetch(getBackendApiUrl('/api/admin/upload'), {
            method: 'POST',
            body: thumbFormData,
          });
          const thumbJson = await thumbRes.json();
          remoteThumbUrl = thumbJson?.data?.url || thumbJson?.url || '';
        } catch (thumbErr) {
          console.warn('Thumbnail upload note:', thumbErr);
        }
      }

      // 3. Save Edition to Database
      setGenerationProgress({
        currentPage: totalPages,
        totalPages,
        stage: 'completed',
        message: 'Publishing edition to database... (એડિશન સેવ થઈ રહી છે)',
      });

      const editionPayload = {
        title: title.trim() || `${city.toUpperCase()} EDITION`,
        city: city.trim(),
        cityGu: cityGu.trim() || city.trim(),
        date,
        pages: totalPages,
        fileUrl: remotePdfUrl,
        thumbnailUrl: remoteThumbUrl || undefined,
        status,
        publishTime: '06:00 AM',
        isActive: true,
      };

      const createRes = await createEPaperEdition(editionPayload);

      if (createRes?.edition) {
        showToast('success', `🎉 "${editionPayload.title}" E-Paper Edition generated & published successfully!`);
        setTimeout(() => {
          onEditionCreated();
          onClose();
        }, 1200);
      } else {
        throw new Error(createRes?.error || 'Failed to save generated edition in database.');
      }
    } catch (err: any) {
      console.error('E-Paper Generation Error:', err);
      showToast('error', err.message || 'Error generating PDF edition.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  if (!isOpen) return null;

  const activePageData = pagesData[activePageIndex] || {
    pageNumber: activePageIndex + 1,
    totalPages,
    city,
    cityGu,
    date,
    pageTitle: PAGE_TEMPLATES[activePageIndex]?.title || `પાનું ${activePageIndex + 1}`,
  };

  const displayCity = cityGu || city;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-2 sm:p-4">
      <div className="relative flex h-full max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Toast */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 z-[99999] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-white text-xs font-black animate-in slide-in-from-right ${toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toastMessage.text}
          </div>
        )}

        {/* ─── MODAL HEADER ─── */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#B3121B] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#B3121B]/10 text-[#B3121B] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Option 2: Website Articles to Newspaper PDF
                </span>
              </div>
              <h2 className="text-base font-black text-zinc-900 dark:text-white leading-tight mt-0.5">
                Dynamic E-Paper Creator (ઓટો ઈ-પેપર જનરેટર)
              </h2>
            </div>
          </div>

          {/* Top Actions: Auto-Fill, Switch View & Close */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleAutoFill()}
              disabled={isGenerating || loadingArticles}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer shadow-sm disabled:opacity-50"
              title="Auto-organize top articles into pages"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>⚡ 1-Click Auto Fill (ઓટો સેટ કરો)</span>
            </button>

            {/* View Mode Toggle: Composer vs Broadsheet Preview */}
            <div className="flex items-center bg-zinc-200 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('composer')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${viewMode === 'composer' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow' : 'text-zinc-500'}`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 inline mr-1" />
                Composer
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${viewMode === 'preview' ? 'bg-[#B3121B] text-white shadow' : 'text-zinc-500'}`}
              >
                <Eye className="h-3.5 w-3.5 inline mr-1" />
                Live Broadsheet Preview
              </button>
            </div>

            <button
              onClick={onClose}
              disabled={isGenerating}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer disabled:opacity-40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ─── EDITION SETTINGS BAR ─── */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* City */}
            <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
              <MapPin className="h-4 w-4 text-[#B3121B]" />
              <select
                value={city}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-black cursor-pointer"
              >
                {citiesList.map((c) => (
                  <option key={c.id} value={c.city}>
                    {c.cityGu || c.city} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
              <CalendarDays className="h-4 w-4 text-[#B3121B]" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-black cursor-pointer"
              />
            </div>

            {/* Total Pages Count */}
            <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
              <Layers className="h-4 w-4 text-[#B3121B]" />
              <span>Pages:</span>
              {[1, 2, 4, 8].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => handlePageCountChange(cnt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${totalPages === cnt ? 'bg-[#B3121B] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 hover:bg-zinc-200'}`}
                >
                  {cnt} {cnt === 1 ? 'Page' : 'Pages'}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center gap-1 font-bold">
              <span className="text-zinc-500">Status:</span>
              <button
                type="button"
                onClick={() => setStatus(status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${status === 'PUBLISHED' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}
              >
                {status}
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-bold">Title:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-xs font-bold w-48 sm:w-60"
              placeholder="EDITION TITLE"
            />
          </div>
        </div>

        {/* ─── PAGE NAVIGATION TABS ─── */}
        <div className="flex items-center gap-2 overflow-x-auto px-6 py-2 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <span className="text-xs font-black text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
            Pages:
          </span>
          {Array.from({ length: totalPages }, (_, i) => {
            const isSelected = activePageIndex === i;
            const tpl = PAGE_TEMPLATES[i] || { title: `Page ${i + 1}` };
            return (
              <button
                key={i}
                onClick={() => setActivePageIndex(i)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#B3121B] text-white shadow-md'
                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                }`}
              >
                <span>Page {i + 1}</span>
                <span className="opacity-80 text-[10px] hidden sm:inline">({tpl.title.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* ─── MAIN CONTENT AREA: COMPOSER OR LIVE PREVIEW ─── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-950/50">
          {viewMode === 'composer' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: PAGE SLOTS ASSIGNMENT (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Active Page Header Info */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-[#B3121B]/10 text-[#B3121B]">
                      Editing Page {activePageIndex + 1} of {totalPages}
                    </span>
                    <h3 className="text-base font-black text-zinc-900 dark:text-white mt-1">
                      {PAGE_TEMPLATES[activePageIndex]?.title || `પાનું ${activePageIndex + 1}`}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 text-xs font-black cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#B3121B]" />
                    Preview Page
                  </button>
                </div>

                {/* ── 1. LEAD HEADLINE STORY SLOT ── */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border-2 border-dashed border-[#B3121B]/40 dark:border-[#B3121B]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#B3121B] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      1. Lead Headline Story (મુખ્ય ટોચનો અહેવાલ) *
                    </span>
                    {activePageData.leadArticle && (
                      <button
                        type="button"
                        onClick={() => removeArticleFromSlot('lead')}
                        className="text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {activePageData.leadArticle ? (
                    <div className="p-3 bg-red-50/40 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/40 flex gap-3 items-center">
                      {activePageData.leadArticle.featuredImage && (
                        <img
                          src={activePageData.leadArticle.featuredImage}
                          alt="Lead"
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#B3121B] text-white">
                          {activePageData.leadArticle.category?.nameGu || activePageData.leadArticle.category?.name || 'મુખ્ય'}
                        </span>
                        <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate mt-1">
                          {activePageData.leadArticle.titleGu || activePageData.leadArticle.title}
                        </h4>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                          {activePageData.leadArticle.location || displayCity} • {activePageData.leadArticle.excerpt || 'Article assigned'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-zinc-400 italic py-2 text-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl">
                      Select an article from the right column to set as Lead Headline Story.
                    </p>
                  )}
                </div>

                {/* ── 2. SECOND STORY SLOT ── */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300">
                      2. Second Big Story (દ્વિતીય અહેવાલ)
                    </span>
                    {activePageData.secondArticle && (
                      <button
                        type="button"
                        onClick={() => removeArticleFromSlot('second')}
                        className="text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {activePageData.secondArticle ? (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex gap-3 items-center">
                      {activePageData.secondArticle.featuredImage && (
                        <img
                          src={activePageData.secondArticle.featuredImage}
                          alt="Second"
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800 text-white">
                          {activePageData.secondArticle.category?.nameGu || activePageData.secondArticle.category?.name || 'સમાચાર'}
                        </span>
                        <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate mt-1">
                          {activePageData.secondArticle.titleGu || activePageData.secondArticle.title}
                        </h4>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-zinc-400 italic py-2 text-center bg-zinc-50 dark:bg-zinc-950/50 rounded-xl">
                      Optional: Select an article from the list to set as Second Story.
                    </p>
                  )}
                </div>

                {/* ── 3. SIDE COLUMN STORIES (Up to 3) ── */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300">
                      3. Side Column Stories ({activePageData.sideArticles?.length || 0}/3)
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(activePageData.sideArticles || []).map((art, idx) => (
                      <div key={art.id || idx} className="p-2.5 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                            {art.titleGu || art.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeArticleFromSlot('side', idx)}
                          className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {(activePageData.sideArticles?.length || 0) < 3 && (
                      <p className="text-[11px] font-bold text-zinc-400 text-center py-1">
                        + Select articles from right to fill remaining side slots
                      </p>
                    )}
                  </div>
                </div>

                {/* ── 4. BOTTOM GRID STORIES (Up to 3) ── */}
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-zinc-700 dark:text-zinc-300">
                      4. Bottom Grid Stories ({activePageData.bottomArticles?.length || 0}/3)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {(activePageData.bottomArticles || []).map((bArt, bIdx) => (
                      <div key={bArt.id || bIdx} className="p-2.5 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-1 relative group">
                        <span className="text-[8px] font-black bg-zinc-800 text-white px-1.5 py-0.5 rounded uppercase">
                          {bArt.category?.nameGu || 'ઝડપી'}
                        </span>
                        <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 line-clamp-2">
                          {bArt.titleGu || bArt.title}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeArticleFromSlot('bottom', bIdx)}
                          className="absolute top-1 right-1 text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: ARTICLE PICKER / SELECTOR (5 Cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3 sticky top-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Newspaper className="h-4 w-4 text-[#B3121B]" />
                    Published Website Articles ({filteredArticles.length})
                  </h4>

                  <button
                    onClick={fetchArticles}
                    disabled={loadingArticles}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
                    title="Refresh Articles"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingArticles ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="Search articles by title..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold"
                  />
                </div>

                {/* Articles List */}
                <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                  {loadingArticles ? (
                    <div className="text-center py-12">
                      <Loader2 className="h-6 w-6 text-[#B3121B] animate-spin mx-auto" />
                      <p className="text-xs font-bold text-zinc-500 mt-2">Loading website articles...</p>
                    </div>
                  ) : filteredArticles.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-8">No articles found.</p>
                  ) : (
                    filteredArticles.map((art) => (
                      <div
                        key={art.id}
                        className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 hover:border-[#B3121B]/40 transition flex items-start gap-2.5 group"
                      >
                        {art.featuredImage ? (
                          <img
                            src={art.featuredImage}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                            <Newspaper className="h-5 w-5 text-zinc-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8.5px] font-black uppercase text-[#B3121B]">
                              {art.category?.nameGu || art.category?.name || 'સમાચાર'}
                            </span>
                            <span className="text-[8.5px] text-zinc-400">• {art.location || displayCity}</span>
                          </div>

                          <h5 className="text-xs font-black text-zinc-900 dark:text-white line-clamp-2 leading-snug mt-0.5">
                            {art.titleGu || art.title}
                          </h5>

                          {/* Quick Assign Buttons */}
                          <div className="flex flex-wrap items-center gap-1 mt-2">
                            <button
                              type="button"
                              onClick={() => assignArticleToSlot('lead', art)}
                              className="px-2 py-0.5 rounded bg-[#B3121B] text-white text-[9px] font-black hover:bg-[#8e0e15] cursor-pointer"
                            >
                              Set as Lead
                            </button>
                            <button
                              type="button"
                              onClick={() => assignArticleToSlot('second', art)}
                              className="px-2 py-0.5 rounded bg-zinc-800 text-white text-[9px] font-black hover:bg-zinc-900 cursor-pointer"
                            >
                              Set Second
                            </button>
                            <button
                              type="button"
                              onClick={() => assignArticleToSlot('side', art)}
                              className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[9px] font-bold hover:bg-zinc-300 cursor-pointer"
                            >
                              + Side
                            </button>
                            <button
                              type="button"
                              onClick={() => assignArticleToSlot('bottom', art)}
                              className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[9px] font-bold hover:bg-zinc-300 cursor-pointer"
                            >
                              + Bottom
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* ─── LIVE BROADSHEET PREVIEW TAB ─── */
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <button
                  disabled={activePageIndex <= 0}
                  onClick={() => setActivePageIndex((p) => p - 1)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-bold hover:bg-zinc-200 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-xs font-black">
                  Page {activePageIndex + 1} of {totalPages}
                </span>
                <button
                  disabled={activePageIndex >= totalPages - 1}
                  onClick={() => setActivePageIndex((p) => p + 1)}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-bold hover:bg-zinc-200 disabled:opacity-40 cursor-pointer"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Single Page Interactive Live Preview */}
              <div className="max-w-full overflow-auto p-4 bg-slate-900 rounded-3xl shadow-2xl">
                <EPaperBroadsheetPage data={activePageData} scale={1} />
              </div>
            </div>
          )}
        </div>

        {/* ─── MODAL FOOTER WITH GENERATE PROGRESS & PUBLISH BUTTON ─── */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          {/* Progress Message */}
          <div>
            {isGenerating && generationProgress ? (
              <div className="flex items-center gap-2.5 text-xs font-black text-[#B3121B]">
                <Loader2 className="h-4 w-4 animate-spin text-[#B3121B]" />
                <span>{generationProgress.message}</span>
              </div>
            ) : (
              <p className="text-xs font-semibold text-zinc-500">
                Ready to compile <strong>{totalPages} newspaper pages</strong> for <strong>{cityGu || city}</strong> ({date}).
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-black text-zinc-500 hover:bg-zinc-50 cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGenerateAndPublish}
              disabled={isGenerating || loadingArticles}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B3121B] text-white text-xs font-black hover:bg-[#8e0e15] disabled:opacity-60 transition cursor-pointer shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate PDF & Publish Edition (PDF બનાવો અને પબ્લિશ કરો)
                </>
              )}
            </button>
          </div>
        </div>

        {/* ─── HIDDEN RENDER CONTAINER FOR MULTI-PAGE PDF GENERATION ─── */}
        <div
          ref={renderContainerRef}
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '794px',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          {pagesData.map((pData, idx) => (
            <div key={idx} className="broadsheet-render-page mb-8">
              <EPaperBroadsheetPage data={pData} scale={1} isPrintPreview={true} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default EPaperArticleGeneratorModal;
