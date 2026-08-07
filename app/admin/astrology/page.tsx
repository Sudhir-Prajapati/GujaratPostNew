'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Save, CheckCircle, RefreshCw, AlertCircle, Eye, Moon, ShieldCheck, Award } from 'lucide-react';
import { getPublicAstrology, updateAdminAstrologySign } from '@/lib/api';
import { ZodiacIcon, GUJARAT_ZODIAC_LETTERS } from '@/components/ui/ZodiacIcon';
import ZodiacDetailModal, { ZODIAC_DETAILED_PREDICTIONS, NUMEROLOGY_DATA } from '@/components/sections/ZodiacDetailModal';

const ALL_SIGNS = [
  { id: 'aries', name: 'Aries', nameGu: 'મેષ' },
  { id: 'taurus', name: 'Taurus', nameGu: 'વૃષભ' },
  { id: 'gemini', name: 'Gemini', nameGu: 'મિથુન' },
  { id: 'cancer', name: 'Cancer', nameGu: 'કર્ક' },
  { id: 'leo', name: 'Leo', nameGu: 'સિંહ' },
  { id: 'virgo', name: 'Virgo', nameGu: 'કન્યા' },
  { id: 'libra', name: 'Libra', nameGu: 'તુલા' },
  { id: 'scorpio', name: 'Scorpio', nameGu: 'વૃશ્ચિક' },
  { id: 'sagittarius', name: 'Sagittarius', nameGu: 'ધનુ' },
  { id: 'capricorn', name: 'Capricorn', nameGu: 'મકર' },
  { id: 'aquarius', name: 'Aquarius', nameGu: 'કુંભ' },
  { id: 'pisces', name: 'Pisces', nameGu: 'મીન' },
];

const buildDefaultSignDetails = (signId: string) => {
  const staticDetail = ZODIAC_DETAILED_PREDICTIONS[signId] || ZODIAC_DETAILED_PREDICTIONS.aries;
  return {
    moonSign: {
      positive: staticDetail.moonSign.positive,
      negative: staticDetail.moonSign.negative,
      business: staticDetail.moonSign.business,
      love: staticDetail.moonSign.love,
      health: staticDetail.moonSign.health,
      luckyColor: staticDetail.moonSign.luckyColor,
      luckyNumber: staticDetail.moonSign.luckyNumber,
    },
    tarot: {
      cardName: staticDetail.tarot.cardName,
      description: staticDetail.tarot.description,
      career: staticDetail.tarot.career,
      love: staticDetail.tarot.love,
      health: staticDetail.tarot.health,
      luckyColor: staticDetail.tarot.luckyColor,
      luckyNumber: staticDetail.tarot.luckyNumber,
      astrologer: 'ડૉ. બબીના',
    },
    numerology: {
      1: { ...(NUMEROLOGY_DATA[1] || {}) },
      2: { ...(NUMEROLOGY_DATA[2] || {}) },
      3: { ...(NUMEROLOGY_DATA[3] || {}) },
      4: { ...(NUMEROLOGY_DATA[4] || {}) },
      5: { ...(NUMEROLOGY_DATA[5] || {}) },
      6: { ...(NUMEROLOGY_DATA[6] || {}) },
      7: { ...(NUMEROLOGY_DATA[7] || {}) },
      8: { ...(NUMEROLOGY_DATA[8] || {}) },
      9: { ...(NUMEROLOGY_DATA[9] || {}) },
    },
  };
};

export default function AdminAstrologyPage() {
  const [signsData, setSignsData] = useState<Record<string, any>>({});
  const [selectedSignId, setSelectedSignId] = useState<string>('aries');
  const [activeSectionTab, setActiveSectionTab] = useState<'moon' | 'tarot' | 'numerology'>('moon');
  const [selectedNumTab, setSelectedNumTab] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewSign, setPreviewSign] = useState<any | null>(null);

  const fetchSigns = async () => {
    setLoading(true);
    try {
      const res = await getPublicAstrology();
      const initialMap: Record<string, any> = {};

      ALL_SIGNS.forEach((s) => {
        const defaults = buildDefaultSignDetails(s.id);
        initialMap[s.id] = {
          id: s.id,
          slug: s.id,
          name: s.name,
          nameGu: s.nameGu,
          prediction: 'Your energy levels will be high today.',
          predictionGu: defaults.moonSign.positive,
          details: defaults,
        };
      });

      if (Array.isArray(res) && res.length > 0) {
        res.forEach((item: any) => {
          const key = (item.slug || item.id || '').toLowerCase();
          let parsedDetails: any = null;

          if (item.detailsJson) {
            try {
              parsedDetails = typeof item.detailsJson === 'string' ? JSON.parse(item.detailsJson) : item.detailsJson;
            } catch (e) {}
          }

          if (initialMap[key]) {
            const defaults = buildDefaultSignDetails(key);
            initialMap[key] = {
              id: item.id || key,
              slug: key,
              name: item.name || initialMap[key].name,
              nameGu: item.nameGu || initialMap[key].nameGu,
              prediction: item.prediction || initialMap[key].prediction,
              predictionGu: item.predictionGu || initialMap[key].predictionGu,
              details: {
                moonSign: {
                  ...defaults.moonSign,
                  ...(parsedDetails?.moonSign || {}),
                },
                tarot: {
                  ...defaults.tarot,
                  ...(parsedDetails?.tarot || {}),
                },
                numerology: {
                  ...defaults.numerology,
                  ...(parsedDetails?.numerology || {}),
                },
              },
            };
          }
        });
      }

      setSignsData(initialMap);
    } catch (err: any) {
      console.error('Failed to load astrology signs:', err);
      setMessage({ type: 'error', text: 'Failed to load astrology signs from backend' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSigns();
  }, []);

  const updateNestedField = (signId: string, section: string, field: string, value: string, numIndex?: number) => {
    setSignsData((prev) => {
      const current = prev[signId] || {};
      const currentDetails = current.details || buildDefaultSignDetails(signId);

      if (section === 'main') {
        return {
          ...prev,
          [signId]: {
            ...current,
            [field]: value,
          },
        };
      }

      if (section === 'numerology' && numIndex) {
        const currentNumMap = currentDetails.numerology || {};
        const currentNumItem = currentNumMap[numIndex] || NUMEROLOGY_DATA[numIndex] || {};
        return {
          ...prev,
          [signId]: {
            ...current,
            details: {
              ...currentDetails,
              numerology: {
                ...currentNumMap,
                [numIndex]: {
                  ...currentNumItem,
                  [field]: value,
                },
              },
            },
          },
        };
      }

      const currentSection = currentDetails[section] || {};
      return {
        ...prev,
        [signId]: {
          ...current,
          details: {
            ...currentDetails,
            [section]: {
              ...currentSection,
              [field]: value,
            },
          },
        },
      };
    });
  };

  const handleSaveSingle = async (signId: string) => {
    const target = signsData[signId];
    if (!target) return;

    setSavingId(signId);
    setMessage(null);

    try {
      const res = await updateAdminAstrologySign(target.id || target.slug, {
        predictionGu: target.details?.moonSign?.positive || target.predictionGu,
        prediction: target.prediction,
        nameGu: target.nameGu,
        details: target.details,
      } as any);

      if (res?.success) {
        setMessage({ type: 'success', text: `✅ Updated ${target.nameGu} (${target.name}) forecast successfully!` });
      } else {
        setMessage({ type: 'error', text: res?.message || 'Failed to save prediction' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Network error updating prediction' });
    } finally {
      setSavingId(null);
    }
  };

  const currentSign = signsData[selectedSignId] || {
    id: selectedSignId,
    slug: selectedSignId,
    name: ALL_SIGNS.find((s) => s.id === selectedSignId)?.name || '',
    nameGu: ALL_SIGNS.find((s) => s.id === selectedSignId)?.nameGu || '',
    predictionGu: '',
    details: buildDefaultSignDetails(selectedSignId),
  };

  const details = currentSign.details || buildDefaultSignDetails(selectedSignId);
  const moonSign = details.moonSign || buildDefaultSignDetails(selectedSignId).moonSign;
  const tarot = details.tarot || buildDefaultSignDetails(selectedSignId).tarot;
  const numerologyMap = details.numerology || buildDefaultSignDetails(selectedSignId).numerology;
  const currentNumData = numerologyMap[selectedNumTab] || NUMEROLOGY_DATA[selectedNumTab] || {};

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
              Astrology & Rashifal Management (રાશિફળ સંચાલન)
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
            Edit Moon Sign, Tarot, and Numerology sections for all 12 Zodiac signs dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSigns}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`flex items-center justify-between p-4 rounded-xl text-xs sm:text-sm font-bold shadow-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
          <button type="button" onClick={() => setMessage(null)} className="text-xs opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* 12 Signs Navigation Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
        {ALL_SIGNS.map((s) => {
          const isSelected = selectedSignId === s.id;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSignId(s.id)}
              className={`flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer text-center ${
                isSelected
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-md scale-105 ring-2 ring-amber-500/20'
                  : 'bg-card border-border/80 hover:bg-muted/50 hover:border-amber-400/50'
              }`}
            >
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-amber-100/60 dark:bg-amber-950/60 p-1 mb-1.5 overflow-hidden">
                <ZodiacIcon id={s.id} className="h-10 w-10 object-contain m-auto" />
              </div>
              <span className="text-xs sm:text-sm font-black text-foreground">{s.nameGu}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Selected Sign Editor Box */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card border border-border/80 rounded-2xl">
          <RefreshCw className="h-8 w-8 text-amber-500 animate-spin mb-2" />
          <p className="text-sm font-extrabold text-muted-foreground">Loading zodiac predictions from server...</p>
        </div>
      ) : (
        <div className="w-full">
          {/* Main Sign Form Editor */}
          <div className="w-full bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/60 shadow-md p-1.5">
                  <ZodiacIcon id={selectedSignId} className="h-11 w-11 object-contain m-auto" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground">
                    {currentSign.nameGu} | {currentSign.name}
                  </h2>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {GUJARAT_ZODIAC_LETTERS[selectedSignId] || ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewSign(currentSign)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview User Modal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveSingle(selectedSignId)}
                  disabled={savingId === selectedSignId}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#B3121B] hover:bg-[#8e0e15] text-white text-xs sm:text-sm font-black shadow-md transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{savingId === selectedSignId ? 'Saving...' : `Save ${currentSign.nameGu}`}</span>
                </button>
              </div>
            </div>

            {/* Section Selection Tabs */}
            <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveSectionTab('moon')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeSectionTab === 'moon'
                    ? 'bg-[#B3121B] text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>1. ચંદ્રરાશિ પ્રમાણે (Moon Sign)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSectionTab('tarot')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeSectionTab === 'tarot'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>2. ટેરો રાશિફળ (Tarot)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSectionTab('numerology')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                  activeSectionTab === 'numerology'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>3. અંક ભવિષ્યફળ (Numerology)</span>
              </button>
            </div>

            {/* Tab 1: ચંદ્રરાશિ પ્રમાણે Form */}
            {activeSectionTab === 'moon' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase">પોઝિટિવ- (Positive Aspect)</label>
                  <textarea
                    rows={2}
                    value={moonSign.positive || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'moonSign', 'positive', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase">નેગેટિવ- (Negative Aspect)</label>
                  <textarea
                    rows={2}
                    value={moonSign.negative || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'moonSign', 'negative', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase">વ્યવસાય- (Business & Career)</label>
                  <textarea
                    rows={2}
                    value={moonSign.business || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'moonSign', 'business', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase">લવ- (Love & Relationships)</label>
                  <textarea
                    rows={2}
                    value={moonSign.love || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'moonSign', 'love', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase">સ્વાસ્થ્ય- (Health & Fitness)</label>
                  <textarea
                    rows={2}
                    value={moonSign.health || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'moonSign', 'health', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-foreground uppercase">લકી કલર- (Lucky Color)</label>
                    <input
                      type="text"
                      value={moonSign.luckyColor || ''}
                      onChange={(e) => updateNestedField(selectedSignId, 'moonSign', 'luckyColor', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-foreground uppercase">લકી નંબર- (Lucky Number)</label>
                    <input
                      type="text"
                      value={moonSign.luckyNumber || ''}
                      onChange={(e) => updateNestedField(selectedSignId, 'moonSign', 'luckyNumber', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: ટેરો રાશિફળ Form */}
            {activeSectionTab === 'tarot' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase">કાર્ડ નામ (Card Name)</label>
                  <input
                    type="text"
                    value={tarot.cardName || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'tarot', 'cardName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-foreground uppercase">કાર્ડ વિગત (Tarot Description)</label>
                  <textarea
                    rows={2}
                    value={tarot.description || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'tarot', 'description', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase">કરિયર: (Tarot Career)</label>
                  <textarea
                    rows={2}
                    value={tarot.career || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'tarot', 'career', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase">લવ: (Tarot Love)</label>
                  <textarea
                    rows={2}
                    value={tarot.love || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'tarot', 'love', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase">સ્વાસ્થ્ય: (Tarot Health)</label>
                  <textarea
                    rows={2}
                    value={tarot.health || ''}
                    onChange={(e) => updateNestedField(selectedSignId, 'tarot', 'health', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-foreground uppercase">નસીબદાર રંગ- (Lucky Color)</label>
                    <input
                      type="text"
                      value={tarot.luckyColor || ''}
                      onChange={(e) => updateNestedField(selectedSignId, 'tarot', 'luckyColor', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-foreground uppercase">શુભ આંક- (Lucky Number)</label>
                    <input
                      type="text"
                      value={tarot.luckyNumber || ''}
                      onChange={(e) => updateNestedField(selectedSignId, 'tarot', 'luckyNumber', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: અંક ભવિષ્યફળ Form */}
            {activeSectionTab === 'numerology' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-400">
                    અંક પસંદ કરો (Select Number 1 to 9 to Edit)
                  </span>
                </div>

                {/* Number Pills 1 to 9 */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSelectedNumTab(num)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black transition cursor-pointer ${
                        selectedNumTab === num
                          ? 'bg-amber-500 text-white shadow-md scale-110'
                          : 'border border-border bg-background text-foreground hover:bg-amber-50 dark:hover:bg-amber-950/40'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 space-y-3">
                  <h4 className="text-sm font-black text-amber-800 dark:text-amber-300">
                    અંક - {selectedNumTab} ની વિગત સુધારો
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">અંક ભવિષ્યફળ અહેવાલ (Prediction)</label>
                    <textarea
                      rows={3}
                      value={currentNumData.prediction || ''}
                      onChange={(e) => updateNestedField(selectedSignId, 'numerology', 'prediction', e.target.value, selectedNumTab)}
                      placeholder="અંક ભવિષ્યફળ વિગત લખો..."
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">કરિયર (Career)</label>
                      <input
                        type="text"
                        value={currentNumData.career || ''}
                        onChange={(e) => updateNestedField(selectedSignId, 'numerology', 'career', e.target.value, selectedNumTab)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">લવ (Love)</label>
                      <input
                        type="text"
                        value={currentNumData.love || ''}
                        onChange={(e) => updateNestedField(selectedSignId, 'numerology', 'love', e.target.value, selectedNumTab)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">લકી નંબર (Lucky Numbers)</label>
                      <input
                        type="text"
                        value={currentNumData.luckyNum || ''}
                        onChange={(e) => updateNestedField(selectedSignId, 'numerology', 'luckyNum', e.target.value, selectedNumTab)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">લકી કલર (Lucky Color)</label>
                      <input
                        type="text"
                        value={currentNumData.luckyColor || ''}
                        onChange={(e) => updateNestedField(selectedSignId, 'numerology', 'luckyColor', e.target.value, selectedNumTab)}
                        className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-purple-700 dark:text-purple-300">શું કરવું (Remedy)</label>
                    <input
                      type="text"
                      value={currentNumData.remedy || ''}
                      onChange={(e) => updateNestedField(selectedSignId, 'numerology', 'remedy', e.target.value, selectedNumTab)}
                      placeholder="શ્રીરામ નામના જાપ કરો..."
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">આપના જન્માક્ષરવાળી હસ્તીઓ (Famous Personalities)</label>
                    <input
                      type="text"
                      value={currentNumData.celebrities || ''}
                      onChange={(e) => updateNestedField(selectedSignId, 'numerology', 'celebrities', e.target.value, selectedNumTab)}
                      placeholder="મુકેશ અંબાણી, રાહુલ ગાંધી..."
                      className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewSign && (
        <ZodiacDetailModal
          sign={previewSign}
          onClose={() => setPreviewSign(null)}
          language="gu"
        />
      )}
    </div>
  );
}
