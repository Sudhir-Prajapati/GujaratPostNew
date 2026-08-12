'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  Link as LinkIcon,
  Eye,
  Loader2,
  AlertCircle,
  LayoutGrid,
  ExternalLink,
  Layers,
  Sparkles,
  Video,
  ImageIcon,
  Sidebar,
  Sliders,
} from 'lucide-react';
import { getBackendApiUrl, authFetch } from '@/lib/api';

const HOME_SECTIONS = [
  { id: 'AFTER_HERO', label: 'After Hero Section (Top Banner)', description: 'Placed directly below the main hero news grid' },
  { id: 'AFTER_TRENDING', label: 'After Trending Section', description: 'Placed below trending news & ticker section' },
  { id: 'AFTER_WEBSTORIES', label: 'After Web Stories', description: 'Placed below interactive web stories bar' },
  { id: 'AFTER_VIDEOS', label: 'After Latest Videos', description: 'Placed below video section' },
  { id: 'AFTER_GALLERY', label: 'After Photo Gallery', description: 'Placed below photo gallery section' },
  { id: 'IN_ARTICLE', label: 'In-Article Ad (Inside Article Body)', description: 'Shown after paragraph 3 inside every article — 728×90 or 300×250 recommended' },
];

const FIXED_SIDEBAR_SLOTS = [
  {
    id: 'SIDEBAR_HERO_TOP',
    label: 'Sidebar Ad 1 (Hero Top Right)',
    description: 'Fixed top right sidebar ad (Default: Orange Mega Sale Days banner)',
    defaultColor: 'linear-gradient(135deg,#FF6B35,#C81D25)',
  },
  {
    id: 'SIDEBAR_GUJARAT',
    label: 'Sidebar Ad 2 (Gujarat Section)',
    description: 'Fixed sidebar ad alongside Gujarat hyperlocal news (Default: Dark Blue Easy Personal Loan banner)',
    defaultColor: 'linear-gradient(135deg,#0f3d70,#001f3f)',
  },
  {
    id: 'SIDEBAR_WORLD',
    label: 'Sidebar Ad 3 (World Section)',
    description: 'Fixed sidebar ad alongside World / Vishw news (Default: Green Dream Homes banner)',
    defaultColor: '#0E8044',
  },
  {
    id: 'SIDEBAR_POPULAR',
    label: 'Sidebar Ad 4 (Popular Section)',
    description: 'Fixed sidebar ad alongside Popular news (Default: Purple Recharge Plus banner)',
    defaultColor: 'linear-gradient(135deg,#5D3FD3,#4A2CA8)',
  },
];

export default function AdminAdsPage() {
  const [activeTab, setActiveTab] = useState<'section' | 'sidebar'>('section');
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [selectedSection, setSelectedSection] = useState<string>('AFTER_HERO');
  const [adTitle, setAdTitle] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageCount, setImageCount] = useState<number>(1); // 1, 2, or 3 images
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');

  // Image/Video & Link fields (max 3 for section, 1 for fixed sidebar)
  const [image1, setImage1] = useState('');
  const [link1, setLink1] = useState('');

  const [image2, setImage2] = useState('');
  const [link2, setLink2] = useState('');

  const [image3, setImage3] = useState('');
  const [link3, setLink3] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);

  const fileInputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await authFetch(getBackendApiUrl('/api/admin/ads'));
      const json = await res.json();
      if (json.success && json.data?.ads) {
        setAds(json.data.ads);
      }
    } catch (err) {
      console.error('Failed to load advertisements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const resetForm = () => {
    if (activeTab === 'sidebar') {
      setSelectedSection('SIDEBAR_HERO_TOP');
    } else {
      setSelectedSection('AFTER_HERO');
    }
    setAdTitle('');
    setIsActive(true);
    setImageCount(1);
    setMediaType('IMAGE');
    setImage1('');
    setLink1('');
    setImage2('');
    setLink2('');
    setImage3('');
    setLink3('');
    setEditingId(null);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Switch tab resets form state accordingly
  const handleTabChange = (tab: 'section' | 'sidebar') => {
    setActiveTab(tab);
    resetForm();
    if (tab === 'sidebar') {
      setSelectedSection('SIDEBAR_HERO_TOP');
    } else {
      setSelectedSection('AFTER_HERO');
    }
  };

  const handleEdit = (ad: any) => {
    const isSidebarSlot = FIXED_SIDEBAR_SLOTS.some((s) => s.id === ad.section);
    if (isSidebarSlot) {
      setActiveTab('sidebar');
    } else {
      setActiveTab('section');
    }

    setSelectedSection(ad.section);
    setAdTitle(ad.title || '');
    setIsActive(ad.isActive);
    setMediaType(ad.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGE');

    setImage1(ad.image1 || '');
    setLink1(ad.link1 || '');

    setImage2(ad.image2 || '');
    setLink2(ad.link2 || '');

    setImage3(ad.image3 || '');
    setLink3(ad.link3 || '');

    let count = 1;
    if (ad.image3) count = 3;
    else if (ad.image2) count = 2;
    setImageCount(count);

    setEditingId(ad.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    setUploadingIndex(index);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await authFetch(getBackendApiUrl('/api/admin/upload'), {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      const url = json.url || json.data?.url;
      if (res.ok && url) {
        if (index === 0) setImage1(url);
        else if (index === 1) setImage2(url);
        else if (index === 2) setImage3(url);
      } else {
        setErrorMessage(json.error || json.message || 'Failed to upload file');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'File upload error');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedSection) {
      setErrorMessage('Please select a target advertisement slot');
      return;
    }

    if (!image1) {
      setErrorMessage(
        activeTab === 'sidebar'
          ? 'Please provide an Image or Video for the sidebar ad'
          : 'Please provide at least Image 1'
      );
      return;
    }

    if (activeTab === 'section' && imageCount >= 2 && !image2) {
      setErrorMessage('Please provide Image 2 or change image count to 1');
      return;
    }

    if (activeTab === 'section' && imageCount >= 3 && !image3) {
      setErrorMessage('Please provide Image 3 or change image count to 2');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        section: selectedSection,
        title: adTitle || `Ad Banner for ${selectedSection}`,
        isActive,
        mediaType,
        image1: image1 || null,
        link1: link1 || null,
        image2: activeTab === 'section' && imageCount >= 2 ? image2 || null : null,
        link2: activeTab === 'section' && imageCount >= 2 ? link2 || null : null,
        image3: activeTab === 'section' && imageCount >= 3 ? image3 || null : null,
        link3: activeTab === 'section' && imageCount >= 3 ? link3 || null : null,
      };

      const res = await authFetch(getBackendApiUrl('/api/admin/ads'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMessage('Advertisement saved successfully!');
        resetForm();
        fetchAds();
      } else {
        setErrorMessage(json.error || 'Failed to save advertisement');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving advertisement');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/ads/${id}/toggle`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setAds(ads.map((a) => (a.id === id ? { ...a, isActive: !currentStatus } : a)));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement configuration?')) return;

    try {
      const res = await authFetch(getBackendApiUrl(`/api/admin/ads/${id}`), {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setAds(ads.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete ad:', err);
    }
  };

  const filteredAdsList = ads.filter((ad) => {
    const isSidebar = FIXED_SIDEBAR_SLOTS.some((s) => s.id === ad.section);
    return activeTab === 'sidebar' ? isSidebar : !isSidebar;
  });

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
              <Megaphone className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Advertisement Manager
            </h1>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage both In-Between Section Banners (1, 2, or 3 images) and Fixed Right Sidebar Ads (Image or Video with click redirect).
          </p>
        </div>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" /> Cancel Edit
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl max-w-xl border border-zinc-200 dark:border-zinc-700/50">
        <button
          type="button"
          onClick={() => handleTabChange('section')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'section'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-800'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <LayoutGrid className="h-4 w-4 text-red-500" />
          <span>In-Between Section Ads</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('sidebar')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'sidebar'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-800'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Sidebar className="h-4 w-4 text-blue-500" />
          <span>Fixed Sidebar Ads</span>
        </button>
      </div>

      {/* Main Form & Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-500" />
              {editingId
                ? `Edit ${activeTab === 'sidebar' ? 'Fixed Sidebar Ad' : 'Section Ad'}`
                : `Add ${activeTab === 'sidebar' ? 'Fixed Sidebar Ad' : 'New Section Ad'}`}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-500">Status:</span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isActive ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-bold ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {isActive ? 'Active' : 'Draft'}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-800">
              <Check className="h-5 w-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Slot / Section Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">
                1. Target Position / Slot <span className="text-red-500">*</span>
              </label>
              {activeTab === 'sidebar' ? (
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {FIXED_SIDEBAR_SLOTS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.label}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {HOME_SECTIONS.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.label}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-zinc-500">
                {activeTab === 'sidebar'
                  ? FIXED_SIDEBAR_SLOTS.find((s) => s.id === selectedSection)?.description
                  : HOME_SECTIONS.find((s) => s.id === selectedSection)?.description}
              </p>
            </div>

            {/* Optional Title */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Ad Title / Reference Label <span className="text-xs font-normal text-zinc-400">(Optional)</span>
              </label>
              <input
                type="text"
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                placeholder="e.g. Summer Promo 2026"
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 px-4 py-2.5 text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Media Type Selector (For Fixed Sidebar Ads) */}
            {activeTab === 'sidebar' && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  2. Media Type (Image or Video) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaType('IMAGE')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      mediaType === 'IMAGE'
                        ? 'border-red-600 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Image Banner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType('VIDEO')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      mediaType === 'VIDEO'
                        ? 'border-red-600 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>Video Banner</span>
                  </button>
                </div>
              </div>
            )}

            {/* Image Count Selector (For In-Between Section Ads) */}
            {activeTab === 'section' && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  2. Number of Ad Images <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setImageCount(num)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        imageCount === num
                          ? 'border-red-600 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-bold'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                      }`}
                    >
                      <span className="text-base font-black">{num} {num === 1 ? 'Image' : 'Images'}</span>
                      <span className="text-[11px] opacity-80 mt-0.5">
                        {num === 1 ? '100% Width' : num === 2 ? '50% / 50%' : '33.3% Each'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Media Upload & Link Input Fields */}
            <div className="space-y-5 pt-2">
              {(activeTab === 'sidebar' ? [0] : [0, 1, 2].slice(0, imageCount)).map((idx) => {
                const imgVal = idx === 0 ? image1 : idx === 1 ? image2 : image3;
                const setImgVal = idx === 0 ? setImage1 : idx === 1 ? setImage2 : setImage3;
                const linkVal = idx === 0 ? link1 : idx === 1 ? link2 : link3;
                const setLinkVal = idx === 0 ? setLink1 : idx === 1 ? setLink2 : setLink3;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        {activeTab === 'sidebar' ? (
                          mediaType === 'VIDEO' ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />
                        ) : (
                          <LayoutGrid className="h-3.5 w-3.5" />
                        )}
                        {activeTab === 'sidebar' ? 'Sidebar Media & Link' : `Ad Image Slot ${idx + 1}`}
                      </span>
                      {activeTab === 'section' && (
                        <span className="text-[11px] text-zinc-400 font-semibold">
                          {imageCount === 1 ? 'Full Banner' : imageCount === 2 ? 'Half Banner' : '1/3 Banner'}
                        </span>
                      )}
                    </div>

                    {/* Field 1: Media (Image or Video) */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        {activeTab === 'sidebar' && mediaType === 'VIDEO'
                          ? 'Video File (MP4/WebM Upload) or Video URL'
                          : 'Image File (Upload) or Image URL'}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={imgVal}
                          onChange={(e) => setImgVal(e.target.value)}
                          placeholder={
                            activeTab === 'sidebar' && mediaType === 'VIDEO'
                              ? 'https://example.com/banner-video.mp4'
                              : 'https://example.com/banner-image.jpg'
                          }
                          className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="file"
                          ref={fileInputRefs[idx]}
                          accept={activeTab === 'sidebar' && mediaType === 'VIDEO' ? 'video/*,image/*' : 'image/*'}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleFileUpload(idx, e.target.files[0]);
                          }}
                        />
                        <button
                          type="button"
                          disabled={uploadingIndex === idx}
                          onClick={() => fileInputRefs[idx].current?.click()}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-xs font-bold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shrink-0 disabled:opacity-50"
                        >
                          {uploadingIndex === idx ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Upload className="h-3.5 w-3.5" />
                          )}
                          <span>Upload File</span>
                        </button>
                      </div>

                      {/* Media Preview */}
                      {imgVal && (
                        <div className="relative h-32 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-900 mt-2 flex items-center justify-center">
                          {mediaType === 'VIDEO' || /\.(mp4|webm|mov)(\?.*)?$/i.test(imgVal) ? (
                            <video src={imgVal} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                          ) : (
                            <Image
                              src={imgVal}
                              alt={`Preview ${idx + 1}`}
                              fill
                              unoptimized={imgVal.startsWith('http')}
                              className="object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setImgVal('')}
                            className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Field 2: Redirect Link */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Redirect Target Link URL (Opens when clicked)
                      </label>
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                        <input
                          type="url"
                          value={linkVal}
                          onChange={(e) => setLinkVal(e.target.value)}
                          placeholder="https://yourbrand.com/promo-landing"
                          className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-sm font-bold shadow-md shadow-red-950/20 transition disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                <span>
                  {editingId
                    ? activeTab === 'sidebar' ? 'Update Sidebar Ad' : 'Update Section Ad'
                    : activeTab === 'sidebar' ? 'Save Sidebar Ad' : 'Save Section Ad'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview & Configured Ads (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-500" /> Live Layout Preview
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md">
                {activeTab === 'sidebar'
                  ? `${mediaType} Banner`
                  : imageCount === 1 ? '100% Width' : imageCount === 2 ? '50% / 50%' : '33.3% Grid'}
              </span>
            </div>

            <p className="text-xs text-zinc-500">
              Target Slot: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedSection}</span>
            </p>

            {/* Simulated Banner Container */}
            <div className="p-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950">
              {activeTab === 'sidebar' ? (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900 flex flex-col items-center justify-center text-center p-2">
                  {image1 ? (
                    mediaType === 'VIDEO' || /\.(mp4|webm|mov)(\?.*)?$/i.test(image1) ? (
                      <video src={image1} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                    ) : (
                      <Image src={image1} alt="Sidebar Preview" fill unoptimized={image1.startsWith('http')} className="object-cover" />
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-400 text-xs p-4">
                      <Sidebar className="h-6 w-6 mb-1 opacity-50" />
                      <span className="font-bold">Default Banner Active</span>
                      <span className="text-[10px] text-zinc-500 mt-1">Upload custom media to override default card</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    SIDEBAR AD
                  </div>
                </div>
              ) : (
                <div
                  className={`grid gap-2 ${
                    imageCount === 1
                      ? 'grid-cols-1'
                      : imageCount === 2
                      ? 'grid-cols-2'
                      : 'grid-cols-3'
                  }`}
                >
                  {[0, 1, 2].slice(0, imageCount).map((idx) => {
                    const img = idx === 0 ? image1 : idx === 1 ? image2 : image3;
                    const link = idx === 0 ? link1 : idx === 1 ? link2 : link3;

                    return (
                      <div
                        key={idx}
                        className="relative aspect-[16/8] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-800 flex flex-col items-center justify-center text-center p-2 group"
                      >
                        {img ? (
                          <Image
                            src={img}
                            alt={`Slot ${idx + 1}`}
                            fill
                            unoptimized={img.startsWith('http')}
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-zinc-400 text-[10px]">
                            <Upload className="h-4 w-4 mb-1 opacity-50" />
                            <span>Slot {idx + 1} Image</span>
                          </div>
                        )}
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          AD {idx + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Configured Ads List for Active Tab */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <Layers className="h-4 w-4 text-blue-500" />
              {activeTab === 'sidebar' ? 'Configured Sidebar Ads' : 'Configured Section Ads'} ({filteredAdsList.length})
            </h3>

            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center text-zinc-400">
                <Loader2 className="h-6 w-6 animate-spin mb-2 text-red-500" />
                <span className="text-xs">Loading advertisements...</span>
              </div>
            ) : filteredAdsList.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs">
                No custom {activeTab === 'sidebar' ? 'sidebar' : 'section'} ads created yet. Fill the form to add one.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAdsList.map((ad) => {
                  const secLabel =
                    FIXED_SIDEBAR_SLOTS.find((s) => s.id === ad.section)?.label ||
                    HOME_SECTIONS.find((s) => s.id === ad.section)?.label ||
                    ad.section;

                  return (
                    <div
                      key={ad.id}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                            {ad.title || secLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                              ad.isActive
                                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {ad.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate">
                          {secLabel} • <span className="font-semibold">{ad.mediaType || 'IMAGE'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(ad.id, ad.isActive)}
                          title="Toggle Active Status"
                          className={`p-1.5 rounded-lg border transition ${
                            ad.isActive
                              ? 'border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                              : 'border-zinc-300 text-zinc-400 hover:bg-zinc-200'
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(ad)}
                          title="Edit Ad"
                          className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ad.id)}
                          title="Delete Ad"
                          className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
