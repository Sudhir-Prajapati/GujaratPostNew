import { Article, Author, NavItem, Photo, Video, Language } from '@/types';
import { toGu, toGuLocal, toGuDigits, formatViews, formatDate, formatTime, slugify } from '@/lib/utils';

export { toGu, toGuLocal, toGuDigits, formatViews, formatDate, formatTime, slugify };

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gujaratpost.com';

// Empty static arrays - backend API is the single source of truth
export const ARTICLES: Article[] = [];
export const VIDEOS: Video[] = [];
export const PHOTOS: Photo[] = [];
export const AUTHORS: Author[] = [];
export const BREAKING_TICKER: Array<{ en: string; gu: string; hi: string; slug: string }> = [];

export const CATEGORY_META: Record<string, { name: string; gu: string; hi: string }> = {
  gujarat: { name: 'Gujarat', gu: 'ગુજરાત', hi: 'गुजरात' },
  state: { name: 'Gujarat', gu: 'ગુજરાત', hi: 'गुजरात' },
  national: { name: 'India', gu: 'ભારત', hi: 'भारत' },
  world: { name: 'World', gu: 'વિશ્વ', hi: 'विश्व' },
  politics: { name: 'Politics', gu: 'રાજનીતિ', hi: 'राजनीति' },
  crime: { name: 'Crime', gu: 'ક્રાઇમ', hi: 'क्राइम' },
  health: { name: 'Health', gu: 'હેલ્થ', hi: 'स्वास्थ्य' },
  entertainment: { name: 'Entertainment', gu: 'મનોરંજન', hi: 'मनोरंजन' },
  technology: { name: 'Technology', gu: 'ટેકનોલોજી', hi: 'टेक्नोलॉजी' },
  photos: { name: 'Photo Gallery', gu: 'ફોટો ગેલેરી', hi: 'फोटो गैलरी' },
  'fact-check': { name: 'Fact Check', gu: 'ફેક્ટ ચેક', hi: 'फैक्त चेक' },
  trending: { name: 'Trending', gu: 'ટ્રેન્ડિંગ', hi: 'ट्रेंडिंग' },
  'election-2027': { name: 'Election 2027', gu: 'ચૂંટણી 2027', hi: 'चुनाव 2027' },
  business: { name: 'Business', gu: 'બિઝનેસ', hi: 'बिजनेस' },
  sports: { name: 'Sports', gu: 'સ્પોર્ટ્સ', hi: 'खेल' },
  lifestyle: { name: 'Lifestyle', gu: 'લાઇફસ્ટાઇલ', hi: 'लाइफस्टाइल' },
  education: { name: 'Education', gu: 'શિક્ષણ', hi: 'शिक्षा' },
  ahmedabad: { name: 'Ahmedabad', gu: 'અમદાવાદ', hi: 'अहमदाबाद' },
  rajkot: { name: 'Rajkot', gu: 'રાજકોટ', hi: 'राजकोट' },
  surat: { name: 'Surat', gu: 'સુરત', hi: 'सूरत' },
  vadodara: { name: 'Vadodara', gu: 'વડોદરા', hi: 'वडोदरा' },
  videos: { name: 'Videos', gu: 'વીડિયો', hi: 'वीडियो' },
  shorts: { name: 'Shorts', gu: 'શોર્ટ્સ', hi: 'शॉर्ट्स' },
  podcasts: { name: 'Podcasts', gu: 'પોડકાસ્ટ', hi: 'पॉडकास्ट' },
};

export const categorySlugMapping: Record<string, string> = {
  gujarat: "gujarat",
  state: "gujarat",
  national: "national",
  world: "world",
  politics: "politics",
  crime: "crime",
  health: "health",
  entertainment: "entertainment",
  technology: "technology",
  photos: "photos",
  "fact-check": "fact-check",
  trending: "trending",
  "election-2027": "election-2027",
  ahmedabad: "ahmedabad",
  rajkot: "rajkot",
  surat: "surat",
  vadodara: "vadodara",
  business: "business",
  sports: "sports",
  lifestyle: "lifestyle",
  education: "education",
};

export const NAV_ITEMS: NavItem[] = [
  ['Home', 'મુખ્ય', 'મુખ્ય', '/'],
  ['Videos', 'વીડિયો', 'વીડિયો', '/videos'],
  ['Gujarat', 'ગુજરાત', 'ગુજરાત', '/category/gujarat'],
  ['India', 'ભારત', 'ભારત', '/category/national'],
  ['World', 'વિશ્વ', 'વિશ્વ', '/category/world'],
  ['Politics', 'રાજકારણ', 'રાજકારણ', '/category/politics'],
  ['Crime', 'ક્રાઇમ', 'ક્રાઇમ', '/category/crime'],
  ['Health', 'આરોગ્ય', 'આરોગ્ય', '/category/health'],
  ['Entertainment', 'મનોરંજન', 'મનોરંજન', '/category/entertainment'],
  ['Technology', 'ટેકનોલોજી', 'ટેકનોલોજી', '/category/technology'],
  ['Photos', 'ફોટો ગેલેરી', 'ફોટો ગેલેરી', '/photos'],
  ['Fact Check', 'ફેક્ટ ચેક', 'ફેક્ટ ચેક', '/category/fact-check'],
  ['Trending', 'ટ્રેન્ડિંગ', 'ટ્રેન્ડિંગ', '/category/trending'],
  ['Election 2027', 'ચૂંટણી 2027', 'ચૂંટણી 2027', '/category/election-2027'],
  ['Podcast', 'પોડકાસ્ટ', 'પોડકાસ્ટ', '/videos?tab=podcast'],
  ['Instagram', 'ઇન્સ્ટાગ્રામ', 'ઇન્સ્ટાગ્રામ', '/category/instagram'],
  ['Webstory', 'વેબસ્ટોરી', 'વેબસ્ટોરી', '/category/webstory'],
  ['Weather', 'હવામાન', 'હવામાન', '/category/weather'],
  ['Gold-Silver', 'સોનું-ચાંદી', 'સોનું-ચાંદી', '/category/gold-silver'],
  ['State News', 'રાજ્યના સમાચાર', 'રાજ્યના સમાચાર', '/category/state'],
  ['Ahmedabad', 'અમદાવાદ', 'અમદાવાદ', '/category/ahmedabad'],
  ['Rajkot', 'રાજકોટ', 'રાજકોટ', '/category/rajkot'],
  ['Surat', 'સુરત', 'સુરત', '/category/surat'],
  ['Vadodara', 'વડોદરા', 'વડોદરા', '/category/vadodara'],
  ['Business', 'બિઝનેસ', 'બિઝનેસ', '/category/business'],
  ['Sports', 'રમતગમત', 'રમતગમત', '/category/sports'],
  ['Education', 'શિક્ષણ', 'શિક્ષણ', '/category/education'],
  ['Watch Never Ends', 'વીડિયો સેક્શન', 'વીડિયો સેક્શન', '/watch'],
  ['Shorts', 'શોર્ટ્સ', 'શોર્ટ્સ', '/shorts'],
  ['E-paper', 'ઈ-પેપર', 'ઈ-પેપર', '/epaper'],
].map(([label, labelGu, labelHi, href]) => ({ label, labelGu, labelHi, href }));

export const getLocalized = (language: Language, values: { en?: string; gu?: string; hi?: string }) => {
  const en = (values?.en || '').trim();
  const gu = (values?.gu || '').trim();
  const hi = (values?.hi || '').trim();

  if (language === 'en') return en || gu || hi;
  if (language === 'hi') return hi || gu || en;
  return gu || en || hi;
};

export const getArticleTitle = (article: Article, language: Language) =>
  getLocalized(language, { en: article?.title || '', gu: article?.titleGu || '', hi: article?.titleHi || '' });

export const getArticleExcerpt = (article: Article, language: Language) =>
  getLocalized(language, { en: article?.excerpt || '', gu: article?.excerptGu || '', hi: article?.excerptHi || '' });

export const getArticleContent = (article: Article, language: Language) =>
  getLocalized(language, { en: article?.content || '', gu: article?.contentGu || '', hi: article?.contentHi || '' });

export const getCategoryLabel = (article: Article, language: Language) =>
  getLocalized(language, { en: article?.category || '', gu: article?.categoryGu || '', hi: article?.categoryHi || '' });

export const getRelativeTime = (dateString?: string | Date | null, language: Language = 'gu'): string => {
  if (!dateString) {
    if (language === 'gu') return 'હમણાં જ';
    if (language === 'hi') return 'अभी';
    return 'Just now';
  }

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (isNaN(diffMs) || diffMs < 0) {
    if (language === 'gu') return 'હમણાં જ';
    if (language === 'hi') return 'अभी';
    return 'Just now';
  }

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (language === 'gu') {
    if (diffMins < 1) return 'હમણાં જ';
    if (diffMins < 60) return `${toGu(diffMins)} મિનિટ પહેલાં`;
    if (diffHours < 24) return `${toGu(diffHours)} કલાક પહેલાં`;
    if (diffDays < 30) return `${toGu(diffDays)} દિવસ પહેલાં`;
    return `${toGu(Math.floor(diffDays / 30))} મહિના પહેલાં`;
  }

  if (language === 'hi') {
    if (diffMins < 1) return 'अभी';
    if (diffMins < 60) return `${diffMins} मिनट पहले`;
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    if (diffDays < 30) return `${diffDays} दिन पहले`;
    return `${Math.floor(diffDays / 30)} महीने पहले`;
  }

  // English
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)} mo ago`;
};

export const getArticlesByCategory = (cat: string) => [];
export const getTrendingArticles = () => [];
export const getFeaturedArticles = () => [];
export const getRelatedArticles = (article: Article) => [];
export const searchArticles = (query: string) => [];
