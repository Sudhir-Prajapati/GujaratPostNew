'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save, Globe, Settings2, BarChart2, AlertCircle, Upload, UploadCloud, Link as LinkIcon, Sparkles, Quote, List, Heading, Type, Copy, Plus, Trash2, Image as ImageIcon, Video, Eye, X, ExternalLink } from 'lucide-react';
import { getBackendApiUrl, authFetch, getPublicArticles, clearApiCache } from '@/lib/api';
import CustomSelect from '@/components/ui/CustomSelect';
import RichTextArea from '@/components/ui/RichTextArea';

interface ArticleFormProps {
  articleId?: string; // If present, we are in Edit mode
}

interface CategoryData {
  id: string;
  name: string;
}

interface AuthorData {
  id: string;
  name: string;
}

// Ordered City / Location options: 1. National, 2. Gujarat State, 3. All Gujarat Cities, 4. Other States & Metros, 5. International
const LOCATION_OPTIONS = [
  // 1. National
  { value: 'National', label: 'National', sublabel: 'દેશ' },

  // 2. Gujarat State
  { value: 'Gujarat', label: 'Gujarat', sublabel: 'ગુજરાત' },

  // 3. All Gujarat Cities & Districts
  { value: 'Ahmedabad', label: 'Ahmedabad', sublabel: 'અમદાવાદ' },
  { value: 'Gandhinagar', label: 'Gandhinagar', sublabel: 'ગાંધીનગર' },
  { value: 'Surat', label: 'Surat', sublabel: 'સુરત' },
  { value: 'Vadodara', label: 'Vadodara', sublabel: 'વડોદરા' },
  { value: 'Rajkot', label: 'Rajkot', sublabel: 'રાજકોટ' },
  { value: 'Bhavnagar', label: 'Bhavnagar', sublabel: 'ભાવનગર' },
  { value: 'Jamnagar', label: 'Jamnagar', sublabel: 'જામનગર' },
  { value: 'Junagadh', label: 'Junagadh', sublabel: 'જૂનાગઢ' },
  { value: 'Kutch', label: 'Kutch / Bhuj', sublabel: 'કચ્છ' },
  { value: 'Anand', label: 'Anand', sublabel: 'આણંદ' },
  { value: 'Mehsana', label: 'Mehsana', sublabel: 'મહેસાણા' },
  { value: 'Morbi', label: 'Morbi', sublabel: 'મોરબી' },
  { value: 'Bharuch', label: 'Bharuch', sublabel: 'ભરૂચ' },
  { value: 'Navsari', label: 'Navsari', sublabel: 'નવસારી' },
  { value: 'Valsad', label: 'Valsad', sublabel: 'વલસાડ' },
  { value: 'Amreli', label: 'Amreli', sublabel: 'અમરેલી' },
  { value: 'Banaskantha', label: 'Banaskantha', sublabel: 'બનાસકાંઠા' },
  { value: 'Dahod', label: 'Dahod', sublabel: 'દાહોદ' },
  { value: 'Kheda', label: 'Kheda', sublabel: 'ખેડા' },
  { value: 'Narmada', label: 'Narmada', sublabel: 'નર્મદા' },
  { value: 'Panchmahal', label: 'Panchmahal', sublabel: 'પંચમહાલ' },
  { value: 'Patan', label: 'Patan', sublabel: 'પાટણ' },
  { value: 'Porbandar', label: 'Porbandar', sublabel: 'પોરબંદર' },
  { value: 'Sabarkantha', label: 'Sabarkantha', sublabel: 'સાબરકાંઠા' },
  { value: 'Surendranagar', label: 'Surendranagar', sublabel: 'સુરેન્દ્રનગર' },
  { value: 'Tapi', label: 'Tapi', sublabel: 'તાપી' },
  { value: 'Gir Somnath', label: 'Gir Somnath', sublabel: 'ગીર સોમનાથ' },
  { value: 'Botad', label: 'Botad', sublabel: 'બોટાદ' },
  { value: 'Aravalli', label: 'Aravalli', sublabel: 'અરવલ્લી' },
  { value: 'Chhota Udepur', label: 'Chhota Udepur', sublabel: 'છોટાઉદેપુર' },
  { value: 'Devbhoomi Dwarka', label: 'Devbhoomi Dwarka', sublabel: 'દેવભૂમિ દ્વારકા' },
  { value: 'Mahisagar', label: 'Mahisagar', sublabel: 'મહીસાગર' },

  // 4. Other Indian Metro Cities & States
  { value: 'Delhi', label: 'New Delhi', sublabel: 'નવી દિલ્હી' },
  { value: 'Mumbai', label: 'Mumbai', sublabel: 'મુંબઈ' },
  { value: 'Kolkata', label: 'Kolkata', sublabel: 'કોલકાતા' },
  { value: 'Chennai', label: 'Chennai', sublabel: 'ચેન્નઈ' },
  { value: 'Bangalore', label: 'Bangalore', sublabel: 'બેંગ્લોર' },
  { value: 'Hyderabad', label: 'Hyderabad', sublabel: 'હૈદ્રાબાદ' },
  { value: 'Pune', label: 'Pune', sublabel: 'પૂણે' },
  { value: 'Jaipur', label: 'Jaipur', sublabel: 'જયપુર' },
  { value: 'Maharashtra', label: 'Maharashtra', sublabel: 'મહારાષ્ટ્ર' },
  { value: 'Rajasthan', label: 'Rajasthan', sublabel: 'રાજસ્થાન' },
  { value: 'Uttar Pradesh', label: 'Uttar Pradesh', sublabel: 'ઉત્તર પ્રદેશ' },
  { value: 'Madhya Pradesh', label: 'Madhya Pradesh', sublabel: 'મધ્ય પ્રદેશ' },

  // 5. International Locations
  { value: 'International', label: 'International', sublabel: 'વિદેશ' },
  { value: 'USA', label: 'USA', sublabel: 'અમેરિકા' },
  { value: 'UK', label: 'UK', sublabel: 'બ્રિટન' },
  { value: 'Canada', label: 'Canada', sublabel: 'કેનેડા' },
  { value: 'Australia', label: 'Australia', sublabel: 'ઓસ્ટ્રેલિયા' },
  { value: 'UAE', label: 'UAE / Dubai', sublabel: 'દુબઈ' },
  { value: 'China', label: 'China', sublabel: 'ચીન' },
];

// Map categories to location group
const NATIONAL_CATEGORY_NAMES = ['national', 'india', 'politics', 'crime', 'education', 'health', 'sports', 'fact check', 'lifestyle', 'technology', 'weather', 'business', 'entertainment', 'defense', 'railway', 'election'];
const INTERNATIONAL_CATEGORY_NAMES = ['world', 'international', 'global', 'foreign'];
const GUJARAT_CATEGORY_NAMES = ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'gandhinagar', 'bhavnagar', 'jamnagar', 'kutch', 'junagadh', 'morbi', 'mehsana', 'anand'];

// Helper to transliterate Gujarati, Hindi, and English title into a clean URL-friendly English slug
function generateEnglishSlug(text: string): string {
  if (!text) return '';

  let str = text;

  // Dictionary for common Gujarati & Hindi locations/terms to standard English
  const wordMap: Record<string, string> = {
    'ગુજરાતમાં': 'gujarat',
    'ગુજરાત': 'gujarat',
    'અમદાવાદમાં': 'ahmedabad',
    'અમદાવાદ': 'ahmedabad',
    'સુરતમાં': 'surat',
    'સુરત': 'surat',
    'વડોદરામાં': 'vadodara',
    'વડોદરા': 'vadodara',
    'રાજકોટમાં': 'rajkot',
    'રાજકોટ': 'rajkot',
    'ગાંધીનગરમાં': 'gandhinagar',
    'ગાંધીનગર': 'gandhinagar',
    'ભાવનગરમાં': 'bhavnagar',
    'ભાવનગર': 'bhavnagar',
    'જામનગરમાં': 'jamnagar',
    'જામનગર': 'jamnagar',
    'જૂનાગઢમાં': 'junagadh',
    'જૂનાગઢ': 'junagadh',
    'કચ્છમાં': 'kutch',
    'કચ્છ': 'kutch',
    'આણંદમાં': 'anand',
    'આણંદ': 'anand',
    'મહેસાણામાં': 'mehsana',
    'મહેસાણા': 'mehsana',
    'મોરબીમાં': 'morbi',
    'મોરબી': 'morbi',
    'દિલ્હીમાં': 'delhi',
    'દિલ્હી': 'delhi',
    'મુંબઈમાં': 'mumbai',
    'મુંબઈ': 'mumbai',
    'ભારતમાં': 'india',
    'ભારત': 'india',
  };

  for (const [key, val] of Object.entries(wordMap)) {
    str = str.replace(new RegExp(key, 'g'), ` ${val} `);
  }

  // Indic character transliteration mapping (Gujarati & Hindi)
  const charMap: Record<string, string> = {
    // Vowels
    'અ': 'a', 'આ': 'a', 'ઇ': 'i', 'ઈ': 'i', 'ઉ': 'u', 'ઊ': 'u', 'ઋ': 'ri', 'એ': 'e', 'ઐ': 'ai', 'ઓ': 'o', 'ઔ': 'au',
    'अ': 'a', 'आ': 'a', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',

    // Matras (Vowel signs)
    'ા': 'a', 'િ': 'i', 'ી': 'i', 'ુ': 'u', 'ૂ': 'u', 'ૃ': 'ri', 'ે': 'e', 'ૈ': 'ai', 'ો': 'o', 'ૌ': 'au', 'ં': 'n', 'ઁ': 'n', 'ઃ': 'h',
    'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h',

    // Gujarati Consonants
    'ક': 'k', 'ખ': 'kh', 'ગ': 'g', 'ઘ': 'gh', 'ઙ': 'n',
    'ચ': 'ch', 'છ': 'chh', 'જ': 'j', 'ઝ': 'z', 'ઞ': 'n',
    'ટ': 't', 'ઠ': 'th', 'ડ': 'd', 'ઢ': 'dh', 'ણ': 'n',
    'ત': 't', 'થ': 'th', 'દ': 'd', 'ધ': 'dh', 'ન': 'n',
    'પ': 'p', 'ફ': 'f', 'બ': 'b', 'ભ': 'bh', 'મ': 'm',
    'ય': 'y', 'ર': 'r', 'લ': 'l', 'વ': 'v', 'શ': 'sh', 'ષ': 'sh', 'સ': 's', 'હ': 'h', 'ળ': 'l',

    // Hindi Consonants
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'z', 'ञ': 'n',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'f', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',

    // Digits
    '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4', '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4', '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  };

  let transliterated = '';
  for (const char of str) {
    transliterated += charMap[char] !== undefined ? charMap[char] : char;
  }

  return transliterated
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function ArticleForm({ articleId }: ArticleFormProps) {
  const router = useRouter();
  const isEditMode = !!articleId;

  // Loaders & Errors
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  // Selector choices
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [authors, setAuthors] = useState<AuthorData[]>([]);

  // Form tab selection
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'seo'>('content');
  const [contentLang, setContentLang] = useState<'en' | 'gu' | 'hi'>('gu');

  // Form Fields State
  const [slug, setSlug] = useState('');
  const [articleNumber, setArticleNumber] = useState<number | ''>('');

  // Multilingual Text
  const [title, setTitle] = useState('');
  const [titleGu, setTitleGu] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptGu, setExcerptGu] = useState('');
  const [excerptHi, setExcerptHi] = useState('');

  // Structured Article Sections (Matching Screenshot 2 layout)
  const [highlights, setHighlights] = useState('');
  const [highlightsGu, setHighlightsGu] = useState('');
  const [highlightsHi, setHighlightsHi] = useState('');

  const [desc1, setDesc1] = useState('');
  const [desc1Gu, setDesc1Gu] = useState('');
  const [desc1Hi, setDesc1Hi] = useState('');

  const [quoteText, setQuoteText] = useState('');
  const [quoteTextGu, setQuoteTextGu] = useState('');
  const [quoteTextHi, setQuoteTextHi] = useState('');

  const [quoteCite, setQuoteCite] = useState('');
  const [quoteCiteGu, setQuoteCiteGu] = useState('');
  const [quoteCiteHi, setQuoteCiteHi] = useState('');

interface ExtraImageSlot {
  id: string;
  url: string;
  mode: 'upload' | 'url';
  uploading: boolean;
}

  // Dynamic additional gallery photos (Photos 2 to 10 - Total max 10 photos including Featured Photo)
  const [extraImages, setExtraImages] = useState<ExtraImageSlot[]>([
    { id: 'slot-1', url: '', mode: 'upload', uploading: false },
    { id: 'slot-2', url: '', mode: 'upload', uploading: false },
  ]);

  const handleAddImageSlot = () => {
    if (extraImages.length >= 9) return; // 1 featured + 9 extra = max 10 total
    setExtraImages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), url: '', mode: 'upload', uploading: false },
    ]);
  };

  const handleRemoveImageSlot = (index: number) => {
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExtraImage = (index: number, updates: Partial<ExtraImageSlot>) => {
    setExtraImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };


interface ExtraDescriptionSlot {
  id: string;
  en: string;
  gu: string;
  hi: string;
}

  // Dynamic additional description/story sections (Description 2, Description 3, etc.)
  const [extraDescriptions, setExtraDescriptions] = useState<ExtraDescriptionSlot[]>([
    { id: 'desc-1', en: '', gu: '', hi: '' },
  ]);

  const handleAddDescriptionSlot = () => {
    if (extraDescriptions.length >= 4) return; // 1 main + 4 extra = 5 max descriptions
    setExtraDescriptions((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), en: '', gu: '', hi: '' },
    ]);
  };

  const handleRemoveDescriptionSlot = (index: number) => {
    setExtraDescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExtraDescription = (index: number, val: string) => {
    setExtraDescriptions((prev) => {
      const updated = [...prev];
      const slot = { ...updated[index] };
      if (contentLang === 'en') slot.en = val;
      else if (contentLang === 'gu') slot.gu = val;
      else if (contentLang === 'hi') slot.hi = val;
      updated[index] = slot;
      return updated;
    });
  };

  // Fallback unified content strings
  const [content, setContent] = useState('');
  const [contentGu, setContentGu] = useState('');
  const [contentHi, setContentHi] = useState('');

  // Settings
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [additionalCategoryIds, setAdditionalCategoryIds] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED'>('DRAFT');
  const [scheduledAt, setScheduledAt] = useState('');
  const [priority, setPriority] = useState(0);
  const [readingTime, setReadingTime] = useState(3);

  // Social Media & Video / PDF Embeds
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Helper: Format YouTube URL to Embed URL or ID
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return `https://www.youtube.com/embed/${trimmed}`;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return trimmed;
  };

  // Upload PDF document attachment
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingPdf(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await authFetch(getBackendApiUrl('/api/admin/upload'), {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Failed to upload PDF document.');

      setPdfUrl(json.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload PDF file.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Flags
  const [isTrending, setIsTrending] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [metaRobots, setMetaRobots] = useState('index, follow');

  // Tags (Stored as comma separated string in client, sent as object array to backend)
  const [tagsString, setTagsString] = useState('');

  // Live dynamic current local date-time string (YYYY-MM-THH:mm)
  const getCurrentLocalMinDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  // Default future local date-time (1 hour from now)
  const getFutureDefaultIso = () => {
    const nextHour = new Date(Date.now() + 3600000);
    return new Date(nextHour.getTime() - nextHour.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  // Live Article Preview Toggle State
  const [showLivePreview, setShowLivePreview] = useState(false);

  // Lock background body and html scroll when preview modal is open
  useEffect(() => {
    if (showLivePreview) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showLivePreview]);

  // Helper to insert formatting snippets into current content body
  const insertFormatting = (type: 'highlights' | 'fullTemplate' | 'quote' | 'heading' | 'subheading' | 'bold' | 'bullet') => {
    let snippet = '';
    if (type === 'highlights') {
      if (contentLang === 'gu') {
        snippet = '\n\n## 📌 એક નજરમાં (KEY HIGHLIGHTS)\n--------------------------------------------------\n• નરેન્દ્ર મોદી સ્ટેડિયમમાં આજે મહામુકાબલો, ટિકિટ માટે પડાપડી, મેદાન પર શાનદાર પ્રદર્શન.\n• ગુજરાત પોસ્ટની ખાસ રિપોર્ટ પ્રમાણે આ નિર્ણયથી સ્થાનિક લોકો, વેપાર અને વહીવટી વ્યવસ્થામાં સીધી અસર પડશે.\n• સ્થાનિક અધિકારીઓએ જણાવ્યું કે તાજેતરના નિર્ણય બાદ વિસ્તૃત આયોજન શરૂ કરી દેવામાં આવ્યું છે.\n--------------------------------------------------\n\n';
      } else if (contentLang === 'hi') {
        snippet = '\n\n## 📌 एक नजर में (KEY HIGHLIGHTS)\n--------------------------------------------------\n• नरेंद्र मोदी स्टेडियम में आज महामुकाबला, टिकटों के लिए मची मारामारी, मैदान पर शानदार प्रदर्शन।\n• गुजरात पोस्ट की विशेष रिपोर्ट के अनुसार इस फैसले से स्थानीय लोगों, कारोबार और प्रशासन पर सीधा असर पड़ेगा।\n• स्थानीय अधिकारियों ने बताया कि ताजा फैसले के बाद विस्तृत योजना पर काम शुरू कर दिया गया है।\n--------------------------------------------------\n\n';
      } else {
        snippet = '\n\n## 📌 AT A GLANCE (KEY HIGHLIGHTS)\n--------------------------------------------------\n• High-stakes match at Narendra Modi Stadium today, ticket rush, spectacular performance on field.\n• Gujarat Post special report explains how the decision impacts local residents, trade, and administration.\n• Officials confirm detailed planning and digital monitoring deployed following latest announcement.\n--------------------------------------------------\n\n';
      }
    } else if (type === 'fullTemplate') {
      if (contentLang === 'gu') {
        snippet = '## 📌 એક નજરમાં (KEY HIGHLIGHTS)\n--------------------------------------------------\n• નરેન્દ્ર મોદી સ્ટેડિયમમાં આજે મહામુકાબલો, ટિકિટ માટે પડાપડી, મેદાન પર શાનદાર પ્રદર્શન.\n• ગુજરાત પોસ્ટની ખાસ રિપોર્ટ પ્રમાણે આ નિર્ણયથી સ્થાનિક લોકો, વેપાર અને વહીવટી વ્યવસ્થામાં સીધી અસર પડશે.\n• સ્થાનિક અધિકારીઓએ જણાવ્યું કે તાજેતરના નિર્ણય બાદ વિસ્તૃત આયોજન શરૂ કરી દેવામાં આવ્યું છે.\n--------------------------------------------------\n\nસ્થાનિક અધિકારીઓએ જણાવ્યું કે તાજેતરના નિર્ણય બાદ વિસ્તૃત આયોજન શરૂ કરી દેવામાં આવ્યું છે. લોકો સુધી જરૂરી માહિતી ઝડપથી પહોંચે તે માટે અલગ ટીમો કાર્યરત છે.\n\n## 📌 વહીવટી આયોજન અને સુરક્ષા વ્યવસ્થા\n\nવિભાગો વચ્ચે સંકલન વધારવા માટે કંટ્રોલ રૂમ અને ડિજિટલ મોનિટરિંગ વ્યવસ્થા તૈયાર કરવામાં આવી છે. નાગરિકોને સત્તાવાર સૂચનાઓનું પાલન કરવામાં આવી રહ્યું છે.\n\n> "આ નિર્ણયથી ગુજરાતના વિકાસ, સુરક્ષા અને નાગરિક સુવિધાઓ માટે મહત્વપૂર્ણ પરિણામો મળશે."\n> — પોલીસ કમિશનર, અમદાવાદ\n\nવિશ્લેષકોના મતે આ પગલું લાંબા ગાળે ગુજરાતના વિકાસ, સુરક્ષા અને નાગરિક સુવિધાઓ માટે મહત્વપૂર્ણ સાબિત થઈ શકે છે.\n';
      } else if (contentLang === 'hi') {
        snippet = '## 📌 एक नजर में (KEY HIGHLIGHTS)\n--------------------------------------------------\n• नरेंद्र मोदी स्टेडियम में आज महामुकाबला, टिकटों के लिए मची मारामारी, मैदान पर शानदार प्रदर्शन।\n• गुजरात पोस्ट की विशेष रिपोर्ट के अनुसार इस फैसले से स्थानीय लोगों, कारोबार और प्रशासन पर सीधा असर पड़ेगा।\n• स्थानीय अधिकारियों ने बताया कि ताजा फैसले के बाद विस्तृत योजना पर काम शुरू कर दिया गया है।\n--------------------------------------------------\n\nस्थानीय अधिकारियों ने बताया कि ताजा फैसले के बाद विस्तृत योजना पर काम शुरू कर दिया गया है। लोगों तक जरूरी जानकारी तेजी से पहुंचाने के लिए अलग टीमें सक्रिय हैं.\n\n## 📌 प्रशासनिक योजना और सुरक्षा व्यवस्था\n\nविभागों के बीच समन्वय बढ़ाने के लिए नियंत्रण कक्ष और डिजिटल निगरानी व्यवस्था तैयार की गई है। नागरिकों से आधिकारिक निर्देशों का पालन करने का अनुरोध किया जा रहा है।\n\n> "इस निर्णय से गुजरात के विकास, सुरक्षा और नागरिक सुविधाओं पर दूरगामी प्रभाव पड़ेगा।"\n> — पुलिस आयुक्त, अहमदाबाद\n\nविश्लेषकों के अनुसार यह कदम लंबे समय में गुजरात के विकास, सुरक्षा और नागरिक सुविधाओं के लिए महत्वपूर्ण साबित हो सकता है।\n';
      } else {
        snippet = '## 📌 AT A GLANCE (KEY HIGHLIGHTS)\n--------------------------------------------------\n• High-stakes match at Narendra Modi Stadium today, ticket rush, spectacular performance on field.\n• Gujarat Post special report explains how the decision impacts local residents, trade, and administration.\n• Officials confirm detailed planning and digital monitoring deployed following latest announcement.\n--------------------------------------------------\n\nOfficials said detailed planning began soon after the latest decision. Dedicated teams are working to ensure timely public updates and smooth coordination between departments.\n\n## 📌 Key Coordination & Administrative Directives\n\nControl rooms and digital monitoring systems have been set up to enhance department coordination. Citizens are requested to follow official advisories.\n\n> "This decision will bring pivotal long-term benefits for infrastructure and civic growth."\n> — Police Commissioner, Ahmedabad\n\nAnalysts believe this move will prove crucial for Gujarat’s long-term growth, safety, and civic infrastructure.\n';
      }
    } else if (type === 'quote') {
      if (contentLang === 'gu') {
        snippet = '\n\n> "આ નિર્ણયથી ગુજરાતના વિકાસ, સુરક્ષા અને નાગરિક સુવિધાઓ માટે મહત્વપૂર્ણ પરિણામો મળશે."\n> — પોલીસ કમિશનર, અમદાવાદ\n\n';
      } else if (contentLang === 'hi') {
        snippet = '\n\n> "इस निर्णय से गुजरात के विकास, सुरक्षा और नागरिक सुविधाओं पर दूरगामी प्रभाव पड़ेगा।"\n> — पुलिस आयुक्त, अहमदाबाद\n\n';
      } else {
        snippet = '\n\n> "This decision will bring pivotal long-term benefits for infrastructure and civic growth."\n> — Police Commissioner, Ahmedabad\n\n';
      }
    } else if (type === 'heading') {
      snippet = '\n\n## 📌 ' + (contentLang === 'gu' ? 'મુખ્ય સંકલન અને નિયંત્રણ વ્યવસ્થા' : contentLang === 'hi' ? 'मुख्य समन्वय और नियंत्रण व्यवस्था' : 'Key Coordination & Control System') + '\n\n';
    } else if (type === 'subheading') {
      snippet = '\n\n### 🔹 ' + (contentLang === 'gu' ? 'વિભાગો વચ્ચે ડિજિટલ મોનિટરિંગ' : contentLang === 'hi' ? 'विभागों के बीच डिजिटल निगरानी' : 'Digital Monitoring Across Departments') + '\n\n';
    } else if (type === 'bold') {
      snippet = ' **' + (contentLang === 'gu' ? 'મહત્વપૂર્ણ મુદ્દો' : contentLang === 'hi' ? 'महत्वपूर्ण बिंदु' : 'Important Note') + '** ';
    } else if (type === 'bullet') {
      snippet = '\n• ' + (contentLang === 'gu' ? 'નાગરિકો માટે સત્તાવાર સૂચનાઓનું પાલન કરવું આવશ્યક' : contentLang === 'hi' ? 'नागरिकों के लिए आधिकारिक निर्देशों का पालन आवश्यक' : 'Compliance with official notifications mandatory') + '\n• ' + (contentLang === 'gu' ? 'કંટ્રોલ રૂમ દ્વારા સતત પરિસ્થિતિ પર નજર' : contentLang === 'hi' ? 'नियंत्रण कक्ष द्वारा निरंतर स्थिति पर नजर' : 'Control room monitoring situation continuously') + '\n';
    }

    if (contentLang === 'en') setContent((prev) => prev + snippet);
    else if (contentLang === 'gu') setContentGu((prev) => prev + snippet);
    else if (contentLang === 'hi') setContentHi((prev) => prev + snippet);
  };

  // Helper to compile separate section fields into full article body
  const compileStructuredContent = (
    hl: string,
    d1Str: string,
    qT: string,
    qC: string,
    extraDescList: string[],
    galleryImages: string[],
    lang: 'en' | 'gu' | 'hi'
  ) => {
    const parts: string[] = [];
    if (hl.trim()) {
      const header = lang === 'gu' ? '## 📌 એક નજરમાં (KEY HIGHLIGHTS)' : lang === 'hi' ? '## 📌 एक नजर में (KEY HIGHLIGHTS)' : '## 📌 AT A GLANCE (KEY HIGHLIGHTS)';
      parts.push(`${header}\n--------------------------------------------------\n${hl.trim()}\n--------------------------------------------------`);
    }
    if (d1Str.trim()) {
      parts.push(d1Str.trim());
    }
    // Save all gallery photos (Images 2..10) in structured content
    galleryImages.forEach((img, idx) => {
      if (img && img.trim()) {
        parts.push(`![Gallery Image ${idx + 2}](${img.trim()})`);
      }
    });
    if (qT.trim()) {
      const citeStr = qC.trim() ? `\n> — ${qC.trim()}` : '';
      parts.push(`> "${qT.trim()}"${citeStr}`);
    }
    extraDescList.forEach((desc) => {
      if (desc && desc.trim()) {
        parts.push(desc.trim());
      }
    });

    if (youtubeUrl && youtubeUrl.trim()) {
      const embed = getYouTubeEmbedUrl(youtubeUrl);
      if (embed) {
        parts.push(`<div class="my-4 aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md"><iframe src="${embed}" class="h-full w-full" allowfullscreen frameborder="0"></iframe></div>`);
      }
    }

    if (twitterUrl && twitterUrl.trim()) {
      parts.push(`<div class="my-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-white to-zinc-100/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans transition-all"><div class="flex items-center gap-3.5 min-w-0"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white text-base font-black shadow-sm">𝕏</span><div class="min-w-0"><span class="block text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white leading-tight truncate">View Post on X (Twitter)</span><span class="block text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Click to view official post</span></div></div><a href="${twitterUrl.trim()}" target="_blank" rel="noopener noreferrer" class="rounded-xl bg-black hover:bg-zinc-800 text-white font-extrabold px-5 py-2.5 text-xs transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 no-underline cursor-pointer" style="color: #ffffff !important; text-decoration: none !important;"><span style="color: #ffffff !important;">Open Tweet</span> <span style="color: #ffffff !important;">↗</span></a></div>`);
    }

    if (pdfUrl && pdfUrl.trim()) {
      parts.push(`<div class="my-6 rounded-2xl border border-red-200 dark:border-red-900/60 bg-gradient-to-r from-red-50 via-rose-50/40 to-red-50/80 dark:from-red-950/40 dark:via-red-950/20 dark:to-rose-950/30 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans transition-all"><div class="flex items-center gap-3.5 min-w-0"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white text-base shadow-sm">📄</span><div class="min-w-0"><span class="block text-sm sm:text-base font-extrabold text-red-950 dark:text-red-200 leading-tight truncate">Attached Official Document (PDF)</span><span class="block text-xs text-red-700/80 dark:text-red-300/80 font-medium mt-0.5">Verified Official Document</span></div></div><a href="${pdfUrl.trim()}" target="_blank" download class="rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 text-xs transition-all shadow-md shadow-red-600/25 shrink-0 flex items-center justify-center gap-2 no-underline cursor-pointer" style="color: #ffffff !important; text-decoration: none !important;"><span style="color: #ffffff !important;">Download PDF</span> <span style="color: #ffffff !important;">⬇</span></a></div>`);
    }

    return parts.join('\n\n');
  };

  // Helper to copy English draft into empty Gujarati and Hindi fields across all sections
  const copyDraftToTranslations = () => {
    if (!titleGu.trim()) setTitleGu(title);
    if (!titleHi.trim()) setTitleHi(title);
    if (!excerptGu.trim()) setExcerptGu(excerpt);
    if (!excerptHi.trim()) setExcerptHi(excerpt);

    if (!highlightsGu.trim()) setHighlightsGu(highlights);
    if (!highlightsHi.trim()) setHighlightsHi(highlights);

    if (!desc1Gu.trim()) setDesc1Gu(desc1);
    if (!desc1Hi.trim()) setDesc1Hi(desc1);

    if (!quoteTextGu.trim()) setQuoteTextGu(quoteText);
    if (!quoteTextHi.trim()) setQuoteTextHi(quoteText);

    if (!quoteCiteGu.trim()) setQuoteCiteGu(quoteCite);
    if (!quoteCiteHi.trim()) setQuoteCiteHi(quoteCite);

    setExtraDescriptions((prev) =>
      prev.map((slot) => ({
        ...slot,
        gu: slot.gu.trim() ? slot.gu : slot.en,
        hi: slot.hi.trim() ? slot.hi : slot.en,
      }))
    );

    if (!contentGu.trim()) setContentGu(content);
    if (!contentHi.trim()) setContentHi(content);
  };


  // Logged-in user state
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userAuthorId, setUserAuthorId] = useState<string | null>(null);
  const [userAuthorName, setUserAuthorName] = useState<string | null>(null);

  // Load initial choices (categories, authors & auth profile)
  useEffect(() => {
    async function loadSelectors() {
      try {
        const [catRes, autRes, meRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/authors'),
          fetch('/api/auth/me'),
        ]);
        const catJson = await catRes.json();
        const autJson = await autRes.json();
        const meJson = await meRes.json();

        if (catRes.ok) {
          const rawCats: any[] = catJson.data?.categories || catJson.data || [];
          setCategories(rawCats.filter((c) => !['shorts', 'videos', 'webstory', 'web-stories', 'podcasts'].includes(c.slug?.toLowerCase())));
        }
        if (autRes.ok) setAuthors(autJson.data?.authors || autJson.data || []);

        if (meRes.ok && meJson.data?.user) {
          const user = meJson.data.user;
          setUserRole(user.role);
          setUserAuthorId(user.authorId);
          setUserAuthorName(user.authorName);

          if (user.role === 'REPORTER' && user.authorId) {
            setAuthorId(user.authorId);
            setStatus('DRAFT');
          }
        }
      } catch (err) {
        console.error('Failed to load form selector choices', err);
      }
    }
    loadSelectors();
  }, []);

  // Parse body string into distinct sections (Highlights, Desc1, Images, Quote, Desc2)
  const parseBodyToSections = (raw: string) => {
    let hl = '';
    let d1Str = '';
    let qT = '';
    let qC = '';
    let d2Str = '';
    const extractedImgs: string[] = [];

    if (!raw) return { hl, d1Str, qT, qC, d2Str, extractedImgs };

    const galleryMatches = [...raw.matchAll(/!\[Gallery Image \d+\]\((https?:\/\/[^\s)]+|\/uploads\/[^\s)]+|\/assets\/[^\s)]+)\)/gi)];
    for (const match of galleryMatches) {
      if (match[1]) {
        extractedImgs.push(match[1]);
        raw = raw.replace(match[0], '');
      }
    }

    const paragraphs = raw.split(/\n\n+/);
    const d1Paras: string[] = [];
    const d2Paras: string[] = [];
    let pastQuote = false;

    for (const p of paragraphs) {
      const trimmed = p.trim();
      if (!trimmed) continue;

      if (
        trimmed.includes('📌') ||
        trimmed.includes('એક નજરમાં') ||
        trimmed.includes('एक नजर में') ||
        trimmed.includes('AT A GLANCE') ||
        trimmed.includes('KEY HIGHLIGHTS') ||
        trimmed.includes('HIGHLIGHTS')
      ) {
        const lines = trimmed
          .split('\n')
          .map((l) => l.trim())
          .filter(
            (l) =>
              l &&
              !l.startsWith('#') &&
              !l.startsWith('---') &&
              !l.startsWith('***') &&
              !l.includes('KEY HIGHLIGHTS') &&
              !l.includes('એક નજરમાં') &&
              !l.includes('एक नजर में') &&
              !l.includes('AT A GLANCE')
          );
        if (lines.length > 0) {
          hl = lines.join('\n');
        }
      } else if (trimmed.startsWith('> ')) {
        const lines = trimmed.split('\n');
        const quoteLines = lines.filter((l) => l.startsWith('> "') || l.startsWith('>"') || (l.startsWith('> ') && !l.startsWith('> —') && !l.startsWith('> -')));
        const citeLine = lines.find((l) => l.includes('> —') || l.includes('> -'));
        qT = quoteLines.map((l) => l.replace(/^>\s*"?/, '').replace(/"?$/, '')).join('\n');
        if (citeLine) {
          qC = citeLine.replace(/^>\s*—\s*/, '').replace(/^>\s*-\s*/, '').trim();
        }
        pastQuote = true;
      } else if (!trimmed.startsWith('---') && !trimmed.startsWith('***')) {
        if (!pastQuote) {
          d1Paras.push(trimmed);
        } else {
          d2Paras.push(trimmed);
        }
      }
    }

    d1Str = d1Paras.join('\n\n');

    if (!d1Str && !hl && !qT && d2Paras.length === 0) {
      d1Str = raw.trim();
    }

    return { hl, d1Str, qT, qC, extractedDescs: d2Paras, extractedImgs };
  };

  // Load article values if in edit mode
  useEffect(() => {
    if (!isEditMode || !articleId) return;

    async function loadArticle() {
      try {
        setFetching(true);
        const res = await authFetch(getBackendApiUrl(`/api/admin/articles/${articleId}`));
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load article.');

        const art = json.data?.article || json.data;

        // Enforce reporter permissions: they can only edit their own articles
        if (userRole === 'REPORTER' && userAuthorId && art.authorId !== userAuthorId) {
          setError('Forbidden: You are not authorized to edit other authors\' articles.');
          setFetching(false);
          return;
        }

        const primaryTitle = art.title || art.titleGu || art.titleHi || '';
        const primaryExcerpt = art.excerpt || art.excerptGu || art.excerptHi || '';
        const primaryContent = art.content || art.contentGu || art.contentHi || '';

        setSlug(art.slug || '');
        setArticleNumber(art.articleNumber ?? '');
        setTitle(art.title || primaryTitle);
        setTitleGu(art.titleGu || primaryTitle);
        setTitleHi(art.titleHi || primaryTitle);

        setExcerpt(art.excerpt || primaryExcerpt);
        setExcerptGu(art.excerptGu || primaryExcerpt);
        setExcerptHi(art.excerptHi || primaryExcerpt);

        setContent(art.content || primaryContent);
        setContentGu(art.contentGu || primaryContent);
        setContentHi(art.contentHi || primaryContent);

        // Auto select language tab if article was authored in Gujarati or Hindi
        if (art.titleGu && !art.title) {
          setContentLang('gu');
        } else if (art.titleHi && !art.title) {
          setContentLang('hi');
        }

        // Parse content into distinct section fields
        const parsedEn = parseBodyToSections(art.content || primaryContent);
        setHighlights(art.highlights || parsedEn.hl || '');
        setDesc1(parsedEn.d1Str || '');
        setQuoteText(parsedEn.qT || '');
        setQuoteCite(parsedEn.qC || '');

        const parsedGu = parseBodyToSections(art.contentGu || primaryContent);
        setHighlightsGu(art.highlightsGu || parsedGu.hl || art.highlights || parsedEn.hl || '');
        setDesc1Gu(parsedGu.d1Str || parsedEn.d1Str || '');
        setQuoteTextGu(parsedGu.qT || parsedEn.qT || '');
        setQuoteCiteGu(parsedGu.qC || parsedEn.qC || '');

        const parsedHi = parseBodyToSections(art.contentHi || primaryContent);
        setHighlightsHi(art.highlightsHi || parsedHi.hl || art.highlights || parsedEn.hl || '');
        setDesc1Hi(parsedHi.d1Str || parsedEn.d1Str || '');
        setQuoteTextHi(parsedHi.qT || parsedEn.qT || '');
        setQuoteCiteHi(parsedHi.qC || parsedEn.qC || '');

        // Populate dynamic extra descriptions
        const enDescs = (parsedEn.extractedDescs && parsedEn.extractedDescs.length > 0) ? parsedEn.extractedDescs : (art.desc2 ? [art.desc2] : []);
        const guDescs = (parsedGu.extractedDescs && parsedGu.extractedDescs.length > 0) ? parsedGu.extractedDescs : (art.desc2Gu ? [art.desc2Gu] : []);
        const hiDescs = (parsedHi.extractedDescs && parsedHi.extractedDescs.length > 0) ? parsedHi.extractedDescs : (art.desc2Hi ? [art.desc2Hi] : []);

        const maxDescLength = Math.max(enDescs.length, guDescs.length, hiDescs.length, 1);
        const loadedDescs: ExtraDescriptionSlot[] = [];

        for (let i = 0; i < maxDescLength; i++) {
          loadedDescs.push({
            id: `desc-${i}`,
            en: enDescs[i] || '',
            gu: guDescs[i] || enDescs[i] || '',
            hi: hiDescs[i] || enDescs[i] || '',
          });
        }
        setExtraDescriptions(loadedDescs);

        // Populate optional gallery photos (Images 2..10) from article property or parsed markdown
        const allExtractedImgs = [
          art.image2 || art.galleryImage2 || art.secondaryImage,
          art.image3,
          art.image4,
          art.image5,
          art.image6,
          art.image7,
          art.image8,
          art.image9,
          art.image10,
          ...(parsedEn.extractedImgs || []),
          ...(parsedGu.extractedImgs || []),
          ...(parsedHi.extractedImgs || []),
        ].filter(Boolean) as string[];

        const uniqueExtraUrls = Array.from(new Set(allExtractedImgs)).filter((u) => u !== art.featuredImage);

        const loadedExtra: ExtraImageSlot[] = uniqueExtraUrls.slice(0, 9).map((url, idx) => ({
          id: `loaded-${idx}`,
          url,
          mode: url.startsWith('http://') || url.startsWith('https://') ? 'url' : 'upload',
          uploading: false,
        }));

        while (loadedExtra.length < 2) {
          loadedExtra.push({
            id: `default-${loadedExtra.length}`,
            url: '',
            mode: 'upload',
            uploading: false,
          });
        }
        setExtraImages(loadedExtra);

        setFeaturedImage(art.featuredImage || '');
        if (art.featuredImage && (art.featuredImage.startsWith('http://') || art.featuredImage.startsWith('https://'))) {
          setImageMode('url');
        } else {
          setImageMode('upload');
        }
        setYoutubeUrl(art.youtubeUrl || art.youtube || '');
        setTwitterUrl(art.twitterUrl || art.twitter || '');
        setPdfUrl(art.pdfUrl || art.pdf || '');
        setCategoryId(art.categoryId || art.category?.id || '');
        setLocation(art.location || '');
        setAuthorId(art.authorId || art.author?.id || '');
        setStatus(art.status || 'PUBLISHED');
        const rawSched = art.scheduledAt || (art.status === 'SCHEDULED' ? art.publishedAt : null);
        if (rawSched) {
          const d = new Date(rawSched);
          if (!isNaN(d.getTime())) {
            const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            setScheduledAt(localIso);
          } else {
            setScheduledAt('');
          }
        } else {
          setScheduledAt('');
        }
        setPriority(art.priority || 0);
        setReadingTime(art.readingTime || 3);
        setIsTrending(art.isTrending || false);
        setIsBreaking(art.isBreaking || false);
        setIsFeatured(art.isFeatured || false);

        setSeoTitle(art.seoTitle || '');
        setSeoDescription(art.seoDescription || '');
        setSeoKeywords(art.seoKeywords || '');
        setCanonicalUrl(art.canonicalUrl || '');
        setMetaRobots(art.metaRobots || 'index, follow');

        if (art.tags && art.tags.length > 0) {
          const names = art.tags
            .map((t: any) => (t.tag?.name || t.name || '').trim())
            .filter((name: string) => name.length > 0);
          setTagsString(names.join(', '));

          // Match tag names to category IDs for additional categories selection
          const loadedAddCats = categories
            .filter((c) => names.some((n: string) => n.toLowerCase() === c.name.toLowerCase()))
            .map((c) => c.id);
          setAdditionalCategoryIds(loadedAddCats);
        } else {
          setTagsString('');
          setAdditionalCategoryIds([]);
        }
      } catch (err: any) {
        console.error('Error loading article in edit mode:', err);
        setError(err.message);
      } finally {
        setFetching(false);
      }
    }
    loadArticle();
  }, [articleId, isEditMode, userRole, userAuthorId]);

  // Auto-fetch next available article number when creating a new article
  useEffect(() => {
    if (isEditMode) return;
    getPublicArticles({ limit: 1 })
      .then((res) => {
        if (res?.articles && res.articles.length > 0) {
          const topArt = res.articles[0];
          const nextNum = (topArt.articleNumber ?? 0) + 1;
          setArticleNumber(nextNum);
        } else {
          setArticleNumber(1001);
        }
      })
      .catch(() => {
        setArticleNumber(1001);
      });
  }, [isEditMode]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await authFetch(getBackendApiUrl('/api/admin/upload'), {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Failed to upload media file.');

      const mediaUrl = json.url || json.data?.url || (json.file ? json.file.url : '');
      if (mediaUrl) {
        setFeaturedImage(mediaUrl);
      } else {
        throw new Error('No media URL returned by server.');
      }
    } catch (err: any) {
      console.error('Media upload error:', err);
      setError(err.message || 'Failed to upload image/video from your computer.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const safeTitle = (title || '').trim();
    const safeTitleGu = (titleGu || '').trim();
    const safeTitleHi = (titleHi || '').trim();
    const safeSlug = (slug || '').trim();
    const safeCategory = (categoryId || '').trim();
    const safeAuthor = (authorId || '').trim();
    const safeFeaturedImage = (featuredImage || '').trim();

    const effectiveTitle = safeTitle || safeTitleGu || safeTitleHi;
    const effectiveExcerpt = (excerpt || excerptGu || excerptHi || 'Gujarat Post news flash.').trim();
    const finalFeaturedImage = safeFeaturedImage || '/assets/demo/1.jpg';

    const effectiveHighlights = (highlights || highlightsGu || highlightsHi || '').trim();
    const effectiveD1 = (desc1 || desc1Gu || desc1Hi || content || '').trim();
    const effectiveQuoteText = (quoteText || quoteTextGu || quoteTextHi || '').trim();
    const effectiveQuoteCite = (quoteCite || quoteCiteGu || quoteCiteHi || '').trim();
    const effectiveD2 = extraDescriptions.length > 0 ? (extraDescriptions[0].en || extraDescriptions[0].gu || extraDescriptions[0].hi || '').trim() : '';

    // Granular Validation with explicit field names
    const missingFields: string[] = [];
    if (!effectiveTitle) missingFields.push('Title');
    if (!safeSlug) missingFields.push('News Name (Slug)');
    if (!safeCategory) missingFields.push('Category');
    if (!safeAuthor) missingFields.push('Author');

    if (missingFields.length > 0) {
      setError(`Please fill in the required setting: ${missingFields.join(', ')}.`);
      setLoading(false);
      return;
    }

    if (status === 'SCHEDULED') {
      if (!scheduledAt) {
        setError('Please select a Scheduled Publish Date & Time.');
        setLoading(false);
        return;
      }
      const schedTime = new Date(scheduledAt).getTime();
      if (isNaN(schedTime) || schedTime <= Date.now()) {
        setError('Scheduled publish date & time must be set in the future (later than current time).');
        setLoading(false);
        return;
      }
    }

    // Compile distinct input sections into complete article content strings
    const galleryPayload = extraImages.map((slot) => slot.url.trim()).filter(Boolean);
    const extraDescEn = extraDescriptions.map((item) => item.en.trim()).filter(Boolean);
    const extraDescGu = extraDescriptions.map((item) => item.gu.trim() || item.en.trim()).filter(Boolean);
    const extraDescHi = extraDescriptions.map((item) => item.hi.trim() || item.en.trim()).filter(Boolean);

    const compiledEn = compileStructuredContent(highlights.trim() || effectiveHighlights, desc1.trim() || effectiveD1, quoteText.trim() || effectiveQuoteText, quoteCite.trim() || effectiveQuoteCite, extraDescEn, galleryPayload, 'en');
    const compiledGu = compileStructuredContent(highlightsGu.trim() || effectiveHighlights, desc1Gu.trim() || effectiveD1, quoteTextGu.trim() || effectiveQuoteText, quoteCiteGu.trim() || effectiveQuoteCite, extraDescGu, galleryPayload, 'gu');
    const compiledHi = compileStructuredContent(highlightsHi.trim() || effectiveHighlights, desc1Hi.trim() || effectiveD1, quoteTextHi.trim() || effectiveQuoteText, quoteCiteHi.trim() || effectiveQuoteCite, extraDescHi, galleryPayload, 'hi');


    // Combine explicit tagsString tags and additional category names as tags
    const additionalCatNames = additionalCategoryIds
      .map((id) => categories.find((c) => c.id === id)?.name)
      .filter((n): n is string => Boolean(n));

    const combinedTagNames = Array.from(
      new Set([
        ...tagsString.split(',').map((t) => t.trim()).filter((t) => t.length > 0),
        ...additionalCatNames,
      ])
    );

    const tags = combinedTagNames.map((name) => ({ name }));

    const payload = {
      slug: safeSlug,
      articleNumber: isEditMode && articleNumber !== '' ? Number(articleNumber) : undefined,
      title: safeTitle || effectiveTitle,
      titleGu: safeTitleGu || effectiveTitle,
      titleHi: safeTitleHi || effectiveTitle,
      excerpt: (excerpt || '').trim() || effectiveExcerpt,
      excerptGu: (excerptGu || '').trim() || effectiveExcerpt,
      excerptHi: (excerptHi || '').trim() || effectiveExcerpt,
      content: compiledEn,
      contentGu: compiledGu,
      contentHi: compiledHi,
      featuredImage: finalFeaturedImage,
      thumbnail: finalFeaturedImage,
      image2: galleryPayload[0] || '',
      image3: galleryPayload[1] || '',
      image4: galleryPayload[2] || '',
      image5: galleryPayload[3] || '',
      image6: galleryPayload[4] || '',
      image7: galleryPayload[5] || '',
      image8: galleryPayload[6] || '',
      image9: galleryPayload[7] || '',
      image10: galleryPayload[8] || '',
      galleryImages: galleryPayload,
      categoryId,
      youtubeUrl: youtubeUrl.trim() || undefined,
      twitterUrl: twitterUrl.trim() || undefined,
      pdfUrl: pdfUrl.trim() || undefined,
      location: location || null,
      authorId,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      priority: Number(priority),
      readingTime: Number(readingTime),
      isTrending,
      isBreaking,
      isFeatured,
      isPublished: status === 'PUBLISHED',
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      seoKeywords: seoKeywords.trim() || undefined,
      canonicalUrl: canonicalUrl.trim() || undefined,
      metaRobots: metaRobots.trim() || undefined,
      tags,
    };

    try {
      const url = isEditMode ? getBackendApiUrl(`/api/admin/articles/${articleId}`) : getBackendApiUrl('/api/admin/articles');
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Failed to save article.');

      clearApiCache();
      fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: result.article?.slug || result.slug || slug }),
      }).catch(() => {});

      // Route back to list
      router.push('/admin/articles');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Dynamic button label helper based on publication status and edit mode
  const getSaveButtonLabel = () => {
    if (loading) {
      return status === 'DRAFT'
        ? 'Saving Draft...'
        : status === 'SCHEDULED'
        ? 'Scheduling...'
        : 'Publishing Article...';
    }

    if (isEditMode) {
      if (status === 'DRAFT') return 'Update Draft';
      if (status === 'SCHEDULED') return 'Update Scheduled Article';
      if (status === 'ARCHIVED') return 'Archive Article';
      return 'Update Published Article';
    }

    if (status === 'DRAFT') return 'Save Draft';
    if (status === 'SCHEDULED') return 'Schedule Article';
    if (status === 'ARCHIVED') return 'Save as Archived';
    return 'Save & Publish Article';
  };

  const handleCategorySelect = (val: string) => {
    setCategoryId(val);
    const selectedCat = categories.find((c) => c.id === val);
    if (selectedCat) {
      const catNameLower = selectedCat.name.trim().toLowerCase();

      // Auto-set location based on category type
      if (INTERNATIONAL_CATEGORY_NAMES.some((n) => catNameLower.includes(n))) {
        setLocation('International');
      } else if (NATIONAL_CATEGORY_NAMES.some((n) => catNameLower.includes(n) || catNameLower === n)) {
        setLocation('National');
      } else if (GUJARAT_CATEGORY_NAMES.some((n) => catNameLower.includes(n) || catNameLower === n)) {
        // Try to match exact city, else default to Gujarat
        const cityMatch = LOCATION_OPTIONS.find(
          (loc) => loc.value.toLowerCase() === catNameLower || catNameLower.includes(loc.value.toLowerCase())
        );
        setLocation(cityMatch ? cityMatch.value : 'Gujarat');
      } else {
        // No match — try direct match across all options
        const directMatch = LOCATION_OPTIONS.find(
          (loc) => loc.value.toLowerCase() === catNameLower || loc.label.toLowerCase() === catNameLower
        );
        if (directMatch) setLocation(directMatch.value);
      }
    }
  };


  const categoryOptions = useMemo(() => {
    const topTopics = [
      'gujarat',
      'politics',
      'business',
      'crime',
      'education',
      'entertainment',
      'health',
      'sports',
      'fact check',
      'lifestyle',
      'technology',
      'weather',
      'world',
    ];

    const getPriority = (name: string) => {
      const lower = name.toLowerCase().trim();
      const idx = topTopics.indexOf(lower);
      if (idx !== -1) return idx;
      return 999;
    };

    return [...categories]
      .sort((a, b) => {
        const pA = getPriority(a.name);
        const pB = getPriority(b.name);
        if (pA !== pB) return pA - pB;
        return a.name.localeCompare(b.name);
      })
      .map((cat) => ({ value: cat.id, label: cat.name }));
  }, [categories]);

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="mt-2 text-sm">Loading article details...</span>
      </div>
    );
  }

  const renderFormattedPreviewContent = (rawText: string) => {
    if (!rawText || !rawText.trim()) return null;
    let formatted = rawText
      // Convert markdown images ![alt](url) to HTML <img>
      .replace(/!\[(.*?)\]\((https?:\/\/[^\s)]+|\/uploads\/[^\s)]+|\/assets\/[^\s)]+)\)/gi, (match, alt, url) => {
        return `<figure class="my-4 space-y-1"><div class="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/5 dark:bg-black/40 shadow-sm"><img src="${url}" alt="${alt || 'Article Image'}" class="w-full h-full object-cover" /></div>${alt ? `<figcaption class="text-xs text-center text-zinc-500 italic">${alt}</figcaption>` : ''}</figure>`;
      })
      // Clean up multiple nested blockquotes created by browser formatting
      .replace(/(<blockquote[^>]*>\s*)+/gi, '<blockquote class="my-4 border-l-[3px] border-[#B3121B] pl-4 font-sans font-bold text-zinc-900 dark:text-white">')
      .replace(/(\s*<\/blockquote>)+/gi, '</blockquote>')
      // Convert plain URLs (not inside href="...") into clickable hyperlinks
      .replace(/(^|[\s>(])(https?:\/\/[^\s<"']+)/g, (match, prefix, url) => {
        return `${prefix}<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 font-bold underline hover:text-blue-800 break-all">${url}</a>`;
      });

    return (
      <div
        className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium [&_img]:rounded-xl [&_a]:text-blue-600 [&_a]:underline [&_a]:font-bold [&_figure]:my-4 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#B3121B] [&_blockquote]:pl-4 [&_blockquote]:my-3 [&_blockquote]:font-bold [&_blockquote]:not-italic [&_blockquote]:text-zinc-900 dark:[&_blockquote]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:list-item [&_li]:my-1"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-950/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? 'Edit Article' : 'New Article'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowLivePreview(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 transition-all hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 shadow-xs cursor-pointer"
          >
            <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Preview Article</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{getSaveButtonLabel()}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-950/20 dark:bg-red-950/10 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {/* Form Content Panel - Line-by-Line Flow */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">



        {/* LINE 1: News Name (In English / Slug) */}
        <div>
          <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300">
            News Name (In English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug || ''}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))}
            placeholder="e.g. flood-havoc-gujarat-30-deaths"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm font-mono text-zinc-800 focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-200"
            required
          />
          <p className="text-[11px] text-zinc-400 mt-1">Enter a short URL-friendly slug in English (e.g. flood-havoc-gujarat)</p>
        </div>
        {/* LINE 2: Title (*) / Headline */}
        <div>
          <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300">
            Title (*) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={(contentLang === 'gu' ? titleGu : contentLang === 'hi' ? titleHi : title) || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (contentLang === 'en') setTitle(val);
              else if (contentLang === 'gu') setTitleGu(val);
              else if (contentLang === 'hi') setTitleHi(val);
              setSlug(generateEnglishSlug(val));
            }}
            placeholder={
              contentLang === 'gu'
                ? 'ગુજરાતમાં પૂરનો કહેર: બે દિવસમાં 30 લોકોનાં મોત, અમદાવાદમાં 20 વર્ષમાં સૌથી વધુ વરસાદ નોંધાયો'
                : contentLang === 'hi'
                  ? 'गुजरात में बाढ़ का कहर: दो दिनों में 30 लोगों की मौत, अहमदाबाद में 20 वर्षों में सबसे अधिक बारिश'
                  : 'Enter main news article title...'
            }
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm font-bold text-zinc-900 focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
            required
          />
        </div>

        {/* LINE 3: Category (Topic) (*), City / Location, & Publish By (Author) (*) */}
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300 mb-1.5">
              Category (Topic) (*) <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              value={categoryId || ''}
              onChange={(val) => handleCategorySelect(val)}
              options={categoryOptions}
              placeholder="[Choose category]"
              required
              searchable
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300 mb-1.5 flex items-center justify-between">
              <span>City / Location</span>
              {(() => {
                const selectedCat = categories.find((c) => c.id === categoryId);
                const catNameLower = selectedCat?.name?.trim().toLowerCase() || '';
                if (INTERNATIONAL_CATEGORY_NAMES.some((n) => catNameLower.includes(n))) {
                  return <span className="text-[10px] text-blue-500 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">🌍 International</span>;
                } else if (NATIONAL_CATEGORY_NAMES.some((n) => catNameLower.includes(n) || catNameLower === n)) {
                  return <span className="text-[10px] text-orange-500 font-semibold bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">🇮🇳 National</span>;
                } else if (GUJARAT_CATEGORY_NAMES.some((n) => catNameLower.includes(n) || catNameLower === n)) {
                  return <span className="text-[10px] text-green-600 font-semibold bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">🏙️ Gujarat</span>;
                }
                return <span className="text-[10px] text-zinc-400 font-normal">Optional</span>;
              })()}
            </label>
            <CustomSelect
              value={location || ''}
              onChange={(val) => setLocation(val)}
              options={LOCATION_OPTIONS}
              placeholder="[Select City / Region]"
              searchable
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300 mb-1.5">
              Publish By (Author) (*) <span className="text-red-500">*</span>
            </label>
            {userRole === 'REPORTER' ? (
              <div className="w-full rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 px-4 py-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                {userAuthorName || 'Your Author Profile'}
              </div>
            ) : (
              <CustomSelect
                value={authorId || ''}
                onChange={(val) => setAuthorId(val)}
                options={authors.map((aut) => ({ value: aut.id, label: aut.name }))}
                placeholder="Select Author / Reporter"
                required
                searchable
              />
            )}
          </div>
        </div>

        {/* 🏷️ MULTIPLE CATEGORY CHECKBOX GRID (Like Old Website) */}
        <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-950/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300 flex items-center gap-2">
              <span>Category (*) [Select Multiple News Sections]</span>
              <span className="text-[10px] font-extrabold bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 px-2.5 py-0.5 rounded-full">
                {1 + additionalCategoryIds.filter(id => id !== categoryId).length} Selected
              </span>
            </label>
            <span className="text-[11px] text-zinc-500 font-medium">
              Check all news sections where this article should appear.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
            {categories.map((cat) => {
              const isPrimary = cat.id === categoryId;
              const isChecked = isPrimary || additionalCategoryIds.includes(cat.id);

              return (
                <label
                  key={cat.id}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'border-red-500 bg-red-50/80 text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300 shadow-2xs'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (isPrimary) {
                        // If unchecking primary, don't allow unchecking main category directly
                        return;
                      }
                      if (e.target.checked) {
                        setAdditionalCategoryIds((prev) => Array.from(new Set([...prev, cat.id])));
                      } else {
                        setAdditionalCategoryIds((prev) => prev.filter((id) => id !== cat.id));
                      }
                    }}
                    className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="truncate">{cat.name}</span>
                  {isPrimary && (
                    <span className="ml-auto text-[9px] font-black uppercase tracking-wider bg-red-600 text-white px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Placement Badges & Website Location Info */}
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2 dark:border-zinc-800">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Article Display Placement & Badges (તમારું આર્ટીકલ ક્યાં દેખાશે)</span>
            </span>
            <span className="text-[11px] font-medium text-zinc-400">Select where this article should appear on Gujarat Post homepage</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* BREAKING NEWS */}
            <label className={`flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
              isBreaking 
                ? 'border-amber-400 bg-amber-50/80 dark:border-amber-800/80 dark:bg-amber-950/30 shadow-sm' 
                : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-500 text-white font-black px-2 py-0.5 rounded text-[10px] tracking-wide shadow-sm">
                    ⚡ BREAKING NEWS
                  </span>
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Top Breaking Ticker Bar</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    Shows in red ticker bar at the top of homepage and adds urgent "તાજા સમાચાર" tag.
                  </p>
                </div>
              </div>
              <span className="mt-2 text-[10px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded w-fit">
                📍 Location: Header & Top Flashes
              </span>
            </label>

            {/* TRENDING STORY */}
            <label className={`flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
              isTrending 
                ? 'border-blue-400 bg-blue-50/80 dark:border-blue-800/80 dark:bg-blue-950/30 shadow-sm' 
                : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-600 text-white font-black px-2 py-0.5 rounded text-[10px] tracking-wide shadow-sm">
                    🔥 TRENDING STORY
                  </span>
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Trending Sidebar & List</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    Appears in "ટ્રેન્ડિંગ સમાચાર" sidebar widget and top read news lists across pages.
                  </p>
                </div>
              </div>
              <span className="mt-2 text-[10px] font-extrabold text-blue-700 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/60 px-2 py-0.5 rounded w-fit">
                📍 Location: Right Sidebar & Feed
              </span>
            </label>

            {/* FEATURED COVERAGE */}
            <label className={`flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
              isFeatured 
                ? 'border-emerald-400 bg-emerald-50/80 dark:border-emerald-800/80 dark:bg-emerald-950/30 shadow-sm' 
                : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-600 text-white font-black px-2 py-0.5 rounded text-[10px] tracking-wide shadow-sm">
                    ⭐ FEATURED COVERAGE
                  </span>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">Main Hero Grid Banner</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    Promotes article to main homepage Hero Big Banner cards and category top feature spots.
                  </p>
                </div>
              </div>
              <span className="mt-2 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded w-fit">
                📍 Location: Main Hero Grid
              </span>
            </label>
          </div>
        </div>
        <div>
          <RichTextArea
            label="Short Description / Subtitle Excerpt"
            value={(contentLang === 'gu' ? excerptGu : contentLang === 'hi' ? excerptHi : excerpt) || ''}
            onChange={(val) => {
              if (contentLang === 'en') setExcerpt(val);
              else if (contentLang === 'gu') setExcerptGu(val);
              else if (contentLang === 'hi') setExcerptHi(val);
            }}
            placeholder="Brief news hook overview summary..."
            rows={3}
          />
        </div>

        {/* 📌 DISTINCT SECTION 1: Highlights ("એક નજરમાં") / Key Points Box */}
        <div className="space-y-2 rounded-2xl border border-red-200 bg-red-50/30 p-4 dark:border-red-950/40 dark:bg-red-950/10">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-black text-red-700 uppercase tracking-wider dark:text-red-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-red-500" />
              <span>Highlights ("એક નજરમાં") / Key Points Box</span>
            </label>
            <button
              type="button"
              onClick={() => {
                const sample = contentLang === 'gu'
                  ? '• નરેન્દ્ર મોદી સ્ટેડિયમમાં આજે મહામુકાબલો, ટિકિટ માટે પડાપડી\n• ગુજરાત પોસ્ટ ખાસ રિપોર્ટ: સ્થાનિક લોકો અને વેપાર પર સીધી અસર\n• સ્થાનિક અધિકારીઓએ જણાવ્યું કે તાજેતરના નિર્ણય બાદ આયોજન શરૂ'
                  : contentLang === 'hi'
                    ? '• नरेंद्र मोदी स्टेडियम में आज महामुकाबला, टिकटों के लिए मची मारामारी\n• गुजरात पोस्ट विशेष रिपोर्ट: स्थानीय लोगों और कारोबार पर सीधा असर\n• अधिकारियों ने बताया कि ताजा फैसले के बाद योजना पर काम शुरू'
                    : '• High-stakes match at Narendra Modi Stadium today, ticket rush\n• Gujarat Post special report: Direct impact on local business and civic movement\n• Officials confirm detailed planning and digital monitoring initiated';
                if (contentLang === 'en') setHighlights(sample);
                else if (contentLang === 'gu') setHighlightsGu(sample);
                else if (contentLang === 'hi') setHighlightsHi(sample);
              }}
              className="text-[11px] font-bold text-red-600 hover:text-red-800 underline"
            >
              + Insert Sample Highlights
            </button>
          </div>
          <textarea
            value={(contentLang === 'gu' ? highlightsGu : contentLang === 'hi' ? highlightsHi : highlights) || ''}
            onChange={(e) => {
              if (contentLang === 'en') setHighlights(e.target.value);
              else if (contentLang === 'gu') setHighlightsGu(e.target.value);
              else if (contentLang === 'hi') setHighlightsHi(e.target.value);
            }}
            placeholder="• Enter bullet point 1 line by line&#10;• Enter bullet point 2&#10;• Enter bullet point 3"
            rows={4}
            className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm focus:border-red-500 focus:outline-none dark:border-red-950 dark:bg-zinc-900 font-medium text-zinc-900 dark:text-zinc-100"
          />
        </div>

        {/* 🖼️ DISTINCT SECTION 2: Upload Primary Featured Media (Photo / Video) [Size: 1100px X 541px] */}
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200/80 pb-3 dark:border-zinc-800 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-zinc-800 uppercase tracking-wider dark:text-zinc-200 flex items-center gap-1.5 flex-wrap">
                <Video className="h-4 w-4 text-red-600 shrink-0" />
                <span>Upload Primary Media (Featured Photo or Video)</span>
                <span className="text-[10px] text-zinc-400 font-medium normal-case">[Size: 1100px X 541px]</span>
                <span className="text-red-500 font-bold">*</span>
              </label>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Upload an Image or Video directly from your device (.jpg, .png, .webp, .mp4, .webm, .mov), or paste a direct media URL.
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800 shrink-0 w-fit">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${imageMode === 'upload'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload from Device</span>
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`text-xs font-extrabold px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${imageMode === 'url'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Media URL</span>
              </button>
            </div>
          </div>

          {imageMode === 'upload' ? (
            <div className="space-y-3">
              <div className="relative rounded-2xl border-2 border-dashed border-zinc-300 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900/60 text-center transition-all hover:border-red-500 hover:bg-red-50/20 dark:hover:border-red-500">
                <input
                  type="file"
                  id="primary-media-file-input"
                  accept="image/*,video/*,.mp4,.webm,.mov,.m4v,.avi,.jpg,.jpeg,.png,.webp,.gif"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                />
                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                      <span className="text-xs font-bold text-red-600">Uploading media from device to server...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          Click to browse or drag & drop Image or Video from your computer
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 font-medium">
                          Supports Photos (JPG, PNG, WebP) & Videos (MP4, WebM, MOV) up to 200MB
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs">
                        <UploadCloud className="h-4 w-4" />
                        <span>Choose Photo or Video from Device</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="url"
                value={featuredImage || ''}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Paste direct Image URL (https://images.unsplash.com/...) or Video URL (https://domain.com/video.mp4)"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs focus:border-red-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
              />
              <p className="text-[11px] text-zinc-400">
                You can paste direct web links to photos or MP4/WebM videos.
              </p>
            </div>
          )}

          {featuredImage && (
            <div className="space-y-2 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                  {featuredImage.match(/\.(mp4|webm|mov|m4v|avi)(\?.*)?$/i) || featuredImage.includes('/video/upload/') ? (
                    <>
                      <Video className="h-3.5 w-3.5 text-red-600" />
                      <span>📹 Attached Video Preview</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-3.5 w-3.5 text-red-600" />
                      <span>🖼️ Attached Photo Preview</span>
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setFeaturedImage('')}
                  className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Remove Media</span>
                </button>
              </div>

              <div className="relative aspect-[16/9] max-w-lg overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-black shadow-sm">
                {featuredImage.match(/\.(mp4|webm|mov|m4v|avi)(\?.*)?$/i) || featuredImage.includes('/video/upload/') ? (
                  <video src={featuredImage} controls autoPlay muted loop className="h-full w-full object-contain" />
                ) : (
                  <img src={featuredImage} alt="Featured preview" className="h-full w-full object-cover" />
                )}
              </div>
              <p className="text-[11px] font-mono text-zinc-400 truncate max-w-lg">
                {featuredImage}
              </p>
            </div>
          )}
        </div>

        {/* 📰 DISTINCT SECTION 3: Description 1 (*) / Main Content Body */}
        <div>
          <RichTextArea
            label="Description 1 (*) / Main Content Body"
            required
            value={(contentLang === 'gu' ? desc1Gu : contentLang === 'hi' ? desc1Hi : desc1) || ''}
            onChange={(val) => {
              if (contentLang === 'en') setDesc1(val);
              else if (contentLang === 'gu') setDesc1Gu(val);
              else if (contentLang === 'hi') setDesc1Hi(val);
            }}
            placeholder="Write main story lead paragraphs..."
            rows={8}
          />
        </div>

        {/* 💬 DISTINCT SECTION 4: Quote Callout Box (Optional) */}
        <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/30 p-4 dark:border-amber-950/40 dark:bg-amber-950/10">
          <label className="block text-xs font-black text-amber-800 uppercase tracking-wider dark:text-amber-400 flex items-center gap-1.5">
            <Quote className="h-4 w-4 text-amber-600" />
            <span>Quote Callout Box (Optional)</span>
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={(contentLang === 'gu' ? quoteTextGu : contentLang === 'hi' ? quoteTextHi : quoteText) || ''}
                onChange={(e) => {
                  if (contentLang === 'en') setQuoteText(e.target.value);
                  else if (contentLang === 'gu') setQuoteTextGu(e.target.value);
                  else if (contentLang === 'hi') setQuoteTextHi(e.target.value);
                }}
                placeholder={contentLang === 'gu' ? 'ગુજરાતના વિકાસ અને સુરક્ષા માટે મહત્વપૂર્ણ નિર્ણય...' : 'Quote statement text...'}
                className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none dark:border-amber-950 dark:bg-zinc-900 font-semibold"
              />
            </div>
            <div>
              <input
                type="text"
                value={(contentLang === 'gu' ? quoteCiteGu : contentLang === 'hi' ? quoteCiteHi : quoteCite) || ''}
                onChange={(e) => {
                  if (contentLang === 'en') setQuoteCite(e.target.value);
                  else if (contentLang === 'gu') setQuoteCiteGu(e.target.value);
                  else if (contentLang === 'hi') setQuoteCiteHi(e.target.value);
                }}
                placeholder="— Police Commissioner, Ahmedabad"
                className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none dark:border-amber-950 dark:bg-zinc-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* 🖼️ DISTINCT SECTION 5: Upload Additional Gallery Photos (Dynamic - Up to 9 optional photos | Max 10 Photos Total) */}
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-extrabold text-zinc-800 uppercase tracking-wider dark:text-zinc-200 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-red-600" />
                <span>Upload Additional Gallery Photos (Dynamic - Up to 9 photos | Max 10 Photos Total)</span>
              </label>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Upload or paste URLs for up to 9 additional images for this article [Recommended size: 1100px x 541px].
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-lg border border-red-100 dark:border-red-900/50">
                {(featuredImage ? 1 : 0) + extraImages.filter((s) => s.url.trim()).length} / 10 Photos Selected
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {extraImages.map((slot, idx) => {
              const photoNum = idx + 2; // Image 2 to Image 10
              const labelSuffix = photoNum === 2 ? '2nd' : photoNum === 3 ? '3rd' : `${photoNum}th`;
              return (
                <div key={slot.id || idx} className="p-4 rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-black text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {photoNum}
                      </span>
                      <span>Image {photoNum} ({labelSuffix} Optional Gallery Photo)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
                        <button
                          type="button"
                          onClick={() => updateExtraImage(idx, { mode: 'upload' })}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${slot.mode === 'upload'
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                            }`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => updateExtraImage(idx, { mode: 'url' })}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${slot.mode === 'url'
                            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                            }`}
                        >
                          Image URL
                        </button>
                      </div>
                      {extraImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImageSlot(idx)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition-colors"
                          title="Remove Image Slot"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {slot.mode === 'upload' ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*,video/*,.mp4,.webm,.mov,.m4v,.avi,.jpg,.jpeg,.png,.webp,.gif"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          updateExtraImage(idx, { uploading: true });
                          try {
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await authFetch(getBackendApiUrl('/api/admin/upload'), { method: 'POST', body: formData });
                            const json = await res.json();
                            const mediaUrl = json.url || json.data?.url || (json.file ? json.file.url : '');
                            if (res.ok && mediaUrl) updateExtraImage(idx, { url: mediaUrl });
                          } catch (err) {
                            console.error(err);
                          } finally {
                            updateExtraImage(idx, { uploading: false });
                            e.target.value = '';
                          }
                        }}
                        disabled={slot.uploading}
                        className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-100 file:text-zinc-800 hover:file:bg-zinc-200 dark:file:bg-zinc-800 dark:file:text-zinc-200 cursor-pointer"
                      />
                      {slot.uploading && <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />}
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={slot.url || ''}
                      onChange={(e) => updateExtraImage(idx, { url: e.target.value })}
                      placeholder="Paste Image URL (https://...) or Video URL (https://.../video.mp4)"
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-xs focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
                    />
                  )}

                  {slot.url && (
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-zinc-200 bg-black shrink-0">
                          {slot.url.match(/\.(mp4|webm|mov|m4v|avi)(\?.*)?$/i) || slot.url.includes('/video/upload/') ? (
                            <video src={slot.url} controls className="h-full w-full object-cover" />
                          ) : (
                            <img src={slot.url} alt={`Media ${photoNum} preview`} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 truncate max-w-xs">{slot.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateExtraImage(idx, { url: '' })}
                        className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Clear Slot {photoNum}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {extraImages.length < 9 && (
            <button
              type="button"
              onClick={handleAddImageSlot}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 text-xs font-extrabold text-zinc-700 transition-all hover:border-red-500 hover:bg-red-50/50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Image Slot ({extraImages.length + 1} of 9 Additional Photos | Max 10 Total)</span>
            </button>
          )}
        </div>


        {/* 📑 DISTINCT SECTION 6: Dynamic Additional Description / Story Sections (Max 5 Descriptions Total) */}
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-extrabold text-zinc-800 uppercase tracking-wider dark:text-zinc-200 flex items-center gap-1.5">
                <Type className="h-4 w-4 text-blue-600" />
                <span>Additional Description Sections (Dynamic - Max 5 Descriptions Total)</span>
              </label>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Add optional additional story description blocks (Description 2 to 5 | Max 5 total).
              </p>
            </div>
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-900/50">
              {1 + extraDescriptions.length} / 5 Descriptions Total
            </span>
          </div>

          <div className="space-y-4">
            {extraDescriptions.map((descSlot, idx) => {
              const descNum = idx + 2; // Description 2 to Description 5
              const currentVal = contentLang === 'gu' ? descSlot.gu : contentLang === 'hi' ? descSlot.hi : descSlot.en;
              return (
                <div key={descSlot.id || idx} className="p-4 rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] font-black text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                        {descNum}
                      </span>
                      <span>Description {descNum} (Optional Additional Story Paragraphs)</span>
                    </label>
                    {extraDescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDescriptionSlot(idx)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 transition-colors"
                        title="Remove Description Section"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <RichTextArea
                    value={currentVal || ''}
                    onChange={(val) => updateExtraDescription(idx, val)}
                    placeholder="Write additional story paragraphs, subheadings, or detailed analysis..."
                    rows={4}
                  />
                </div>
              );
            })}
          </div>

          {extraDescriptions.length < 4 && (
            <button
              type="button"
              onClick={handleAddDescriptionSlot}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 py-3 text-xs font-extrabold text-zinc-700 transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
            >
              <Plus className="h-4 w-4" />
              <span>Add Description Section (Description {extraDescriptions.length + 2} of 5 Max)</span>
            </button>
          )}
        </div>

        {/* 🎥 SOCIAL MEDIA, VIDEO & DOCUMENT EMBEDS (YouTube, Twitter / X, PDF) */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-extrabold text-sm">
              🎥
            </span>
            <div>
              <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                Video, Twitter (X) & PDF Document Embeds
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Add YouTube videos, X (Twitter) tweet links, or official PDF document attachments to your news article.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* YouTube Video URL / Embed ID */}
            <div>
              <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <span className="text-red-600">▶</span> YouTube Video URL / ID
              </label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Ex: https://www.youtube.com/watch?v=4YWEl2ZZVyY"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-xs font-medium focus:border-red-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
              />
              <p className="text-[10px] text-zinc-400 mt-1">Paste YouTube URL or embedded code ID.</p>
            </div>

            {/* Twitter / X Post URL */}
            <div>
              <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <span className="text-sky-500">🐦</span> Twitter / X Post URL
              </label>
              <input
                type="text"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="Ex: https://x.com/GujaratPost/status/1820000000000"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-xs font-medium focus:border-sky-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
              />
              <p className="text-[10px] text-zinc-400 mt-1">Paste tweet link to embed post card.</p>
            </div>

            {/* PDF File / Attachment */}
            <div>
              <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                <span className="text-red-500">📄</span> PDF Document File / URL
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-2 text-xs font-extrabold text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 cursor-pointer shadow-2xs shrink-0">
                  {uploadingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  <span>{uploadingPdf ? 'Uploading...' : 'Choose PDF'}</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                    disabled={uploadingPdf}
                  />
                </label>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://.../document.pdf"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs font-medium focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">Upload PDF file from computer or enter URL.</p>
            </div>
          </div>
        </div>

        {/* LINE 7: SEO Details & Publication Status */}
        <div className="space-y-4 border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider">
            SEO & Publication Settings
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Article No. (#)
              </label>
              <div className="w-full rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 mt-1.5 px-4 py-3 text-sm font-bold text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                <span>{articleNumber ? `#${articleNumber}` : 'Auto-generated on save'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-200/80 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  Auto Sequence
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Status (*)
                </label>
                <button
                  type="button"
                  onClick={() => setShowLivePreview(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview Article</span>
                </button>
              </div>
              {userRole === 'REPORTER' ? (
                <div className="w-full rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 mt-1.5 px-4 py-3 text-sm text-zinc-500 font-semibold">
                  Draft (Pending Review)
                </div>
              ) : (
                <CustomSelect
                  value={status || 'DRAFT'}
                  onChange={(val) => {
                    setStatus(val as any);
                    if (val === 'SCHEDULED' && (!scheduledAt || scheduledAt < getCurrentLocalMinDateTime())) {
                      setScheduledAt(getFutureDefaultIso());
                    }
                  }}
                  options={[
                    { value: 'PUBLISHED', label: 'Publish' },
                    { value: 'DRAFT', label: 'Draft' },
                    { value: 'SCHEDULED', label: 'Scheduled' },
                    { value: 'ARCHIVED', label: 'Archived' },
                  ]}
                  placeholder="Select Status"
                  searchable={false}
                />
              )}
            </div>

            {status !== 'PUBLISHED' && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                  Scheduled Publish Date & Time ⏰
                </label>
                <input
                  type="datetime-local"
                  min={getCurrentLocalMinDateTime()}
                  value={scheduledAt}
                  onChange={(e) => {
                    setScheduledAt(e.target.value);
                    if (e.target.value && status !== 'SCHEDULED') {
                      setStatus('SCHEDULED');
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value && e.target.value < getCurrentLocalMinDateTime()) {
                      setScheduledAt(getFutureDefaultIso());
                    }
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm font-mono text-zinc-900 focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Article will automatically become visible on the public website when this time arrives.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Reading Time (Minutes)
              </label>
              <input
                type="number"
                value={readingTime || 3}
                onChange={(e) => setReadingTime(Number(e.target.value))}
                min={1}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
              SEO Title
            </label>
            <input
              type="text"
              value={seoTitle || ''}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Flood havoc in Gujarat 30 deaths in two days Ahmedabad records highest rainfall in 20 years gujaratpost news"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
              SEO Description
            </label>
            <textarea
              value={seoDescription || ''}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Flood havoc in Gujarat 30 deaths in two days Ahmedabad records highest rainfall in 20 years gujaratpost news"
              rows={2}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
              SEO Keywords (comma separated)
            </label>
            <input
              type="text"
              value={seoKeywords || ''}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="Flood havoc in Gujarat, Ahmedabad rainfall, Gujarat post news"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
            />
          </div>
          {/* Article Tags */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Article Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsString || ''}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="Gujarat, Ahmedabad, rain, weather"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              Enter words separated by commas.
            </p>
          </div>
        </div>

        {/* 🚀 BOTTOM STICKY ACTION BAR (Save Article, Preview Article, Cancel) */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white/95 p-5 shadow-lg backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-900/95 sticky bottom-4 z-20">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Cancel & Exit
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowLivePreview(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-xs font-extrabold text-blue-600 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 transition-all cursor-pointer shadow-2xs"
            >
              <Eye className="h-4 w-4" />
              <span>Preview Article</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-xl px-7 py-3 text-xs font-black text-white active:scale-[0.98] transition-all cursor-pointer shadow-md disabled:opacity-50 ${
                status === 'DRAFT'
                  ? 'bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100'
                  : status === 'SCHEDULED'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              }`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{getSaveButtonLabel()}</span>
            </button>
          </div>
        </div>

      </form>

      {/* 👁️ LIVE ARTICLE PREVIEW MODAL OVERLAY */}
      {showLivePreview && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 sm:p-6 backdrop-blur-xs animate-in fade-in duration-200 overscroll-contain"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLivePreview(false);
          }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-6 overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Eye className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>Live Article Reader Preview</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/40">
                      Live Preview Mode
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">This is how your news article will appear to readers on the website.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLivePreview(false)}
                className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Preview Content Body */}
            <div className="space-y-6">
              
              {/* Category & Location Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-full uppercase tracking-wider text-[11px]">
                  {categories.find((c) => c.id === categoryId)?.name || 'News Category'}
                </span>
                {location && (
                  <span className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1">
                    📍 {location}
                  </span>
                )}
                <span className="text-zinc-400 text-[11px] ml-auto">
                  ⏱️ {readingTime || 3} min read
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                {(contentLang === 'gu' ? titleGu : contentLang === 'hi' ? titleHi : title) || 'Article Title Preview'}
              </h1>

              {/* Subtitle / Excerpt */}
              {((contentLang === 'gu' ? excerptGu : contentLang === 'hi' ? excerptHi : excerpt) || '').trim() && (
                <div className="border-l-4 border-red-600 pl-4 py-0.5 text-base text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                  {renderFormattedPreviewContent(contentLang === 'gu' ? excerptGu : contentLang === 'hi' ? excerptHi : excerpt)}
                </div>
              )}

              {/* Featured Media */}
              {featuredImage && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-black shadow-md">
                  {featuredImage.match(/\.(mp4|webm|mov|m4v|avi)(\?.*)?$/i) ? (
                    <video src={featuredImage} controls className="h-full w-full object-cover" />
                  ) : (
                    <img src={featuredImage} alt="Featured Media" className="h-full w-full object-cover" />
                  )}
                </div>
              )}

              {/* Highlights Box */}
              {((contentLang === 'gu' ? highlightsGu : contentLang === 'hi' ? highlightsHi : highlights) || '').trim() && (
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-950/40 dark:bg-red-950/20 space-y-2">
                  <h4 className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-red-500" />
                    <span>📌 એક નજરમાં (KEY HIGHLIGHTS)</span>
                  </h4>
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {renderFormattedPreviewContent(contentLang === 'gu' ? highlightsGu : contentLang === 'hi' ? highlightsHi : highlights)}
                  </div>
                </div>
              )}

              {/* Main Content (Desc 1) */}
              {((contentLang === 'gu' ? desc1Gu : contentLang === 'hi' ? desc1Hi : desc1) || '').trim() && (
                renderFormattedPreviewContent(contentLang === 'gu' ? desc1Gu : contentLang === 'hi' ? desc1Hi : desc1)
              )}

              {/* Quote Box Preview */}
              {((contentLang === 'gu' ? quoteTextGu : contentLang === 'hi' ? quoteTextHi : quoteText) || '').trim() && (
                <blockquote className="my-6 border-l-[3px] border-red-600 pl-4 py-1 font-sans">
                  <p className="text-lg md:text-[20px] font-bold text-zinc-900 dark:text-white leading-snug">
                    "{(contentLang === 'gu' ? quoteTextGu : contentLang === 'hi' ? quoteTextHi : quoteText).replace(/^"/, '').replace(/"$/, '')}"
                  </p>
                  {((contentLang === 'gu' ? quoteCiteGu : contentLang === 'hi' ? quoteCiteHi : quoteCite) || '').trim() && (
                    <footer className="mt-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                      — {(contentLang === 'gu' ? quoteCiteGu : contentLang === 'hi' ? quoteCiteHi : quoteCite)}
                    </footer>
                  )}
                </blockquote>
              )}

              {/* Photo Gallery Grid */}
              {extraImages.filter((s) => s.url.trim()).length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    📸 Photo Gallery ({extraImages.filter((s) => s.url.trim()).length} Photos)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {extraImages.filter((s) => s.url.trim()).map((slot, idx) => (
                      <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-black dark:border-zinc-800 shadow-xs">
                        <img src={slot.url} alt={`Gallery photo ${idx + 2}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Additional Description Sections */}
              {extraDescriptions.map((descSlot, idx) => {
                const val = (contentLang === 'gu' ? descSlot.gu : contentLang === 'hi' ? descSlot.hi : descSlot.en) || '';
                if (!val.trim()) return null;
                return (
                  <div key={idx} className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    {renderFormattedPreviewContent(val)}
                  </div>
                );
              })}

              {/* YouTube Embedded Video Player Preview */}
              {youtubeUrl && youtubeUrl.trim() && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    ▶ YouTube Video Coverage
                  </h4>
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-black shadow-md">
                    <iframe
                      src={getYouTubeEmbedUrl(youtubeUrl)}
                      className="h-full w-full"
                      allowFullScreen
                      frameBorder="0"
                    />
                  </div>
                </div>
              )}

              {/* Twitter / X Post Card Preview */}
              {twitterUrl && twitterUrl.trim() && (
                <div className="my-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-zinc-50 via-white to-zinc-100/80 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white text-base font-black shadow-sm">𝕏</span>
                    <div className="min-w-0">
                      <span className="block text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white leading-tight truncate">View Post on X (Twitter)</span>
                      <span className="block text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Click to view official post</span>
                    </div>
                  </div>
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-black hover:bg-zinc-800 text-white font-extrabold px-5 py-2.5 text-xs transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer" style={{ color: '#ffffff' }}>
                    <span>Open Tweet</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

              {/* PDF Document Attachment Preview */}
              {pdfUrl && pdfUrl.trim() && (
                <div className="my-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-gradient-to-r from-red-50 via-rose-50/40 to-red-50/80 dark:from-red-950/40 dark:via-red-950/20 dark:to-rose-950/30 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white text-base shadow-sm">📄</span>
                    <div className="min-w-0">
                      <span className="block text-sm sm:text-base font-extrabold text-red-950 dark:text-red-200 leading-tight truncate">Attached Official Document (PDF)</span>
                      <span className="block text-xs text-red-700/80 dark:text-red-300/80 font-medium mt-0.5">Verified Official Document</span>
                    </div>
                  </div>
                  <a href={pdfUrl} target="_blank" download className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-2.5 text-xs transition-all shadow-md shadow-red-600/25 shrink-0 flex items-center justify-center gap-2 cursor-pointer" style={{ color: '#ffffff' }}>
                    <span>Download PDF</span>
                    <span>⬇</span>
                  </a>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-zinc-200/80 pt-4 dark:border-zinc-800">
              <span className="text-xs font-mono text-zinc-400">Slug: /{slug || 'preview-news'}</span>
              <button
                type="button"
                onClick={() => setShowLivePreview(false)}
                className="rounded-xl bg-zinc-900 px-5 py-2 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
