'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBackendApiUrl, authFetch, clearApiCache } from '@/lib/api';
import { safeYouTubeId } from '@/lib/youtube';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2, 
  X, 
  Play, 
  Clock, 
  Bookmark, 
  Star,
  StarOff,
  Download,
  Eye,
  RefreshCw,
  Film
} from 'lucide-react';

function YoutubeIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M22.5 7.1a2.8 2.8 0 0 0-2-2C18.7 4.6 12 4.6 12 4.6s-6.7 0-8.5.5a2.8 2.8 0 0 0-2 2A29.5 29.5 0 0 0 1 12a29.5 29.5 0 0 0 .5 4.9 2.8 2.8 0 0 0 2 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.8 2.8 0 0 0 2-2A29.5 29.5 0 0 0 23 12a29.5 29.5 0 0 0-.5-4.9Z" />
      <path fill="white" d="m9.8 15.2 5.6-3.2-5.6-3.2v6.4Z" />
    </svg>
  );
}

interface ShortData {
  id: string;
  title: string;
  titleGu: string;
  titleHi: string;
  description: string | null;
  thumbnail: string;
  youtubeId: string;
  embedUrl: string;
  duration: string;
  type: string;
  isFeatured: boolean;
  channel: string | null;
  views: number;
  publishedAt: string;
  createdAt: string;
}

export default function ShortsPage() {
  const [shorts, setShorts] = useState<ShortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedShort, setSelectedShort] = useState<ShortData | null>(null);
  const [previewShort, setPreviewShort] = useState<ShortData | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  // Tab state: 'saved' = DB shorts, 'channel' = live YouTube Shorts feed
  const [activeTab, setActiveTab] = useState<'saved' | 'channel'>('saved');

  // Channel shorts state
  const [channelShorts, setChannelShorts] = useState<any[]>([]);
  const [channelLoading, setChannelLoading] = useState(false);
  const [channelImporting, setChannelImporting] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [totalSavedCount, setTotalSavedCount] = useState(0);

  // Form states
  const [saving, setSaving] = useState(false);
  const [titleGu, setTitleGu] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [duration, setDuration] = useState('0:45');
  const [isFeatured, setIsFeatured] = useState(false);

  // Extract YouTube ID
  const extractYouTubeId = (input: string): string => {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /[?&]v=([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const m = trimmed.match(pattern);
      if (m) return m[1];
    }
    return trimmed;
  };

  const handleYoutubeInputChange = (raw: string) => {
    setYoutubeId(extractYouTubeId(raw));
  };

  // Fetch DB Short Videos (type=short)
  const loadShorts = async () => {
    setLoading(true);
    try {
      const res = await authFetch(
        getBackendApiUrl(`/api/admin/videos?page=${page}&limit=24&query=${encodeURIComponent(query)}&type=short`)
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch short videos');
      setShorts(json.data.videos || []);
      setTotalPages(json.data.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  // Auto-sync engine: checks live YouTube Shorts and inserts new ones into DB
  const autoSyncShortsFromYouTube = async (showToast = false) => {
    setSyncing(true);
    try {
      const res = await fetch('/api/youtube-videos?type=short');
      const json = await res.json();
      const liveShorts: any[] = json.data || [];

      if (!liveShorts.length) return;

      const dbRes = await authFetch(getBackendApiUrl('/api/admin/videos?page=1&limit=500&type=short'));
      const dbJson = await dbRes.json();
      const dbShorts: ShortData[] = dbJson.data?.videos || [];

      const existingSet = new Set<string>();
      dbShorts.forEach((s) => {
        if (s.youtubeId) existingSet.add(safeYouTubeId(s.youtubeId));
      });

      let addedCount = 0;
      for (const ls of liveShorts) {
        const cleanId = safeYouTubeId(ls.youtubeId);
        if (!cleanId) continue;

        const existingShort = dbShorts.find((s) => safeYouTubeId(s.youtubeId) === cleanId);

        if (!existingShort) {
          const createRes = await authFetch(getBackendApiUrl('/api/admin/videos'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: ls.title || 'Gujarat Post News',
              titleGu: ls.title || 'Gujarat Post News',
              titleHi: ls.title || 'Gujarat Post News',
              youtubeId: cleanId,
              type: 'short',
              description: '',
              duration: ls.duration || '0:58',
              isFeatured: false,
              channel: 'Gujarat Post News',
            }),
          });
          if (createRes.ok) {
            addedCount++;
          }
        } else if ((existingShort.titleGu === 'Gujarat Post Short' || !existingShort.titleGu) && ls.title && ls.title !== 'Gujarat Post Short') {
          await authFetch(getBackendApiUrl(`/api/admin/videos/${existingShort.id}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: ls.title,
              titleGu: ls.title,
              titleHi: ls.title,
            }),
          });
          addedCount++;
        }
      }

      if (addedCount > 0) {
        clearApiCache();
        await loadShorts();
        setSyncMsg(`⚡ Auto-Synced ${addedCount} new Short Video(s) from YouTube channel!`);
        setTimeout(() => setSyncMsg(null), 6000);
      } else if (showToast) {
        setSyncMsg('✓ All 50+ YouTube Shorts are up to date in DB!');
        setTimeout(() => setSyncMsg(null), 4000);
      }
    } catch (e) {
      console.warn('Auto-sync shorts error:', e);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadShorts();
  }, [page, query]);

  // Load channel shorts from YouTube channel feed
  const loadChannelShorts = async () => {
    setChannelLoading(true);
    try {
      const res = await fetch('/api/youtube-videos?type=short');
      const json = await res.json();
      setChannelShorts(json.data || []);
    } catch {} finally {
      setChannelLoading(false);
    }
  };

  const [importingAll, setImportingAll] = useState(false);

  const loadSavedIds = useCallback(async () => {
    try {
      const res = await authFetch(getBackendApiUrl('/api/admin/videos?page=1&limit=500&type=short'));
      const json = await res.json();
      const saved = new Set<string>();
      const vids = json.data?.videos || [];
      vids.forEach((v: ShortData) => {
        if (v.youtubeId) saved.add(safeYouTubeId(v.youtubeId));
      });
      setSavedIds(saved);
      setTotalSavedCount(json.data?.total || vids.length);
    } catch {}
  }, []);

  useEffect(() => {
    loadSavedIds();
  }, [loadSavedIds]);

  useEffect(() => {
    if (activeTab !== 'channel') return;
    loadChannelShorts();
    loadSavedIds();
  }, [activeTab, loadSavedIds]);

  const importAllChannelShorts = async () => {
    if (!channelShorts.length) return;
    setImportingAll(true);
    let count = 0;
    try {
      for (const cv of channelShorts) {
        const cleanId = safeYouTubeId(cv.youtubeId);
        if (savedIds.has(cleanId)) continue;

        const res = await authFetch(getBackendApiUrl('/api/admin/videos'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: cv.title || 'Gujarat Post Short',
            titleGu: cv.title || 'Gujarat Post Short',
            titleHi: cv.title || 'Gujarat Post Short',
            youtubeId: cleanId,
            type: 'short',
            description: '',
            duration: cv.duration || '0:45',
            isFeatured: false,
            channel: 'Gujarat Post News',
          }),
        });
        if (res.ok) {
          count++;
          savedIds.add(cleanId);
        }
      }
      clearApiCache();
      await loadShorts();
      await loadSavedIds();
      alert(`Successfully imported ${count} short video(s) into database!`);
    } catch (err: any) {
      alert(`Import error: ${err.message}`);
    } finally {
      setImportingAll(false);
    }
  };

  // Import short from channel feed
  const importFromChannel = async (cv: any) => {
    const cleanId = safeYouTubeId(cv.youtubeId);
    setChannelImporting(cleanId);
    try {
      const res = await authFetch(getBackendApiUrl('/api/admin/videos'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cv.title,
          titleGu: cv.title,
          titleHi: cv.title,
          youtubeId: cleanId,
          type: 'short',
          description: '',
          duration: cv.duration || '0:45',
          isFeatured: false,
          channel: 'Gujarat Post News',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Import failed');
      clearApiCache();
      setSavedIds((prev) => new Set([...prev, cleanId]));
      await loadShorts();
      await loadSavedIds();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setChannelImporting(null);
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (short: ShortData) => {
    const newFeatured = !short.isFeatured;
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/videos/${short.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: newFeatured }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update feature status');
      clearApiCache();
      setShorts((prev) => prev.map((s) => (s.id === short.id ? { ...s, isFeatured: newFeatured } : s)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Submit Add Short Form
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleGu || !youtubeId) return alert('Title (Gujarati) and YouTube Video ID are required');
    setSaving(true);
    try {
      const res = await authFetch(getBackendApiUrl('/api/admin/videos'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleGu,
          titleGu,
          titleHi: titleGu,
          youtubeId,
          type: 'short',
          description: '',
          duration: duration || '0:45',
          isFeatured,
          channel: 'Gujarat Post News',
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save short video');

      clearApiCache();
      setAddModalOpen(false);
      setTitleGu('');
      setYoutubeId('');
      setDuration('0:45');
      setIsFeatured(false);
      setPage(1);
      loadShorts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Open Edit Modal
  const openEdit = (short: ShortData) => {
    setSelectedShort(short);
    setTitleGu(short.titleGu || short.title);
    setYoutubeId(short.youtubeId);
    setDuration(short.duration || '0:45');
    setIsFeatured(short.isFeatured);
    setEditModalOpen(true);
  };

  // Submit Edit Form
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShort) return;
    setSaving(true);
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/videos/${selectedShort.id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleGu,
          titleGu,
          titleHi: titleGu,
          youtubeId,
          type: 'short',
          duration: duration || '0:45',
          isFeatured,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update short video');

      clearApiCache();
      setShorts((prev) => prev.map((s) => (s.id === selectedShort.id ? json.data : s)));
      setEditModalOpen(false);
      setSelectedShort(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Open Custom Delete Dialog Modal
  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  // Perform Delete operation
  const confirmDeleteShort = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/videos/${deleteTargetId}`), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete short video');
      clearApiCache();
      setShorts((prev) => prev.filter((s) => s.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Perform Bulk Delete All Short Videos
  const handleDeleteAllShorts = async () => {
    setDeletingAll(true);
    try {
      const res = await authFetch(getBackendApiUrl('/api/admin/videos/all-shorts'), {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete all short videos');
      clearApiCache();
      setShorts([]);
      setDeleteAllModalOpen(false);
      setSyncMsg('🗑️ All saved short videos deleted successfully!');
      setTimeout(() => setSyncMsg(null), 5000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="space-[#B3121B] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5 border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B3121B] text-white shadow-md">
              <Film className="h-5 w-5" />
            </span>
            Short Videos Management (શોર્ટ વીડિયો)
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Embed, organize, and feature YouTube Shorts for the homepage carousel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => autoSyncShortsFromYouTube(true)}
            disabled={syncing}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 shadow-sm transition disabled:opacity-50"
            title="Sync all latest Shorts from YouTube channel"
          >
            <RefreshCw className={`h-4 w-4 text-[#B3121B] ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing YouTube...' : 'Sync YouTube Shorts'}
          </button>

          {shorts.length > 0 && (
            <button
              onClick={() => setDeleteAllModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900/60 px-4 py-2.5 text-sm font-bold text-[#B3121B] dark:text-red-400 hover:bg-red-100 transition shadow-sm"
              title="Delete all saved short videos"
            >
              <Trash2 className="h-4 w-4" />
              Delete All Shorts
            </button>
          )}

          <button
            onClick={() => {
              setTitleGu('');
              setYoutubeId('');
              setDuration('0:45');
              setIsFeatured(false);
              setAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#B3121B] px-5 py-2.5 text-sm font-black text-white hover:bg-red-700 shadow-md transition-all duration-200"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Add Short Video
          </button>
        </div>
      </div>

      {/* Sync notification toast */}
      {syncMsg && (
        <div className="flex items-center justify-between rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-3 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm animate-in fade-in duration-200">
          <span>{syncMsg}</span>
          <button onClick={() => setSyncMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'saved'
              ? 'bg-[#B3121B] text-white shadow-sm'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          <Film className="h-4 w-4" />
          Saved Short Videos ({totalSavedCount || savedIds.size || shorts.length})
        </button>
        <button
          onClick={() => setActiveTab('channel')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'channel'
              ? 'bg-[#B3121B] text-white shadow-sm'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
          }`}
        >
          <YoutubeIcon className="h-4 w-4 text-red-500 fill-current" />
          Live Channel Shorts Feed ({savedIds.size} Saved)
        </button>
      </div>

      {/* Tab 1: Saved Shorts */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search short video title..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white"
              />
            </div>
          </div>

          {/* Shorts Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Loader2 className="h-10 w-10 animate-spin text-[#B3121B]" />
              <span className="mt-2 text-sm font-semibold">Loading Short Videos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-bold">{error}</div>
          ) : shorts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border rounded-2xl border-dashed bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-400">
              <Film className="h-12 w-12 text-zinc-300 mb-2" />
              <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">No short videos found</p>
              <p className="text-xs text-zinc-500 mt-1">Click "+ Add Short Video" to add YouTube Shorts for the homepage.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {shorts.map((short) => (
                <div
                  key={short.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-md dark:border-zinc-800 transition-all hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* Vertical 9:16 Aspect Thumbnail Container */}
                  <div
                    className="relative aspect-[9/16] w-full overflow-hidden bg-black cursor-pointer"
                    onClick={() => setPreviewShort(short)}
                  >
                    {/* 1080x1920 HD Vertical Frame Thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${safeYouTubeId(short.youtubeId)}/frame0.jpg`}
                      alt={short.titleGu || short.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${safeYouTubeId(short.youtubeId)}/hqdefault.jpg`;
                      }}
                    />

                    {/* Dark gradient overlay matching YouTube */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/10" />

                    {/* Center Red Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <span className="h-10 w-10 bg-[#B3121B] rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition">
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                      </span>
                    </div>

                    {/* Title & Actions Overlay at bottom matching YouTube Shorts layout */}
                    <div className="absolute bottom-0 inset-x-0 p-3 z-10 flex flex-col justify-end space-y-1.5">
                      <p className="line-clamp-2 text-xs font-bold text-white leading-snug drop-shadow-md">
                        {short.titleGu || short.title}
                      </p>

                      <div className="flex items-center justify-between gap-1 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-white/90 drop-shadow">
                          <Eye className="h-3 w-3 text-white/80" />
                          <span>{short.views ? (short.views >= 1000 ? `${(short.views / 1000).toFixed(1)}K` : `${short.views}`) : '75'} વ્યુ</span>
                          <span>|</span>
                          <Clock className="h-3 w-3 text-white/80" />
                          <span>{short.duration || '0:58'}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(short);
                            }}
                            className="rounded-lg p-1.5 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(short.id);
                            }}
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-950/60 hover:text-red-200 backdrop-blur"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Live Channel Shorts */}
      {activeTab === 'channel' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm">
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <YoutubeIcon className="h-5 w-5 text-red-600 fill-current" />
                Gujarat Post YouTube Channel Shorts (@Gujaratpostnews/shorts)
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Found {channelShorts.length} live short videos from channel feed ({channelShorts.filter((cv) => savedIds.has(safeYouTubeId(cv.youtubeId))).length} Saved in Database).
              </p>
            </div>

            <button
              onClick={importAllChannelShorts}
              disabled={importingAll || channelLoading || !channelShorts.length}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#B3121B] px-5 py-2.5 text-xs font-black text-white hover:bg-red-700 shadow-md transition disabled:opacity-50"
            >
              {importingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {importingAll ? 'Importing All Shorts...' : 'Import All Channel Shorts'}
            </button>
          </div>

          {channelLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Loader2 className="h-10 w-10 animate-spin text-[#B3121B]" />
              <span className="mt-2 text-sm font-semibold">Fetching YouTube Channel Shorts...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {channelShorts.map((cv) => {
                const cleanId = safeYouTubeId(cv.youtubeId);
                const isSaved = savedIds.has(cleanId);

                return (
                  <div
                    key={cleanId}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-sm dark:border-zinc-800 transition hover:scale-[1.02]"
                  >
                    {/* Full 9:16 Aspect Thumbnail Container */}
                    <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                      {/* 1080x1920 HD Vertical Frame Thumbnail */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${cleanId}/frame0.jpg`}
                        alt={cv.title}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${cleanId}/hqdefault.jpg`;
                        }}
                      />
                      {/* Dark gradient overlay matching YouTube */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />

                      {/* Center play icon button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="h-10 w-10 bg-[#B3121B] rounded-full flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition">
                          <Play className="h-4 w-4 fill-current ml-0.5" />
                        </span>
                      </div>

                      {/* Title & Metadata Overlay at bottom matching YouTube Shorts layout */}
                      <div className="absolute bottom-0 inset-x-0 p-3 z-10 flex flex-col justify-end space-y-2">
                        <p className="line-clamp-2 text-xs font-bold text-white leading-snug drop-shadow-md">
                          {cv.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-white/90 drop-shadow">
                          <Eye className="h-3 w-3 text-white/80" />
                          <span>{cv.views ? (cv.views >= 1000 ? `${(cv.views / 1000).toFixed(1)}K` : `${cv.views}`) : '75'} વ્યુ</span>
                          <span>|</span>
                          <Clock className="h-3 w-3 text-white/80" />
                          <span>{cv.duration || '0:58'}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            importFromChannel(cv);
                          }}
                          disabled={isSaved || channelImporting === cleanId}
                          className={`flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-xs font-black shadow-md transition-all ${
                            isSaved
                              ? 'bg-zinc-800/90 text-zinc-300 backdrop-blur cursor-default border border-white/10'
                              : 'bg-[#B3121B] text-white hover:bg-red-700'
                          }`}
                        >
                          {channelImporting === cleanId ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : isSaved ? (
                            '✓ Saved'
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          {channelImporting === cleanId ? 'Importing...' : isSaved ? '' : 'Import Short'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ADD SHORT MODAL ─── */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Film className="h-5 w-5 text-[#B3121B]" />
                Add Short Video
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  YouTube Shorts Link અથવા Video ID
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/shorts/... અથવા Video ID paste કરો"
                  value={youtubeId}
                  onChange={(e) => handleYoutubeInputChange(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    handleYoutubeInputChange(e.clipboardData.getData('text'));
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  required
                />
                {youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(youtubeId) && (
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2 dark:border-green-800 dark:bg-green-950/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                      alt="thumbnail"
                      className="h-12 w-10 rounded object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                        ✓ Valid Short ID Found
                      </p>
                      <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300">{youtubeId}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  શીર્ષક (ગુજરાતી)
                </label>
                <input
                  type="text"
                  value={titleGu}
                  onChange={(e) => setTitleGu(e.target.value)}
                  placeholder="શોર્ટ વીડિયોનું શીર્ષક ગુજરાતીમાં લખો..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 0:45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-[#B3121B] focus:ring-[#B3121B]"
                    />
                    Feature on Homepage Carousel
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4 border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#B3121B] px-5 py-2 text-xs font-black text-white hover:bg-red-700 shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Short Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── EDIT SHORT MODAL ─── */}
      {editModalOpen && selectedShort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-zinc-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-[#B3121B]" />
                Edit Short Video
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  YouTube Shorts Link / Video ID
                </label>
                <input
                  type="text"
                  value={youtubeId}
                  onChange={(e) => handleYoutubeInputChange(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  શીર્ષક (ગુજરાતી)
                </label>
                <input
                  type="text"
                  value={titleGu}
                  onChange={(e) => setTitleGu(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-[#B3121B] focus:ring-[#B3121B]"
                    />
                    Feature on Homepage
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t pt-4 border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#B3121B] px-5 py-2 text-xs font-black text-white hover:bg-red-700 shadow-md transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Short Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── PREVIEW MODAL ─── */}
      {previewShort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setPreviewShort(null)} />
          <div className="relative w-full max-w-xs aspect-[9/16] max-h-[80vh] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 z-10">
            <button
              onClick={() => setPreviewShort(null)}
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${safeYouTubeId(previewShort.youtubeId)}?autoplay=1&rel=0`}
              title="YouTube Shorts player"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ─── CUSTOM DELETE CONFIRMATION MODAL ─── */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => !deleting && setDeleteTargetId(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center">
            {/* Red Warning Icon Badge */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/60 text-[#B3121B] shadow-inner">
              <Trash2 className="h-7 w-7" />
            </div>

            <h3 className="text-base font-black text-zinc-900 dark:text-white">
              Delete Short Video?
            </h3>
            <p className="mt-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to delete this short video? It will be removed from the homepage Short Videos carousel.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-100 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition disabled:opacity-50"
              >
                Cancel (રદ કરો)
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDeleteShort}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#B3121B] py-2.5 text-xs font-black text-white hover:bg-red-700 shadow-md transition disabled:opacity-50"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? 'Deleting...' : 'Delete Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CUSTOM DELETE ALL CONFIRMATION MODAL ─── */}
      {deleteAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => !deletingAll && setDeleteAllModalOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center">
            {/* Red Warning Icon Badge */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/60 text-[#B3121B] shadow-inner">
              <Trash2 className="h-7 w-7" />
            </div>

            <h3 className="text-base font-black text-zinc-900 dark:text-white">
              Delete ALL Saved Shorts?
            </h3>
            <p className="mt-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to delete all {shorts.length} saved short videos from the database? You can re-sync them from YouTube channel anytime!
            </p>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={deletingAll}
                onClick={() => setDeleteAllModalOpen(false)}
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-100 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition disabled:opacity-50"
              >
                Cancel (રદ કરો)
              </button>
              <button
                type="button"
                disabled={deletingAll}
                onClick={handleDeleteAllShorts}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#B3121B] py-2.5 text-xs font-black text-white hover:bg-red-700 shadow-md transition disabled:opacity-50"
              >
                {deletingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deletingAll ? 'Deleting All...' : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
