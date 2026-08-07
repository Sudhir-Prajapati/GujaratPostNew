'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save, Globe, Settings2, BarChart2, AlertCircle, Upload, Sparkles, Quote, List, Heading, Type, Copy } from 'lucide-react';
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

// All Gujarat city/region options
const GUJARAT_LOCATIONS = [
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
  { value: 'Gujarat', label: 'Gujarat (Other)', sublabel: 'ગુજરાત (અન્ય)' },
];

// National India locations
const NATIONAL_LOCATIONS = [
  { value: 'National', label: 'National', sublabel: 'દેશ' },
  { value: 'Delhi', label: 'New Delhi', sublabel: 'નવી દિલ્હી' },
  { value: 'Mumbai', label: 'Mumbai', sublabel: 'મુંબઈ' },
  { value: 'Kolkata', label: 'Kolkata', sublabel: 'કોલકાતા' },
  { value: 'Chennai', label: 'Chennai', sublabel: 'ચેન્નઈ' },
  { value: 'Bangalore', label: 'Bangalore', sublabel: 'બેંગ્લોર' },
  { value: 'Hyderabad', label: 'Hyderabad', sublabel: 'હૈદ્રાબાદ' },
  { value: 'Pune', label: 'Pune', sublabel: 'પૂણે' },
  { value: 'Jaipur', label: 'Jaipur', sublabel: 'જયપુર' },
];

// International locations
const INTERNATIONAL_LOCATIONS = [
  { value: 'International', label: 'International', sublabel: 'વિદેશ' },
  { value: 'USA', label: 'USA', sublabel: 'અમેરિકા' },
  { value: 'UK', label: 'UK', sublabel: 'બ્રિટન' },
  { value: 'China', label: 'China', sublabel: 'ચીન' },
  { value: 'Pakistan', label: 'Pakistan', sublabel: 'પાકિસ્તાન' },
  { value: 'UAE', label: 'UAE', sublabel: 'UAE' },
  { value: 'Canada', label: 'Canada', sublabel: 'કેનેડા' },
  { value: 'Australia', label: 'Australia', sublabel: 'ઓસ્ટ્રેલિયા' },
];

// Default / All locations combined
const LOCATION_OPTIONS = [
  ...GUJARAT_LOCATIONS,
  ...NATIONAL_LOCATIONS,
  ...INTERNATIONAL_LOCATIONS,
];

// Map categories to location group
const NATIONAL_CATEGORY_NAMES = ['national', 'india', 'politics', 'crime', 'education', 'health', 'sports', 'fact check', 'lifestyle', 'technology', 'weather', 'business', 'entertainment', 'defense', 'railway', 'election'];
const INTERNATIONAL_CATEGORY_NAMES = ['world', 'international', 'global', 'foreign'];
const GUJARAT_CATEGORY_NAMES = ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot', 'gandhinagar', 'bhavnagar', 'jamnagar', 'kutch', 'junagadh', 'morbi', 'mehsana', 'anand'];


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

  const [image2, setImage2] = useState('');
  const [image2Mode, setImage2Mode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage2, setUploadingImage2] = useState(false);

  const [image3, setImage3] = useState('');
  const [image3Mode, setImage3Mode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage3, setUploadingImage3] = useState(false);

  const [image4, setImage4] = useState('');
  const [image4Mode, setImage4Mode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage4, setUploadingImage4] = useState(false);

  const [image5, setImage5] = useState('');
  const [image5Mode, setImage5Mode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage5, setUploadingImage5] = useState(false);


  const [desc2, setDesc2] = useState('');
  const [desc2Gu, setDesc2Gu] = useState('');
  const [desc2Hi, setDesc2Hi] = useState('');

  // Fallback unified content strings
  const [content, setContent] = useState('');
  const [contentGu, setContentGu] = useState('');
  const [contentHi, setContentHi] = useState('');

  // Settings
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'SCHEDULED'>('DRAFT');
  const [scheduledAt, setScheduledAt] = useState('');
  const [priority, setPriority] = useState(0);
  const [readingTime, setReadingTime] = useState(3);

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

  // Live Article Preview Toggle State
  const [showLivePreview, setShowLivePreview] = useState(false);

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
    d2Str: string,
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
    galleryImages.forEach((img, idx) => {
      if (img && img.trim()) {
        parts.push(`![Gallery Image ${idx + 2}](${img.trim()})`);
      }
    });
    if (qT.trim()) {
      const citeStr = qC.trim() ? `\n> — ${qC.trim()}` : '';
      parts.push(`> "${qT.trim()}"${citeStr}`);
    }
    if (d2Str.trim()) {
      parts.push(d2Str.trim());
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

    if (!desc2Gu.trim()) setDesc2Gu(desc2);
    if (!desc2Hi.trim()) setDesc2Hi(desc2);

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

  // Parse body string into distinct sections (Highlights, Desc1, Image2..5, Quote, Desc2)
  const parseBodyToSections = (raw: string) => {
    let hl = '';
    let d1Str = '';
    let qT = '';
    let qC = '';
    let d2Str = '';
    let img2 = '';
    let img3 = '';
    let img4 = '';
    let img5 = '';

    if (!raw) return { hl, d1Str, qT, qC, d2Str, img2, img3, img4, img5 };

    const galleryMatches = [...raw.matchAll(/!\[(?:Gallery Image \d+|.*?)\]\((https?:\/\/[^\s)]+|\/uploads\/[^\s)]+)\)/gi)];
    const extractedImgs: string[] = [];
    for (const match of galleryMatches) {
      if (match[1]) {
        extractedImgs.push(match[1]);
        raw = raw.replace(match[0], '');
      }
    }
    img2 = extractedImgs[0] || '';
    img3 = extractedImgs[1] || '';
    img4 = extractedImgs[2] || '';
    img5 = extractedImgs[3] || '';


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
    d2Str = d2Paras.join('\n\n');

    if (!d1Str && !hl && !qT && !d2Str) {
      d1Str = raw.trim();
    }

    return { hl, d1Str, qT, qC, d2Str, img2, img3, img4, img5 };
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
        setDesc2(parsedEn.d2Str || '');

        const parsedGu = parseBodyToSections(art.contentGu || primaryContent);
        setHighlightsGu(art.highlightsGu || parsedGu.hl || art.highlights || parsedEn.hl || '');
        setDesc1Gu(parsedGu.d1Str || parsedEn.d1Str || '');
        setQuoteTextGu(parsedGu.qT || parsedEn.qT || '');
        setQuoteCiteGu(parsedGu.qC || parsedEn.qC || '');
        setDesc2Gu(parsedGu.d2Str || parsedEn.d2Str || '');

        const parsedHi = parseBodyToSections(art.contentHi || primaryContent);
        setHighlightsHi(art.highlightsHi || parsedHi.hl || art.highlights || parsedEn.hl || '');
        setDesc1Hi(parsedHi.d1Str || parsedEn.d1Str || '');
        setQuoteTextHi(parsedHi.qT || parsedEn.qT || '');
        setQuoteCiteHi(parsedHi.qC || parsedEn.qC || '');
        setDesc2Hi(parsedHi.d2Str || parsedEn.d2Str || '');

        // Populate optional gallery photos (Images 2..5) from article property or parsed markdown
        setImage2(art.image2 || art.galleryImage2 || art.secondaryImage || parsedEn.img2 || parsedGu.img2 || parsedHi.img2 || '');
        setImage3(art.image3 || parsedEn.img3 || parsedGu.img3 || parsedHi.img3 || '');
        setImage4(art.image4 || parsedEn.img4 || parsedGu.img4 || parsedHi.img4 || '');
        setImage5(art.image5 || parsedEn.img5 || parsedGu.img5 || parsedHi.img5 || '');

        setFeaturedImage(art.featuredImage || '');
        if (art.featuredImage && (art.featuredImage.startsWith('http://') || art.featuredImage.startsWith('https://'))) {
          setImageMode('url');
        } else {
          setImageMode('upload');
        }
        setCategoryId(art.categoryId || art.category?.id || '');
        setLocation(art.location || '');
        setAuthorId(art.authorId || art.author?.id || '');
        setStatus(art.status || 'PUBLISHED');
        if (art.scheduledAt) {
          const d = new Date(art.scheduledAt);
          const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setScheduledAt(localIso);
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
          setTagsString(art.tags.map((t: any) => t.name).join(', '));
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
      if (!res.ok) throw new Error(json.error || json.message || 'Failed to upload image.');

      setFeaturedImage(json.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to upload image from computer.');
    } finally {
      setUploadingImage(false);
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
    const effectiveD2 = (desc2 || desc2Gu || desc2Hi || '').trim();

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

    // Compile distinct input sections into complete article content strings
    const galleryPayload = [image2, image3, image4, image5];
    const compiledEn = compileStructuredContent(highlights.trim() || effectiveHighlights, desc1.trim() || effectiveD1, quoteText.trim() || effectiveQuoteText, quoteCite.trim() || effectiveQuoteCite, desc2.trim() || effectiveD2, galleryPayload, 'en');
    const compiledGu = compileStructuredContent(highlightsGu.trim() || effectiveHighlights, desc1Gu.trim() || effectiveD1, quoteTextGu.trim() || effectiveQuoteText, quoteCiteGu.trim() || effectiveQuoteCite, desc2Gu.trim() || effectiveD2, galleryPayload, 'gu');
    const compiledHi = compileStructuredContent(highlightsHi.trim() || effectiveHighlights, desc1Hi.trim() || effectiveD1, quoteTextHi.trim() || effectiveQuoteText, quoteCiteHi.trim() || effectiveQuoteCite, desc2Hi.trim() || effectiveD2, galleryPayload, 'hi');


    // Convert comma-separated tags to object array
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

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
      categoryId,
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

      // Route back to list
      router.push('/admin/articles');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
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
        const cityMatch = GUJARAT_LOCATIONS.find(
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
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

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{loading ? 'Saving...' : 'Save Article'}</span>
        </button>
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
              if (contentLang === 'en') setTitle(e.target.value);
              else if (contentLang === 'gu') setTitleGu(e.target.value);
              else if (contentLang === 'hi') setTitleHi(e.target.value);
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
              options={(() => {
                const selectedCat = categories.find((c) => c.id === categoryId);
                const catNameLower = selectedCat?.name?.trim().toLowerCase() || '';
                if (INTERNATIONAL_CATEGORY_NAMES.some((n) => catNameLower.includes(n))) {
                  return INTERNATIONAL_LOCATIONS;
                } else if (NATIONAL_CATEGORY_NAMES.some((n) => catNameLower.includes(n) || catNameLower === n)) {
                  return NATIONAL_LOCATIONS;
                } else if (GUJARAT_CATEGORY_NAMES.some((n) => catNameLower.includes(n) || catNameLower === n)) {
                  return GUJARAT_LOCATIONS;
                }
                return LOCATION_OPTIONS; // All options when no category selected
              })()}
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

        {/* 🖼️ DISTINCT SECTION 2: Upload Images 1 [Size: 1100px X 541px] */}
        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300">
              Upload Images 1 (Primary Featured Photo) [Size: 1100px X 541px] <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${imageMode === 'upload'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
                  }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${imageMode === 'url'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
                  }`}
              >
                Image URL
              </button>
            </div>
          </div>

          {imageMode === 'upload' ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="block w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-950/30 dark:file:text-red-400 cursor-pointer"
                />
                {uploadingImage && <Loader2 className="h-4 w-4 animate-spin text-red-600" />}
              </div>
            </div>
          ) : (
            <input
              type="url"
              value={featuredImage || ''}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
            />
          )}

          {featuredImage && (
            <div className="relative aspect-[16/9] max-w-sm overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-black">
              <img src={featuredImage} alt="Featured preview" className="h-full w-full object-cover" />
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

        {/* 🖼️ DISTINCT SECTION 5: Upload Additional Gallery Photos (Up to 4 additional - Total 5 Photos max) */}
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider dark:text-zinc-200">
                Upload Additional Gallery Photos (Up to 4 optional photos - Total max 5 photos)
              </label>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Upload up to 4 additional images for this article [Recommended size: 1100px x 541px].
              </p>
            </div>
            <span className="text-xs font-black text-red-600 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-md border border-red-100 dark:border-red-900/50">
              Max 5 Photos Total
            </span>
          </div>

          {[
            { num: 2, label: '2nd Optional Gallery Photo', val: image2, setVal: setImage2, mode: image2Mode, setMode: setImage2Mode, loading: uploadingImage2, setLoading: setUploadingImage2 },
            { num: 3, label: '3rd Optional Gallery Photo', val: image3, setVal: setImage3, mode: image3Mode, setMode: setImage3Mode, loading: uploadingImage3, setLoading: setUploadingImage3 },
            { num: 4, label: '4th Optional Gallery Photo', val: image4, setVal: setImage4, mode: image4Mode, setMode: setImage4Mode, loading: uploadingImage4, setLoading: setUploadingImage4 },
            { num: 5, label: '5th Optional Gallery Photo', val: image5, setVal: setImage5, mode: image5Mode, setMode: setImage5Mode, loading: uploadingImage5, setLoading: setUploadingImage5 },
          ].map((slot) => (
            <div key={slot.num} className="p-3.5 rounded-xl border border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Image {slot.num} ({slot.label})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => slot.setMode('upload')}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${slot.mode === 'upload'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => slot.setMode('url')}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${slot.mode === 'url'
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {slot.mode === 'upload' ? (
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      slot.setLoading(true);
                      try {
                        const formData = new FormData();
                        formData.append('file', file);
                        const res = await authFetch(getBackendApiUrl('/api/admin/upload'), { method: 'POST', body: formData });
                        const json = await res.json();
                        if (res.ok && json.url) slot.setVal(json.url);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        slot.setLoading(false);
                      }
                    }}
                    disabled={slot.loading}
                    className="block w-full text-xs text-zinc-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-100 file:text-zinc-800 hover:file:bg-zinc-200 cursor-pointer"
                  />
                  {slot.loading && <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />}
                </div>
              ) : (
                <input
                  type="url"
                  value={slot.val || ''}
                  onChange={(e) => slot.setVal(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20"
                />
              )}

              {slot.val && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-zinc-200 bg-black shrink-0">
                    <img src={slot.val} alt={`Image ${slot.num} preview`} className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => slot.setVal('')}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Remove Photo {slot.num}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>


        {/* 📑 DISTINCT SECTION 6: Description 2 (Optional) / Additional Story */}
        {/* 📑 DISTINCT SECTION 6: Description 2 (Optional) / Additional Story */}
        <div>
          <RichTextArea
            label="Description 2 (Optional) / Additional Paragraphs"
            value={(contentLang === 'gu' ? desc2Gu : contentLang === 'hi' ? desc2Hi : desc2) || ''}
            onChange={(val) => {
              if (contentLang === 'en') setDesc2(val);
              else if (contentLang === 'gu') setDesc2Gu(val);
              else if (contentLang === 'hi') setDesc2Hi(val);
            }}
            placeholder="Write concluding story paragraphs..."
            rows={5}
          />
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
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Status (*)
              </label>
              {userRole === 'REPORTER' ? (
                <div className="w-full rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950/40 mt-1.5 px-4 py-3 text-sm text-zinc-500 font-semibold">
                  Draft (Pending Review)
                </div>
              ) : (
                <CustomSelect
                  value={status || 'DRAFT'}
                  onChange={(val) => {
                    setStatus(val as any);
                    if (val === 'SCHEDULED' && !scheduledAt) {
                      const nextHour = new Date(Date.now() + 3600000);
                      const localIso = new Date(nextHour.getTime() - nextHour.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                      setScheduledAt(localIso);
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

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Scheduled Publish Date & Time ⏰
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => {
                  setScheduledAt(e.target.value);
                  if (e.target.value && status !== 'SCHEDULED') {
                    setStatus('SCHEDULED');
                  }
                }}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 mt-1.5 px-4 py-3 text-sm font-mono text-zinc-900 focus:border-primary focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-white"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Article will automatically become visible on the public website when this time arrives.
              </p>
            </div>

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

      </form>
    </div>
  );
}
