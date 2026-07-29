'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, RefreshCw, Eye, CheckCircle2, XCircle,
  LayoutTemplate, ArrowUpRight, Trash2, Save,
  Calendar, User, Tag, X, ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getBackendApiUrl, authFetch, getPublicArticles } from '@/lib/api';

/* ─── Types ──────────────────────────────────────────────────────────── */
type CatObj = { id: string; name: string; slug?: string };
type AuthorObj = { id: string; name: string; authorName?: string };

type Article = {
  id: string;
  articleNumber?: number;
  titleGu?: string;
  title?: string;
  titleEn?: string;
  slug: string;
  image?: string;
  featuredImage?: string;
  category?: string | CatObj;
  author?: string | AuthorObj;
  isFeatured: boolean;
  isTrending: boolean;
  status?: string;
  publishedAt?: string;
  createdAt?: string;
};

const DEMO_IMAGES = [
  '/assets/demo/3.jpg', '/assets/demo/4.jpg', '/assets/demo/1.jpg',
  '/assets/demo/2.jpg', '/assets/demo/5.jpg', '/assets/demo/6.jpg',
  '/assets/demo/7.jpg', '/assets/demo/8.jpg',
];

function getArticleImage(article?: Article | null): string {
  if (!article) return DEMO_IMAGES[0];
  const rawImage = article.featuredImage || article.image;
  if (rawImage && rawImage.trim() !== '') return rawImage;
  let hash = 0;
  const key = article.id || article.slug || article.titleGu || article.title || '';
  for (let i = 0; i < key.length; i++) { hash = (hash << 5) - hash + key.charCodeAt(i); hash |= 0; }
  return DEMO_IMAGES[Math.abs(hash) % DEMO_IMAGES.length];
}
function catName(c?: string | CatObj) { return !c ? '' : typeof c === 'string' ? c : (c.name ?? ''); }
function authorName(a?: string | AuthorObj) { return !a ? '' : typeof a === 'string' ? a : (a.authorName ?? a.name ?? ''); }
function fmtDate(d?: string) { return !d ? '' : new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
function getTitle(a?: Article | null) { return !a ? '' : (a.titleGu ?? a.title ?? a.titleEn ?? 'Untitled'); }

/* ─── Inline Search Dropdown ─────────────────────────────────────────── */
function ArticleSearchBox({
  placeholder = 'Search articles...',
  onSelect,
  excluded = [],
  allArticles,
}: {
  placeholder?: string;
  onSelect: (a: Article) => void;
  excluded?: string[];
  allArticles: Article[];
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const available = allArticles.filter((a) => !excluded.includes(a.id));
  const results = q.trim()
    ? available.filter((a) => {
        const low = q.toLowerCase().replace(/^#/, '').trim();
        const numMatch = a.articleNumber ? String(a.articleNumber).includes(low) : false;
        return (
          (a.titleGu ?? a.title ?? '').toLowerCase().includes(low) ||
          catName(a.category).toLowerCase().includes(low) ||
          numMatch
        );
      }).slice(0, 150)
    : available.slice(0, 150);

  return (
    <div ref={ref} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
        <input
          type="text"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 pl-9 pr-4 py-2.5 text-[12px] font-medium text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-[#B3121B]/60 focus:ring-2 focus:ring-[#B3121B]/15 focus:bg-white dark:focus:bg-zinc-900 transition-all"
        />
        {q && (
          <button
            onClick={() => { setQ(''); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center hover:bg-zinc-300 transition"
          >
            <X className="h-2.5 w-2.5 text-zinc-500" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden max-h-64 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-700 backdrop-blur-sm">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              {q.trim() ? `${results.length} search results` : `Select from Published Articles (${available.length})`}
            </span>
            <button onClick={() => setOpen(false)} className="text-[9px] font-semibold text-zinc-400 hover:text-zinc-600 transition">Close ✕</button>
          </div>
          {results.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => { onSelect(a); setQ(''); setOpen(false); }}
              className="group flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-[#B3121B]/5 active:bg-[#B3121B]/10 transition-colors border-b border-zinc-50 dark:border-zinc-800 last:border-0"
            >
              <div className="relative h-9 w-14 shrink-0 rounded-lg overflow-hidden bg-zinc-100 shadow-sm">
                <Image src={getArticleImage(a)} alt="" fill unoptimized className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 line-clamp-1 group-hover:text-[#B3121B] transition-colors">{getTitle(a)}</p>
                <p className="text-[9px] text-zinc-400 mt-0.5">
                  {a.articleNumber ? `#${a.articleNumber} • ` : ''}
                  {catName(a.category)} {(a.publishedAt ?? a.createdAt) && `• ${fmtDate(a.publishedAt ?? a.createdAt)}`}
                </p>
              </div>
              <div className="shrink-0 h-5 w-5 rounded-full border border-zinc-200 dark:border-zinc-700 group-hover:border-[#B3121B] group-hover:bg-[#B3121B] flex items-center justify-center transition-all">
                <svg className="h-2.5 w-2.5 text-transparent group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Visual Slot Card ────────────────────────────────────────────────── */
function SlotCard({
  slotNum,
  article,
  onSelect,
  onRemove,
  allArticles,
  excluded,
}: {
  slotNum: number;
  article: Article | null;
  onSelect: (a: Article) => void;
  onRemove: () => void;
  allArticles: Article[];
  excluded: string[];
}) {
  const [showSearch, setShowSearch] = useState(false);
  const slotLabels = ['Left Card', 'Centre Card', 'Right Card'];

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow">
      {/* Slot Badge */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#B3121B] text-white text-[11px] font-black">
            {slotNum}
          </span>
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{slotLabels[slotNum - 1]}</span>
        </div>
        {article && (
          <button
            onClick={onRemove}
            className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400 hover:text-red-500 transition"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        )}
      </div>

      {/* Image Preview — overflow-hidden applied HERE so rounded corners clip the image only */}
      <div className="relative w-full aspect-[16/10] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        {article ? (
          <Image
            src={getArticleImage(article)}
            alt={getTitle(article)}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-300 dark:text-zinc-600">
            <ImageIcon className="h-8 w-8" />
            <span className="text-[11px] font-semibold">No article selected</span>
          </div>
        )}
        {/* Overlay gradient when article exists */}
        {article && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
        {/* Category & Article Number badges */}
        {article && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-[#B3121B] px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white">
              {catName(article.category) || 'News'}
            </span>
            {article.articleNumber && (
              <span className="inline-flex items-center rounded-full bg-black/75 backdrop-blur-sm border border-white/20 px-2 py-0.5 text-[9px] font-black text-white">
                #{article.articleNumber}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Article Info */}
      <div className="px-4 py-3 flex-1 flex flex-col gap-2">
        {article ? (
          <>
            <p className="text-[12px] font-black text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-snug">
              {getTitle(article)}
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] text-zinc-400">
              {article.articleNumber && (
                <span className="inline-flex items-center font-black text-[#B3121B] bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded text-[9px]">
                  #{article.articleNumber}
                </span>
              )}
              {authorName(article.author) && (
                <span className="flex items-center gap-1"><User className="h-2.5 w-2.5" />{authorName(article.author)}</span>
              )}
              {(article.publishedAt ?? article.createdAt) && (
                <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{fmtDate(article.publishedAt ?? article.createdAt)}</span>
              )}
              {catName(article.category) && (
                <span className="flex items-center gap-1"><Tag className="h-2.5 w-2.5" />{catName(article.category)}</span>
              )}
            </div>
          </>
        ) : (
          <p className="text-[11px] text-zinc-400 italic">Click below to choose an article for this slot</p>
        )}

        {/* Change / Select button */}
        <button
          onClick={() => setShowSearch((v) => !v)}
          className={`mt-auto flex items-center justify-center gap-2 w-full rounded-xl text-[11px] font-bold py-2.5 transition-all ${
            showSearch
              ? 'bg-[#B3121B] text-white shadow-md shadow-[#B3121B]/20'
              : article
              ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-[#B3121B]/10 hover:text-[#B3121B]'
              : 'bg-[#B3121B] text-white hover:bg-[#8E0E15] shadow-sm shadow-[#B3121B]/30'
          }`}
        >
          {showSearch ? (
            <><X className="h-3.5 w-3.5" /> Close Search</>
          ) : (
            <><RefreshCw className="h-3.5 w-3.5" /> {article ? 'Change Article' : 'Select Article'}</>
          )}
        </button>

        {/* Inline search panel */}
        {showSearch && (
          <div className="mt-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 p-2.5">
            <ArticleSearchBox
              allArticles={allArticles}
              excluded={excluded}
              placeholder="Type to search articles..."
              onSelect={(a) => { onSelect(a); setShowSearch(false); }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────── */
export default function HeroManagerPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // 3 bottom image slots
  const [slots, setSlots] = useState<(Article | null)[]>([null, null, null]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const pubRes = await getPublicArticles({ limit: 300 });
      const arts = (pubRes.articles || []) as unknown as Article[];

      setAllArticles(arts);

      // Load the 3 currently isFeatured articles into slots
      const featured = arts.filter((a) => a.isFeatured);
      setSlots([featured[0] ?? null, featured[1] ?? null, featured[2] ?? null]);
    } catch {
      showToast('Failed to load articles', false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const usedIds = slots.filter(Boolean).map((a) => a!.id);

  const handleSave = async () => {
    if (usedIds.length === 0) {
      showToast('Please select at least one article before saving.', false);
      return;
    }
    setSaving(true);
    try {
      const newFeaturedIds = new Set<string>(usedIds);

      // Find articles that were previously featured but are no longer selected
      const prevFeatured = allArticles.filter((a) => a.isFeatured && !newFeaturedIds.has(a.id));

      // Step 1: Set the 3 selected articles as isFeatured=true
      const setTrue = usedIds.map((id) =>
        authFetch(`/api/admin/articles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isFeatured: true }),
        })
      );

      // Step 2: Unset articles that were featured before but are not in the new selection
      const setFalse = prevFeatured.map((a) =>
        authFetch(`/api/admin/articles/${a.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isFeatured: false }),
        })
      );

      const results = await Promise.all([...setTrue, ...setFalse]);
      const allOk = results.every((r) => r.ok);

      if (allOk) {
        showToast(`✅ Saved! ${usedIds.length} article${usedIds.length > 1 ? 's' : ''} now featured in the bottom row.`, true);
        // Update allArticles in-place (no re-fetch) so the slot ORDER stays exactly
        // as the admin selected them. Re-fetching re-sorts by updatedAt which shuffles slots.
        setAllArticles((prev) =>
          prev.map((a) => ({ ...a, isFeatured: newFeaturedIds.has(a.id) }))
        );
      } else {
        showToast('Some updates failed. Please try again.', false);
      }
    } catch {
      showToast('Save failed. Please try again.', false);
    } finally {
      setSaving(false);
    }
  };

  const setSlot = (idx: number, art: Article) => {
    setSlots((prev) => { const next = [...prev]; next[idx] = art; return next; });
  };
  const removeSlot = (idx: number) => {
    setSlots((prev) => { const next = [...prev]; next[idx] = null; return next; });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <LayoutTemplate className="h-6 w-6 text-[#B3121B]" />
            Hero Section Manager
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Pick the <strong>3 articles</strong> that appear as image cards in the <strong>bottom row</strong> of the homepage hero section.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-3 sm:mt-0 shrink-0">
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 transition">
            <Eye className="h-4 w-4" /> Preview Homepage <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button onClick={handleSave} disabled={saving || loading} className="inline-flex items-center gap-1.5 rounded-lg bg-[#B3121B] px-4 py-2 text-sm font-bold text-white hover:bg-[#8E0E15] transition disabled:opacity-60">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Articles</p>
          <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-zinc-100">{allArticles.length}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Published news</p>
        </div>
        <div className="rounded-xl border border-[#B3121B]/25 bg-red-50 dark:bg-red-950/20 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#B3121B]">Slots Filled</p>
          <p className="mt-1 text-3xl font-black text-[#B3121B]">{usedIds.length} / 3</p>
          <p className="text-xs text-[#B3121B]/60 mt-0.5">Bottom row image cards</p>
        </div>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Available</p>
          <p className="mt-1 text-3xl font-black text-zinc-900 dark:text-zinc-100">{allArticles.length - usedIds.length}</p>
          <p className="text-xs text-zinc-400 mt-0.5">Remaining articles</p>
        </div>
      </div>

      {/* Homepage Layout Hint */}
      <div className="mb-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-5 py-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Homepage Layout Preview</p>
        <div className="flex gap-2 items-stretch">
          {/* Main hero (auto) */}
          <div className="flex-[2] rounded-xl bg-zinc-200 dark:bg-zinc-700 p-3 flex flex-col gap-1 min-h-[80px]">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Main Hero</span>
            <span className="text-[10px] text-zinc-400">Auto (latest article)</span>
          </div>
          {/* Right 2 (auto) */}
          <div className="flex-1 flex flex-col gap-2">
            {[1, 2].map((n) => (
              <div key={n} className="flex-1 rounded-xl bg-zinc-200 dark:bg-zinc-700 p-2 flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide">Right {n}</span>
                <span className="text-[10px] text-zinc-400">Auto</span>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom 3 — admin controlled */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {['Slot 1 ✎', 'Slot 2 ✎', 'Slot 3 ✎'].map((label, i) => (
            <div key={i} className={`rounded-xl p-3 flex flex-col gap-0.5 ${slots[i] ? 'bg-[#B3121B]/10 border border-[#B3121B]/30' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
              <span className={`text-[9px] font-bold uppercase tracking-wide ${slots[i] ? 'text-[#B3121B]' : 'text-zinc-500'}`}>{label}</span>
              <span className="text-[10px] text-zinc-400 line-clamp-1">
                {slots[i] ? `${slots[i]?.articleNumber ? `#${slots[i]?.articleNumber} - ` : ''}${getTitle(slots[i])}` : 'Empty'}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-zinc-400 mt-2">✎ = Admin-controlled slots (this page) &nbsp;|&nbsp; Auto = Latest published articles</p>
      </div>

      {/* 3-Column Slot Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32 text-zinc-400">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" /> Loading articles...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[0, 1, 2].map((idx) => (
              <SlotCard
                key={idx}
                slotNum={idx + 1}
                article={slots[idx]}
                onSelect={(a) => setSlot(idx, a)}
                onRemove={() => removeSlot(idx)}
                allArticles={allArticles}
                excluded={usedIds.filter((id) => id !== slots[idx]?.id)}
              />
            ))}
          </div>

          {/* Info note */}
          <div className="mt-6 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <span className="mt-0.5 shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-400 text-[10px] font-black">i</span>
            <span><strong>Note:</strong> The 3 articles selected here appear as the <strong>bottom image row</strong> of the homepage hero section. The main hero and right side cards auto-populate from the latest news. Click <strong>Save Changes</strong> to apply.</span>
          </div>
        </>
      )}
    </div>
  );
}
