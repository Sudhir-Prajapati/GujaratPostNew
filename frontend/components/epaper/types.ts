export interface BroadsheetArticle {
  id: string;
  title: string;
  titleGu?: string;
  titleHi?: string;
  excerpt?: string;
  excerptGu?: string;
  content?: string;
  contentGu?: string;
  featuredImage?: string;
  location?: string;
  category?: {
    id?: string;
    name?: string;
    nameGu?: string;
    slug?: string;
  };
  author?: {
    id?: string;
    name?: string;
    nameGu?: string;
    image?: string;
    designation?: string;
    designationGu?: string;
  };
  printHeadline?: string;
  printSubheadline?: string;
  printSummary?: string;
  photoCredit?: string;
  byline?: string;
  primarySection?: string;
  allowDuplicate?: boolean;
  score?: number;
  createdAt?: string;
}

export interface EPaperPageData {
  id?: string;
  pageNumber: number;
  totalPages: number;
  city: string;
  cityGu?: string;
  date: string;
  pageTitle?: string;
  sectionKey?: string;
  templateId?: string;
  isLocked?: boolean;
  lockedBy?: string;
  lockedAt?: string;
  enabled?: boolean;
  leadArticle?: BroadsheetArticle | null;
  secondArticle?: BroadsheetArticle | null;
  thirdArticle?: BroadsheetArticle | null;
  fourthArticle?: BroadsheetArticle | null;
  fifthArticle?: BroadsheetArticle | null;
  sixthArticle?: BroadsheetArticle | null;
  seventhArticle?: BroadsheetArticle | null;
  eighthArticle?: BroadsheetArticle | null;
  ninthArticle?: BroadsheetArticle | null;
  tenthArticle?: BroadsheetArticle | null;
  eleventhArticle?: BroadsheetArticle | null;
  twelfthArticle?: BroadsheetArticle | null;
  thirteenthArticle?: BroadsheetArticle | null;
  fourteenthArticle?: BroadsheetArticle | null;
  fifteenthArticle?: BroadsheetArticle | null;
  sixteenthArticle?: BroadsheetArticle | null;
  seventeenthArticle?: BroadsheetArticle | null;
  gridArticles?: BroadsheetArticle[];
  sideArticles?: BroadsheetArticle[];
  bottomArticles?: BroadsheetArticle[];
  layoutData?: Record<string, any>;
}

export function formatGujaratiDate(dateStr: string): string {
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('gu-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getCleanText(htmlOrText?: string, maxLen: number = 240): string {
  if (!htmlOrText) return '';
  const clean = htmlOrText.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.substring(0, maxLen) + '...';
}
