import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class names efficiently.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns standard English digits (0-9) for all input numbers/strings.
 * Converts any Gujarati digits back to standard English numerals.
 */
export function toGu(num: number | string): string {
  const guToEng: Record<string, string> = {
    '૦': '0', '૧': '1', '૨': '2', '૩': '3', '૪': '4',
    '૫': '5', '૬': '6', '૭': '7', '૮': '8', '૯': '9'
  };
  return String(num).replace(/[૦-૯]/g, (d) => guToEng[d] || d);
}

// Backward compatibility aliases
export const toGuDigits = toGu;
export const toGuLocal = toGu;

/**
 * Formats view count numbers into clean short strings (e.g. 1.5L, 82K).
 */
export function formatViews(value: number): string {
  if (!value || isNaN(value)) return "0";
  if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

export function formatDate(dateStr: string, language: string = "gu"): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr || '';

    if (language === 'gu') {
      const monthGu = ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'][d.getMonth()];
      return `${d.getDate()} ${monthGu}, ${d.getFullYear()}`;
    }
    if (language === 'hi') {
      const monthHi = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'][d.getMonth()];
      return `${d.getDate()} ${monthHi}, ${d.getFullYear()}`;
    }

    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats ISO date string into 12-hour time (e.g. "10:00 AM").
 */
export function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/**
 * Slugifies string for URL generation.
 */
export function slugify(value: string): string {
  if (!value) return '';
  // Try standard Latin-safe slugify first
  const latin = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  // If we got a valid slug from Latin characters, use it
  if (latin && latin.length >= 3) return latin;
  // For non-Latin scripts (Gujarati, Hindi, etc.), build a slug from
  // a safe prefix + timestamp so it is always non-empty and unique
  const prefix = 'gujaratpost-news';
  const ts = Date.now().toString(36); // e.g. "lkj3x"
  return `${prefix}-${ts}`;
}

/**
 * Category color code mapping for UI tags and badges.
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Gujarat: '#c0392b',
    State: '#c0392b',
    Ahmedabad: '#c0392b',
    Rajkot: '#c0392b',
    Surat: '#c0392b',
    Vadodara: '#c0392b',
    Crime: '#8e44ad',
    Politics: '#2980b9',
    Business: '#16a085',
    Sports: '#e67e22',
    Entertainment: '#d35400',
    Technology: '#2471a3',
    Lifestyle: '#1abc9c',
    Education: '#27ae60',
    World: '#7f8c8d',
    'Gujarat Election 2027': '#c0392b',
  };
  return colors[category] || '#c0392b';
}

/**
 * Maps a trending topic tag (e.g. "# ચૂંટણી 2026", "# વરસાદ", "# ગોલ્ડ - સિલ્વર")
 * to its matching navbar category/page route if available, otherwise redirects to /search.
 */
export function getTrendingTopicHref(tag: string): string {
  if (!tag) return '/search';

  const clean = tag.replace(/^#/, '').trim();
  const lower = clean.toLowerCase();

  const categoryMap: Record<string, string> = {
    // Election / ચૂંટણી
    'ચૂંટણી 2026': '/category/election-2027',
    'ચૂંટણી 2027': '/category/election-2027',
    'ચૂંટણી': '/category/election-2027',
    'election-2027': '/category/election-2027',
    'election 2027': '/category/election-2027',
    'election 2026': '/category/election-2027',
    'election': '/category/election-2027',

    // Weather / Rain / હવામાન / વરસાદ
    'વરસાદ': '/category/weather',
    'હવામાન': '/category/weather',
    'weather': '/category/weather',
    'rain': '/category/weather',

    // Gold-Silver / સોના-ચાંદી / સોનું-ચાંદી / ગોલ્ડ - સિલ્વર
    'સોના-ચાંદી': '/category/gold-silver',
    'સોના ચાંદી': '/category/gold-silver',
    'સોનું-ચાંદી': '/category/gold-silver',
    'ગોલ્ડ - સિલ્વર': '/category/gold-silver',
    'ગોલ્ડ સિલ્વર': '/category/gold-silver',
    'gold-silver': '/category/gold-silver',
    'gold silver': '/category/gold-silver',

    // Sports / Cricket / ક્રિકેટ / સ્પોર્ટ્સ / રમતગમત
    'ક્રિકેટ': '/category/sports',
    'cricket': '/category/sports',
    'સ્પોર્ટ્સ': '/category/sports',
    'sports': '/category/sports',
    'રમતગમત': '/category/sports',

    // Politics / રાજનીતિ / રાજકારણ
    'રાજનીતિ': '/category/politics',
    'રાજકારણ': '/category/politics',
    'politics': '/category/politics',

    // Crime / ક્રાઇમ / કાઇમ
    'ક્રાઇમ': '/category/crime',
    'કાઇમ': '/category/crime',
    'crime': '/category/crime',

    // Health / હેલ્થ / આરોગ્ય
    'હેલ્થ': '/category/health',
    'આરોગ્ય': '/category/health',
    'health': '/category/health',

    // Entertainment / મનોરંજન
    'મનોરંજન': '/category/entertainment',
    'entertainment': '/category/entertainment',

    // Technology / ટેકનોલોજી
    'ટેકનોલોજી': '/category/technology',
    'technology': '/category/technology',

    // Photo Gallery / ફોટો ગેલેરી
    'ફોટો ગેલેરી': '/photos',
    'ફોટો': '/photos',
    'photos': '/photos',

    // Fact Check / ફેક્ટ ચેક
    'ફેક્ટ ચેક': '/category/fact-check',
    'fact check': '/category/fact-check',
    'fact-check': '/category/fact-check',

    // Trending / ટ્રેન્ડિંગ
    'ટ્રેન્ડિંગ': '/category/trending',
    'trending': '/category/trending',

    // Podcast / પોડકાસ્ટ
    'પોડકાસ્ટ': '/videos?tab=podcast',
    'podcast': '/videos?tab=podcast',

    // Videos / વીડિયો
    'વીડિયો': '/videos',
    'videos': '/videos',

    // Webstory / વેબસ્ટોરી
    'વેબસ્ટોરી': '/web-stories',
    'webstory': '/web-stories',
    'webstories': '/web-stories',

    // Instagram / ઇન્સ્ટાગ્રામ
    'ઇન્સ્ટાગ્રામ': '/category/instagram',
    'instagram': '/category/instagram',

    // Gujarat / ગુજરાત
    'ગુજરાત': '/category/gujarat',
    'gujarat': '/category/gujarat',

    // India / national / ભારત
    'ભારત': '/category/national',
    'national': '/category/national',
    'india': '/category/national',

    // World / વિશ્વ
    'વિશ્વ': '/category/world',
    'world': '/category/world',

    // Business / બિઝનેસ / ડાયમંડ ઉદ્યોગ / સેમિકન્ડક્ટર
    'બિઝનેસ': '/category/business',
    'business': '/category/business',
    'ડાયમંડ ઉદ્યોગ': '/category/business',
    'સેમિકન્ડક્ટર': '/category/business',

    // Cities from City Bar
    'અમદાવાદ': '/category/gujarat?city=ahmedabad',
    'ahmedabad': '/category/gujarat?city=ahmedabad',
    'ગાંધીનગર': '/category/gujarat?city=gandhinagar',
    'gandhinagar': '/category/gujarat?city=gandhinagar',
    'સુરત': '/category/surat',
    'surat': '/category/surat',
    'વડોદરા': '/category/vadodara',
    'vadodara': '/category/vadodara',
    'રાજકોટ': '/category/rajkot',
    'rajkot': '/category/rajkot',
  };

  // Direct match lookup
  if (categoryMap[clean]) return categoryMap[clean];
  if (categoryMap[lower]) return categoryMap[lower];

  // Partial match checks
  for (const [key, route] of Object.entries(categoryMap)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return route;
    }
  }

  // Default fallback: Search page
  return `/search?q=${encodeURIComponent(clean)}`;
}

