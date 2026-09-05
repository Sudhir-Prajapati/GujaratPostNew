'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Zap,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MousePointerClick,
  Info,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  Lock,
  Unlock,
  Edit3,
} from 'lucide-react';
import { getBackendApiUrl, authFetch } from '@/lib/api';
import { CityItem, createEPaperEdition, getTodayDateStr } from '@/lib/epaper';
import { EPaperBroadsheetPage } from './EPaperBroadsheetPage';
import { BroadsheetArticle, EPaperPageData } from './types';
import { generateEPaperPdfFromElements, GeneratePdfProgress } from '@/lib/pdfGenerator';
import {
  PAGE_SECTIONS_CONFIG,
  PageSectionConfig,
  autoArrangeEdition,
  validateEdition,
  ValidationReport,
  resolvePrimarySection,
} from '@/lib/epaperScoring';

interface EPaperArticleGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  citiesList: CityItem[];
  defaultCity?: string;
  defaultDate?: string;
  onEditionCreated: () => void;
}

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
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  // Configurable 14-Page Enabled State
  const [pageConfigs, setPageConfigs] = useState<PageSectionConfig[]>(PAGE_SECTIONS_CONFIG);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'composer' | 'preview'>('composer');
  const [previewZoom, setPreviewZoom] = useState<number>(1);

  // Available Articles from Database
  const [availableArticles, setAvailableArticles] = useState<BroadsheetArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articleSearch, setArticleSearch] = useState('');
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('ALL');

  // Pages Configuration State
  const [pagesData, setPagesData] = useState<EPaperPageData[]>([]);

  // Interactive Target Slot Assignment Mode
  const [targetedSlot, setTargetedSlot] = useState<{
    slot: string;
    indexInSlot?: number;
    label: string;
  } | null>(null);

  // Validation Report State
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);

  // Quick Inline Text Edit Mode
  const [editingArticle, setEditingArticle] = useState<{
    slot: string;
    indexInSlot?: number;
    article: BroadsheetArticle;
  } | null>(null);

  // Generation & Publishing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GeneratePdfProgress | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Ref for hidden render container
  const renderContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Enabled pages list
  const enabledPageConfigs = useMemo(() => {
    return pageConfigs.filter((p) => p.defaultEnabled);
  }, [pageConfigs]);

  // Toggle page enable/disable
  const togglePageEnabled = (pageNumber: number) => {
    if (pageNumber === 1) {
      showToast('info', 'Front page cannot be disabled.');
      return;
    }

    setPageConfigs((prev) =>
      prev.map((p) => (p.pageNumber === pageNumber ? { ...p, defaultEnabled: !p.defaultEnabled } : p))
    );

    // Re-initialize pages while preserving locked ones
    setTimeout(() => {
      handleRunSmartAutoArrange();
    }, 50);
  };

  // Toggle page lock / unlock
  const togglePageLock = (pageNumber: number) => {
    setPagesData((prev) =>
      prev.map((p) => {
        if (p.pageNumber === pageNumber) {
          const newLocked = !p.isLocked;
          showToast('info', `Page ${pageNumber} ${newLocked ? '🔒 Locked (Auto-Arrange will skip)' : '🔓 Unlocked'}`);
          return { ...p, isLocked: newLocked };
        }
        return p;
      })
    );
  };

  // Fetch Published Website Articles
  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const res = await authFetch(getBackendApiUrl('/api/admin/epaper/articles?limit=150'));
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

  // Run Smart Auto-Arrange Engine (Respects isLocked on pages)
  const handleRunSmartAutoArrange = (articlesToUse: BroadsheetArticle[] = availableArticles) => {
    if (!articlesToUse || articlesToUse.length === 0) {
      showToast('error', 'No articles available to arrange.');
      return;
    }

    const arrangedPages = autoArrangeEdition(
      articlesToUse,
      enabledPageConfigs,
      city,
      cityGu,
      date,
      pagesData // Passes existing state so locked pages are preserved
    );

    setPagesData(arrangedPages);
    setTargetedSlot(null);
    const report = validateEdition(arrangedPages, city);
    setValidationReport(report);

    const lockedCount = arrangedPages.filter((p) => p.isLocked).length;
    showToast(
      'success',
      `⚡ Smart Allocation complete across ${arrangedPages.length} pages ${lockedCount > 0 ? `(${lockedCount} locked skipped)` : ''} (Readiness: ${report.score}/100)!`
    );
  };

  // On Modal Open
  useEffect(() => {
    if (isOpen) {
      fetchArticles().then((items) => {
        if (items.length > 0) {
          handleRunSmartAutoArrange(items);
        }
      });
    }
  }, [isOpen]);

  // Sync city name
  const handleCitySelect = (cityName: string) => {
    const found = citiesList.find((c) => c.city === cityName);
    const targetCity = found ? found.city : cityName;
    const targetCityGu = found ? found.cityGu || found.city : cityName;
    setCity(targetCity);
    setCityGu(targetCityGu);
    setTitle(`${cityName.toUpperCase()} EDITION`);

    // Re-run auto arrange with new city location weights
    if (availableArticles.length > 0) {
      const arrangedPages = autoArrangeEdition(
        availableArticles,
        enabledPageConfigs,
        targetCity,
        targetCityGu,
        date,
        pagesData
      );
      setPagesData(arrangedPages);
    }
  };

  // Assign article to slot
  const assignArticleToSlot = (
    slot: string,
    article: BroadsheetArticle,
    indexInSlot?: number
  ) => {
    setPagesData((prev) => {
      const copy = [...prev];
      const page = { ...copy[activePageIndex] };

      if (slot === 'lead') page.leadArticle = article;
      else if (slot === 'second') page.secondArticle = article;
      else if (slot === 'third') page.thirdArticle = article;
      else if (slot === 'fourth') page.fourthArticle = article;
      else if (slot === 'fifth') page.fifthArticle = article;
      else if (slot === 'sixth') page.sixthArticle = article;
      else if (slot === 'seventh') page.seventhArticle = article;
      else if (slot === 'eighth') page.eighthArticle = article;
      else if (slot === 'ninth') page.ninthArticle = article;
      else if (slot === 'tenth') page.tenthArticle = article;
      else if (slot === 'eleventh') page.eleventhArticle = article;
      else if (slot === 'grid') {
        const grids = [...(page.gridArticles || [])];
        if (indexInSlot !== undefined && indexInSlot < grids.length) grids[indexInSlot] = article;
        else grids.push(article);
        page.gridArticles = grids;
      } else if (slot === 'side') {
        const sides = [...(page.sideArticles || [])];
        if (indexInSlot !== undefined && indexInSlot < sides.length) sides[indexInSlot] = article;
        else sides.push(article);
        page.sideArticles = sides;
      } else if (slot === 'bottom') {
        const bottoms = [...(page.bottomArticles || [])];
        if (indexInSlot !== undefined && indexInSlot < bottoms.length) bottoms[indexInSlot] = article;
        else bottoms.push(article);
        page.bottomArticles = bottoms;
      }

      copy[activePageIndex] = page;
      return copy;
    });

    setTargetedSlot(null);
    showToast('success', `Assigned "${(article.titleGu || article.title).slice(0, 25)}..." to ${slot.toUpperCase()} slot!`);
  };

  // Remove article from slot
  const removeArticleFromSlot = (slot: string, indexInSlot?: number) => {
    setPagesData((prev) => {
      const copy = [...prev];
      const page = { ...copy[activePageIndex] };

      if (slot === 'lead') page.leadArticle = null;
      else if (slot === 'second') page.secondArticle = null;
      else if (slot === 'third') page.thirdArticle = null;
      else if (slot === 'fourth') page.fourthArticle = null;
      else if (slot === 'fifth') page.fifthArticle = null;
      else if (slot === 'sixth') page.sixthArticle = null;
      else if (slot === 'seventh') page.seventhArticle = null;
      else if (slot === 'eighth') page.eighthArticle = null;
      else if (slot === 'grid' && indexInSlot !== undefined) {
        page.gridArticles = (page.gridArticles || []).filter((_, idx) => idx !== indexInSlot);
      } else if (slot === 'side' && indexInSlot !== undefined) {
        page.sideArticles = (page.sideArticles || []).filter((_, idx) => idx !== indexInSlot);
      } else if (slot === 'bottom' && indexInSlot !== undefined) {
        page.bottomArticles = (page.bottomArticles || []).filter((_, idx) => idx !== indexInSlot);
      }

      copy[activePageIndex] = page;
      return copy;
    });
  };

  // Save quick text edits (printHeadline, printSummary) on placed article
  const handleSaveArticleEdit = (headline: string, summary: string) => {
    if (!editingArticle) return;
    const { slot, indexInSlot, article } = editingArticle;
    const updatedArticle = {
      ...article,
      printHeadline: headline.trim(),
      printSummary: summary.trim(),
    };

    setPagesData((prev) => {
      const copy = [...prev];
      const page = { ...copy[activePageIndex] };

      if (slot === 'lead') page.leadArticle = updatedArticle;
      else if (slot === 'second') page.secondArticle = updatedArticle;
      else if (slot === 'third') page.thirdArticle = updatedArticle;
      else if (slot === 'fourth') page.fourthArticle = updatedArticle;
      else if (slot === 'fifth') page.fifthArticle = updatedArticle;
      else if (slot === 'sixth') page.sixthArticle = updatedArticle;
      else if (slot === 'seventh') page.seventhArticle = updatedArticle;
      else if (slot === 'grid' && indexInSlot !== undefined && page.gridArticles) page.gridArticles[indexInSlot] = updatedArticle;
      else if (slot === 'side' && indexInSlot !== undefined && page.sideArticles) page.sideArticles[indexInSlot] = updatedArticle;
      else if (slot === 'bottom' && indexInSlot !== undefined && page.bottomArticles) page.bottomArticles[indexInSlot] = updatedArticle;

      copy[activePageIndex] = page;
      return copy;
    });

    setEditingArticle(null);
    showToast('success', 'Print headline & summary updated on page.');
  };

  // Find where any article is assigned
  const getArticleAssignment = (articleId: string) => {
    for (let pIdx = 0; pIdx < pagesData.length; pIdx++) {
      const p = pagesData[pIdx];
      if (p.leadArticle?.id === articleId) return { pageNumber: p.pageNumber, slotName: 'Lead 👑' };
      if (p.secondArticle?.id === articleId) return { pageNumber: p.pageNumber, slotName: '2nd 📰' };
      if (p.thirdArticle?.id === articleId) return { pageNumber: p.pageNumber, slotName: '3rd 📰' };
      if (p.fourthArticle?.id === articleId) return { pageNumber: p.pageNumber, slotName: '4th 📑' };
      if (p.fifthArticle?.id === articleId) return { pageNumber: p.pageNumber, slotName: '5th 📑' };
      const gridIdx = (p.gridArticles || []).findIndex((a) => a.id === articleId);
      if (gridIdx !== -1) return { pageNumber: p.pageNumber, slotName: `Grid #${gridIdx + 1}` };
      const sideIdx = (p.sideArticles || []).findIndex((a) => a.id === articleId);
      if (sideIdx !== -1) return { pageNumber: p.pageNumber, slotName: `Side #${sideIdx + 1}` };
    }
    return null;
  };

  // Active page data
  const activePageData: EPaperPageData = pagesData[activePageIndex] || {
    pageNumber: activePageIndex + 1,
    totalPages: enabledPageConfigs.length,
    city,
    cityGu,
    date,
    pageTitle: enabledPageConfigs[activePageIndex]?.titleGu || `પાનું ${activePageIndex + 1}`,
    templateId: enabledPageConfigs[activePageIndex]?.defaultTemplateId || 'FrontPageTemplate',
    isLocked: false,
    leadArticle: null,
    secondArticle: null,
    thirdArticle: null,
    fourthArticle: null,
    fifthArticle: null,
    gridArticles: [],
    sideArticles: [],
    bottomArticles: [],
  };

  // Filtered available articles
  const filteredArticles = availableArticles.filter((art) => {
    if (articleSearch) {
      const q = articleSearch.toLowerCase();
      const match =
        art.title?.toLowerCase().includes(q) ||
        art.titleGu?.toLowerCase().includes(q) ||
        art.category?.name?.toLowerCase().includes(q) ||
        art.location?.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (activeSectionFilter === 'UNUSED') {
      return getArticleAssignment(art.id) === null;
    } else if (activeSectionFilter !== 'ALL') {
      const section = resolvePrimarySection(art);
      if (section !== activeSectionFilter) return false;
    }

    return true;
  });

  // ─── GENERATE PDF & PUBLISH EDITION ───
  const handleGenerateAndPublish = async () => {
    const report = validateEdition(pagesData, city);
    setValidationReport(report);

    if (!report.isReady) {
      setShowValidationModal(true);
      return;
    }

    if (!renderContainerRef.current) {
      showToast('error', 'Render container not ready.');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress({
      currentPage: 1,
      totalPages: pagesData.length,
      stage: 'rendering',
      message: 'Compiling high-resolution Section Broadsheets...',
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

      // 2. Upload PDF file to Server
      setGenerationProgress({
        currentPage: pagesData.length,
        totalPages: pagesData.length,
        stage: 'compiling',
        message: 'Uploading generated PDF to server...',
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

      // Upload First Page Thumbnail
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

      // 3. Save Edition + Pages to Database
      setGenerationProgress({
        currentPage: pagesData.length,
        totalPages: pagesData.length,
        stage: 'completed',
        message: 'Saving edition in database...',
      });

      const editionPayload = {
        title: title.trim() || `${city.toUpperCase()} EDITION`,
        city: city.trim(),
        cityGu: cityGu.trim() || city.trim(),
        date,
        pages: pagesData.length,
        fileUrl: remotePdfUrl,
        thumbnailUrl: remoteThumbUrl || undefined,
        status,
        publishTime: '06:00 AM',
        isActive: true,
        pagesData: pagesData.map((p) => ({
          pageNumber: p.pageNumber,
          sectionKey: p.sectionKey || 'general',
          templateId: p.templateId || 'FrontPageTemplate',
          enabled: p.enabled !== false,
          isLocked: !!p.isLocked,
          pageTitle: p.pageTitle,
          layoutData: {
            leadId: p.leadArticle?.id,
            secondId: p.secondArticle?.id,
            thirdId: p.thirdArticle?.id,
            fourthId: p.fourthArticle?.id,
          },
        })),
      };

      const createRes = await createEPaperEdition(editionPayload);

      if (createRes?.edition) {
        showToast('success', `🎉 "${editionPayload.title}" (${pagesData.length} Section Pages) published successfully!`);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="relative flex h-full max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed top-5 right-5 z-[99999] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-white text-xs font-black animate-in slide-in-from-right duration-200 ${
              toastMessage.type === 'success' ? 'bg-emerald-600' : toastMessage.type === 'info' ? 'bg-blue-600' : 'bg-red-600'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Pre-Flight Validation Modal */}
        {showValidationModal && validationReport && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${validationReport.isReady ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">Pre-Flight Edition Validation</h3>
                    <p className="text-xs font-bold text-zinc-500">Readiness Score: <span className="font-black text-emerald-600">{validationReport.score}/100</span></p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowValidationModal(false)} className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              {validationReport.issues.length > 0 && (
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-1.5">
                  <h4 className="text-xs font-black text-red-700 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Required Issues to Fix ({validationReport.issues.length}):
                  </h4>
                  <ul className="text-[11px] font-semibold text-red-600 space-y-1 list-disc pl-4">
                    {validationReport.issues.map((iss, idx) => (
                      <li key={idx}>{iss}</li>
                    ))}
                  </ul>
                </div>
              )}

              {validationReport.warnings.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1.5">
                  <h4 className="text-xs font-black text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> Editorial Suggestions ({validationReport.warnings.length}):
                  </h4>
                  <ul className="text-[11px] font-semibold text-amber-600 space-y-1 list-disc pl-4">
                    {validationReport.warnings.map((warn, idx) => (
                      <li key={idx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowValidationModal(false)} className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold hover:bg-zinc-200 cursor-pointer">Back to Composer</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowValidationModal(false);
                    handleGenerateAndPublish();
                  }}
                  className="px-5 py-2 rounded-xl bg-[#B3121B] text-white text-xs font-black hover:bg-red-700 cursor-pointer shadow-md"
                >
                  Proceed with Publishing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Inline Headline / Summary Edit Modal */}
        {editingArticle && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Edit3 className="h-4 w-4 text-[#B3121B]" /> Edit Broadsheet Print Copy
                </h3>
                <button type="button" onClick={() => setEditingArticle(null)} className="p-1 rounded-lg hover:bg-zinc-100"><X className="h-4 w-4" /></button>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Print Headline (Bold 2-Line Title)</label>
                <input
                  type="text"
                  defaultValue={editingArticle.article.printHeadline || editingArticle.article.titleGu || editingArticle.article.title}
                  id="modal-edit-headline"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">Print News Summary (3-5 Line Justified)</label>
                <textarea
                  rows={4}
                  defaultValue={editingArticle.article.printSummary || editingArticle.article.contentGu || editingArticle.article.content}
                  id="modal-edit-summary"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-1.5 rounded-xl bg-zinc-100 text-xs font-bold">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    const h = (document.getElementById('modal-edit-headline') as HTMLInputElement)?.value || '';
                    const s = (document.getElementById('modal-edit-summary') as HTMLTextAreaElement)?.value || '';
                    handleSaveArticleEdit(h, s);
                  }}
                  className="px-5 py-1.5 rounded-xl bg-[#B3121B] text-white text-xs font-black"
                >
                  Save to Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── 1. MODAL HEADER ─── */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-5 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#B3121B] to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-900/20">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#B3121B]/10 text-[#B3121B] dark:bg-red-950/40 dark:text-red-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-[#B3121B]/20">
                  Section-Based 14-Page Broadsheet Engine
                </span>
                <span className="text-[10px] text-zinc-400 font-bold hidden md:inline">
                  • {enabledPageConfigs.length} Active Pages Configured
                </span>
              </div>
              <h2 className="text-base font-black text-zinc-900 dark:text-white leading-tight flex items-center gap-2 mt-0.5">
                <span>Dynamic E-Paper Composer</span>
                <span className="text-xs font-bold text-zinc-500 font-sans hidden sm:inline">(ઓટો સેક્શન ઈ-પેપર)</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => handleRunSmartAutoArrange()}
              disabled={isGenerating || loadingArticles || availableArticles.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-black text-xs transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
              title="Auto-match articles by primary section, location, and priority"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span className="hidden sm:inline">1-Click Smart Auto-Fill</span>
              <span className="sm:hidden">Auto Fill</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const report = validateEdition(pagesData, city);
                setValidationReport(report);
                setShowValidationModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-black hover:bg-zinc-200 cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Validate</span>
            </button>

            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setViewMode('composer')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  viewMode === 'composer' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Composer</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                  viewMode === 'preview' ? 'bg-[#B3121B] text-white shadow-sm' : 'text-zinc-500'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="h-8 w-8 flex items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ─── 2. EDITION SETTINGS CONFIGURATION BAR ─── */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <MapPin className="h-3.5 w-3.5 text-[#B3121B]" />
              <span className="text-[11px] font-bold text-zinc-500">Edition:</span>
              <select
                value={city}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="bg-transparent text-xs font-black text-zinc-900 dark:text-white cursor-pointer focus:outline-none"
              >
                {citiesList.map((c) => (
                  <option key={c.id} value={c.city} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                    {c.cityGu || c.city} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <CalendarDays className="h-3.5 w-3.5 text-[#B3121B]" />
              <span className="text-[11px] font-bold text-zinc-500">Date:</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-xs font-black text-zinc-900 dark:text-white cursor-pointer focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <span className="text-[11px] font-bold text-zinc-500">Status:</span>
              <button
                type="button"
                onClick={() => setStatus(status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase transition cursor-pointer ${
                  status === 'PUBLISHED' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-amber-500 text-zinc-950 font-black shadow-sm'
                }`}
              >
                {status}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-[11px] font-bold text-zinc-500">Banner Title:</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-xs font-black text-zinc-900 dark:text-white w-44 sm:w-56 focus:outline-none"
              placeholder="e.g. AHMEDABAD EDITION"
            />
          </div>
        </div>

        {/* ─── 3. MAIN 3-COLUMN WORKSPACE: COMPOSER VS PREVIEW ─── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-zinc-50/50 dark:bg-zinc-950/50">
          {viewMode === 'composer' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              
              {/* ─── COLUMN 1: CONFIGURABLE 14-PAGE NAVIGATION (3 COLS) ─── */}
              <div className="lg:col-span-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2 sticky top-4">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-[#B3121B]" /> Section Pages ({enabledPageConfigs.length}/14)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setPageConfigs((prev) => prev.map((p) => ({ ...p, defaultEnabled: true })));
                      setTimeout(() => handleRunSmartAutoArrange(), 50);
                    }}
                    className="text-[10px] font-bold text-[#B3121B] hover:underline cursor-pointer"
                  >
                    Enable All
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
                  {pageConfigs.map((pageCfg) => {
                    const isSelected = enabledPageConfigs[activePageIndex]?.pageNumber === pageCfg.pageNumber;
                    const pageData = pagesData.find((p) => p.pageNumber === pageCfg.pageNumber);
                    const hasLead = !!pageData?.leadArticle;
                    const isLocked = !!pageData?.isLocked;

                    return (
                      <div
                        key={pageCfg.pageNumber}
                        className={`p-2 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#B3121B] text-white border-red-600 shadow-sm'
                            : pageCfg.defaultEnabled
                            ? 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                            : 'bg-zinc-100/60 dark:bg-zinc-900/30 opacity-50 border-dashed border-zinc-300'
                        }`}
                        onClick={() => {
                          if (pageCfg.defaultEnabled) {
                            const idx = enabledPageConfigs.findIndex((p) => p.pageNumber === pageCfg.pageNumber);
                            if (idx !== -1) setActivePageIndex(idx);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePageEnabled(pageCfg.pageNumber);
                            }}
                            className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
                          >
                            {pageCfg.defaultEnabled ? (
                              <CheckSquare className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                            ) : (
                              <Square className="h-4 w-4 text-zinc-400" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase">P{pageCfg.pageNumber}</span>
                              <span className="text-xs font-black truncate">{pageCfg.titleGu}</span>
                            </div>
                            <span className="text-[9px] opacity-80 block truncate font-sans">{pageCfg.titleEn}</span>
                          </div>
                        </div>

                        {pageCfg.defaultEnabled && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePageLock(pageCfg.pageNumber);
                              }}
                              className={`p-1 rounded-md transition ${isLocked ? 'bg-amber-100 text-amber-900 font-black' : 'text-zinc-400 hover:text-zinc-700'}`}
                              title={isLocked ? 'Page is Locked (Auto-Arrange will not touch)' : 'Click to Lock Page'}
                            >
                              {isLocked ? <Lock className="h-3.5 w-3.5 text-amber-700" /> : <Unlock className="h-3.5 w-3.5" />}
                            </button>
                            <span
                              className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                                hasLead ? (isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800') : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {hasLead ? 'Lead ✓' : 'No Lead'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─── COLUMN 2: ACTIVE PAGE SLOTS COMPOSER (5 COLS) ─── */}
              <div className="lg:col-span-5 space-y-3">
                {/* Active Page Header Card */}
                <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#B3121B]/10 text-[#B3121B]">
                        Page {activePageData.pageNumber} of {enabledPageConfigs.length}
                      </span>
                      <span className="text-xs font-bold text-zinc-500">
                        ({enabledPageConfigs[activePageIndex]?.titleEn || 'Section'})
                      </span>
                      {activePageData.isLocked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.2 rounded-md">
                          <Lock className="h-3 w-3" /> LOCKED
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-zinc-900 dark:text-white mt-0.5">
                      {activePageData.pageTitle || 'સેક્શન સમાચાર'}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => togglePageLock(activePageData.pageNumber)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black cursor-pointer border ${
                        activePageData.isLocked ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {activePageData.isLocked ? <><Lock className="h-3.5 w-3.5" /><span>Locked</span></> : <><Unlock className="h-3.5 w-3.5" /><span>Lock</span></>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#B3121B] text-white text-xs font-black cursor-pointer shadow-sm"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                {/* 1. Lead Headline Slot */}
                <div
                  className={`bg-white dark:bg-zinc-900 p-3 rounded-2xl border-2 transition-all space-y-1.5 shadow-sm ${
                    targetedSlot?.slot === 'lead' ? 'border-red-500 ring-4 ring-red-500/20 bg-red-50/20' : activePageData.leadArticle ? 'border-red-200' : 'border-dashed border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-[#B3121B]">👑 1. Lead Headline Story (મુખ્ય ટોચનો અહેવાલ - ફોટો સાથે) *</span>
                    {activePageData.leadArticle && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingArticle({ slot: 'lead', article: activePageData.leadArticle! })}
                          className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                        >
                          <Edit3 className="h-3 w-3" /> Edit Text
                        </button>
                        <button type="button" onClick={() => removeArticleFromSlot('lead')} className="text-[10px] font-black text-red-600 hover:underline cursor-pointer">Remove</button>
                      </div>
                    )}
                  </div>

                  {activePageData.leadArticle ? (
                    <div className="p-2 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200 flex gap-2.5 items-center">
                      {activePageData.leadArticle.featuredImage && (
                        <img src={activePageData.leadArticle.featuredImage} alt="" className="w-14 h-12 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded bg-[#B3121B] text-white">
                          {activePageData.leadArticle.category?.nameGu || 'મુખ્ય'}
                        </span>
                        <h4 className="text-xs font-black text-zinc-900 dark:text-white truncate mt-0.5">
                          {activePageData.leadArticle.printHeadline || activePageData.leadArticle.titleGu || activePageData.leadArticle.title}
                        </h4>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => setTargetedSlot({ slot: 'lead', label: 'Lead Story' })} className="p-2.5 text-center bg-zinc-50 border border-dashed rounded-xl cursor-pointer">
                      <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">+ Click to choose Lead Headline Story</p>
                    </div>
                  )}
                </div>

                {/* 2. Secondary Stories Slots */}
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 space-y-2">
                  <span className="text-xs font-black uppercase text-blue-700">📰 2-3. Secondary Stories (2 Slots with Photos)</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { slot: 'second', art: activePageData.secondArticle, num: 2 },
                      { slot: 'third', art: activePageData.thirdArticle, num: 3 },
                    ].map(({ slot, art, num }) =>
                      art ? (
                        <div key={slot} className="p-2 bg-blue-50/50 rounded-xl border border-blue-200 relative">
                          <p className="text-[10px] font-bold text-zinc-900 truncate">#{num}: {art.printHeadline || art.titleGu || art.title}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <button
                              type="button"
                              onClick={() => setEditingArticle({ slot, article: art })}
                              className="text-[9px] text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <Edit3 className="h-2.5 w-2.5" /> Edit
                            </button>
                            <button type="button" onClick={() => removeArticleFromSlot(slot)} className="text-[9px] text-red-500 hover:underline">Remove</button>
                          </div>
                        </div>
                      ) : (
                        <div key={slot} onClick={() => setTargetedSlot({ slot, label: `Secondary #${num}` })} className="p-2 text-center bg-zinc-50 border border-dashed rounded-xl cursor-pointer text-xs text-zinc-500">
                          + Secondary #{num}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* 3. Standard Stories */}
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 space-y-2">
                  <span className="text-xs font-black uppercase text-amber-700">📑 4-7. Standard Editorial Stories</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { slot: 'fourth', art: activePageData.fourthArticle, num: 4 },
                      { slot: 'fifth', art: activePageData.fifthArticle, num: 5 },
                      { slot: 'sixth', art: activePageData.sixthArticle, num: 6 },
                      { slot: 'seventh', art: activePageData.seventhArticle, num: 7 },
                    ].map(({ slot, art, num }) =>
                      art ? (
                        <div key={slot} className="p-1.5 bg-amber-50/40 rounded-lg border border-amber-200 relative">
                          <p className="text-[9.5px] font-bold text-zinc-900 truncate">#{num}: {art.printHeadline || art.titleGu || art.title}</p>
                          <button type="button" onClick={() => removeArticleFromSlot(slot)} className="absolute top-0.5 right-0.5 text-zinc-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                        </div>
                      ) : (
                        <div key={slot} onClick={() => setTargetedSlot({ slot, label: `Story #${num}` })} className="p-1.5 text-center bg-zinc-50 border border-dashed rounded-lg cursor-pointer text-[9.5px] text-zinc-500">
                          + Story #{num}
                        </div>
                      )
                    )}
                  </div>
                </div>

              </div>

              {/* ─── COLUMN 3: FILTERABLE ARTICLES DRAWER (4 COLS) ─── */}
              <div className="lg:col-span-4 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2.5 sticky top-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Newspaper className="h-4 w-4 text-[#B3121B]" /> Articles ({filteredArticles.length})
                  </h4>
                  <button type="button" onClick={fetchArticles} disabled={loadingArticles} className="p-1.5 rounded-xl bg-zinc-100 text-zinc-600 cursor-pointer">
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingArticles ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {targetedSlot && (
                  <div className="p-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between gap-2 shadow-md">
                    <div className="flex items-center gap-1.5 text-xs font-black truncate">
                      <MousePointerClick className="h-4 w-4 shrink-0 animate-bounce" />
                      <span>Targeting: {targetedSlot.label}</span>
                    </div>
                    <button type="button" onClick={() => setTargetedSlot(null)} className="px-2 py-0.5 rounded-lg bg-white/20 text-[10px] font-black cursor-pointer">Cancel</button>
                  </div>
                )}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold"
                  />
                </div>

                {/* Section Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[9.5px]">
                  <button type="button" onClick={() => setActiveSectionFilter('ALL')} className={`px-2 py-0.5 rounded-lg font-black shrink-0 ${activeSectionFilter === 'ALL' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}>All ({availableArticles.length})</button>
                  <button type="button" onClick={() => setActiveSectionFilter('UNUSED')} className={`px-2 py-0.5 rounded-lg font-black shrink-0 ${activeSectionFilter === 'UNUSED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>Unused</button>
                  {PAGE_SECTIONS_CONFIG.map((s) => (
                    <button key={s.sectionKey} type="button" onClick={() => setActiveSectionFilter(s.sectionKey)} className={`px-2 py-0.5 rounded-lg font-bold shrink-0 ${activeSectionFilter === s.sectionKey ? 'bg-[#B3121B] text-white' : 'bg-zinc-100 text-zinc-600'}`}>{s.titleGu}</button>
                  ))}
                </div>

                {/* Articles List */}
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
                  {loadingArticles ? (
                    <div className="text-center py-16"><Loader2 className="h-6 w-6 text-[#B3121B] animate-spin mx-auto" /></div>
                  ) : filteredArticles.length === 0 ? (
                    <p className="text-xs text-zinc-400 text-center py-8">No matching articles found.</p>
                  ) : (
                    filteredArticles.map((art) => {
                      const assignment = getArticleAssignment(art.id);
                      return (
                        <div key={art.id} className="p-2 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-1">
                          <div className="flex items-start gap-2">
                            {art.featuredImage ? <img src={art.featuredImage} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" /> : <div className="w-11 h-11 rounded-lg bg-zinc-200 flex items-center justify-center shrink-0"><Newspaper className="h-3.5 w-3.5 text-zinc-400" /></div>}
                            <div className="flex-1 min-w-0">
                              <span className="text-[7.5px] font-black uppercase text-[#B3121B]">{art.category?.nameGu || 'સમાચાર'}</span>
                              <h5 className="text-[11px] font-black text-zinc-900 dark:text-white truncate">{art.titleGu || art.title}</h5>
                              {assignment && <span className="inline-block bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.2 rounded mt-0.5">P{assignment.pageNumber}: {assignment.slotName}</span>}
                            </div>
                          </div>

                          {targetedSlot ? (
                            <button
                              type="button"
                              onClick={() => targetedSlot && assignArticleToSlot(targetedSlot.slot, art, targetedSlot.indexInSlot)}
                              className="w-full py-1 rounded-lg bg-[#B3121B] text-white text-[9.5px] font-black cursor-pointer"
                            >
                              Assign to: {targetedSlot.label}
                            </button>
                          ) : (
                            <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-zinc-200">
                              <button type="button" onClick={() => assignArticleToSlot('lead', art)} className="px-1.5 py-0.5 rounded bg-[#B3121B] text-white text-[7.5px] font-black cursor-pointer">👑 Lead</button>
                              <button type="button" onClick={() => assignArticleToSlot('second', art)} className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-[7.5px] font-black cursor-pointer">📰 2nd</button>
                              <button type="button" onClick={() => assignArticleToSlot('third', art)} className="px-1.5 py-0.5 rounded bg-purple-600 text-white text-[7.5px] font-black cursor-pointer">📰 3rd</button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

              </div>

            </div>
          ) : (
            /* ─── LIVE BROADSHEET PREVIEW TAB ─── */
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-4xl bg-white dark:bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <button type="button" disabled={activePageIndex <= 0} onClick={() => setActivePageIndex((p) => p - 1)} className="flex items-center gap-1 px-3 py-1 rounded-xl bg-zinc-100 text-xs font-bold hover:bg-zinc-200 disabled:opacity-40 cursor-pointer"><ChevronLeft className="h-4 w-4" /> Prev</button>
                  <span className="text-xs font-black">Page {activePageIndex + 1} of {enabledPageConfigs.length} ({enabledPageConfigs[activePageIndex]?.titleGu})</span>
                  <button type="button" disabled={activePageIndex >= enabledPageConfigs.length - 1} onClick={() => setActivePageIndex((p) => p + 1)} className="flex items-center gap-1 px-3 py-1 rounded-xl bg-zinc-100 text-xs font-bold hover:bg-zinc-200 disabled:opacity-40 cursor-pointer">Next <ChevronRight className="h-4 w-4" /></button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setPreviewZoom((z) => Math.max(0.6, z - 0.15))} className="p-1 rounded bg-zinc-100 cursor-pointer"><ZoomOut className="h-3.5 w-3.5" /></button>
                  <span className="text-xs font-bold px-1">{Math.round(previewZoom * 100)}%</span>
                  <button type="button" onClick={() => setPreviewZoom((z) => Math.min(1.4, z + 0.15))} className="p-1 rounded bg-zinc-100 cursor-pointer"><ZoomIn className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => setPreviewZoom(1)} className="px-2 py-0.5 rounded bg-zinc-100 text-[10px] font-bold cursor-pointer">Reset</button>
                </div>

                <button type="button" onClick={() => setViewMode('composer')} className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#B3121B] text-white text-xs font-black cursor-pointer shadow-sm">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> <span>Edit in Composer</span>
                </button>
              </div>

              <div className="max-w-full overflow-auto p-4 sm:p-6 bg-zinc-900/90 rounded-3xl shadow-2xl border border-zinc-800 flex justify-center">
                <div style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}>
                  <EPaperBroadsheetPage data={activePageData} scale={1} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── 4. MODAL FOOTER ─── */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div>
            {isGenerating && generationProgress ? (
              <div className="flex items-center gap-2 text-xs font-black text-[#B3121B]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{generationProgress.message}</span>
              </div>
            ) : (
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Ready to generate <strong>{enabledPageConfigs.length} Section Broadsheets</strong> for <strong>{cityGu || city}</strong>.
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} disabled={isGenerating} className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-black text-zinc-600 hover:bg-zinc-100 cursor-pointer">Cancel</button>
            <button type="button" onClick={handleGenerateAndPublish} disabled={isGenerating || loadingArticles} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#B3121B] to-rose-600 text-white text-xs font-black shadow-md cursor-pointer disabled:opacity-60">
              {isGenerating ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Generating PDF...</span></> : <><Sparkles className="h-4 w-4" /><span>Generate PDF & Publish Edition</span></>}
            </button>
          </div>
        </div>

        {/* ─── 5. HIDDEN RENDER CONTAINER ─── */}
        <div
          ref={renderContainerRef}
          style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '794px', pointerEvents: 'none', zIndex: -1 }}
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
