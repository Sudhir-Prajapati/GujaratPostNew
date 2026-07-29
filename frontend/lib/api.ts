import { Article, Video, Photo } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gujaratpost.onrender.com/api/public';

export const BACKEND_API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/public\/?$/, '')
  : 'https://gujaratpost.onrender.com/api';

export function getBackendApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (cleanPath.startsWith('/api/')) {
    return `${BACKEND_API_BASE}${cleanPath.substring(4)}`;
  }
  return `${BACKEND_API_BASE}${cleanPath}`;
}

export function getAccessTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessTokenFromCookie();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

// Memory cache & In-flight request deduplication map
const apiCache = new Map<string, { timestamp: number; data: any }>();
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 60000; // 60 seconds cache TTL for public API calls

/**
 * Fetch wrapper with caching & in-flight request deduplication
 */
async function fetchCachedJson<T = any>(url: string): Promise<T | null> {
  const now = Date.now();
  const cached = apiCache.get(url);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  if (inFlightRequests.has(url)) {
    try {
      return (await inFlightRequests.get(url)) as T;
    } catch {
      return null;
    }
  }

  const fetchPromise = (async () => {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const json = await res.json();
    apiCache.set(url, { timestamp: Date.now(), data: json });
    return json;
  })();

  inFlightRequests.set(url, fetchPromise);

  try {
    const data = await fetchPromise;
    return data as T;
  } catch (error: any) {
    console.warn(`Backend API fetch error for ${url}:`, error?.message || error);
    return null;
  } finally {
    inFlightRequests.delete(url);
  }
}

/**
 * Fetch articles list from Express Backend API
 */
export async function getPublicArticles(options: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  query?: string;
  isTrending?: boolean;
  isBreaking?: boolean;
  isFeatured?: boolean;
} = {}): Promise<{ articles: Article[]; total: number; totalPages: number }> {
  try {
    const params = new URLSearchParams();
    if (options.page) params.append('page', String(options.page));
    if (options.limit) params.append('limit', String(options.limit));
    if (options.categorySlug) params.append('categorySlug', options.categorySlug);
    if (options.query) params.append('query', options.query);
    if (options.isTrending) params.append('isTrending', 'true');
    if (options.isBreaking) params.append('isBreaking', 'true');
    if (options.isFeatured) params.append('isFeatured', 'true');

    const url = `${API_BASE_URL}/articles?${params.toString()}`;
    const json = await fetchCachedJson<any>(url);

    if (json?.success && json.data?.articles) {
      return json.data;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for articles:', error?.message || error);
  }

  return {
    articles: [],
    total: 0,
    totalPages: 1,
  };
}

/**
 * Fetch single article details by slug or ID from Express Backend API
 */
export async function getPublicArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const url = `${API_BASE_URL}/articles/${slug}`;
    const json = await fetchCachedJson<any>(url);

    if (json?.success && json.data?.article) {
      return json.data.article;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for article detail:', error?.message || error);
  }

  return null;
}

/**
 * Fetch list of categories from Express Backend API
 */
export async function getPublicCategories(): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/categories`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.categories) {
      return json.data.categories;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for categories:', error?.message || error);
  }
  return [];
}

/**
 * Fetch list of authors from Express Backend API
 */
export async function getPublicAuthors(): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/authors`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.authors) {
      return json.data.authors;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for authors:', error?.message || error);
  }
  return [];
}

/**
 * Fetch videos list from Express Backend API
 */
export async function getPublicVideos(type?: string): Promise<Video[]> {
  try {
    const url = type ? `${API_BASE_URL}/videos?type=${type}` : `${API_BASE_URL}/videos`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.videos) {
      return json.data.videos;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for videos:', error?.message || error);
  }

  return [];
}

/**
 * Fetch photo gallery items from Express Backend API
 */
export async function getPublicGallery(): Promise<Photo[]> {
  try {
    const url = `${API_BASE_URL}/gallery`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.photos) {
      return json.data.photos;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for gallery:', error?.message || error);
  }

  return [];
}

/**
 * Fetch Instagram stories from Express Backend API
 */
export async function getPublicStories(): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/stories`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.stories) {
      return json.data.stories;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for stories:', error?.message || error);
  }
  return [];
}

/**
 * Fetch Web stories from Express Backend API
 */
export async function getPublicWebStories(): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/webstories`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.webStories) {
      return json.data.webStories;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for webstories:', error?.message || error);
  }
  return [];
}

/**
 * Fetch Breaking tickers from Express Backend API
 */
export async function getPublicTickers(): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/tickers`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.tickers) {
      return json.data.tickers;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for tickers:', error?.message || error);
  }
  return [];
}

/**
 * Fetch Astrology signs predictions from Express Backend API
 */
export async function getPublicAstrology(): Promise<any[]> {
  try {
    const url = `${API_BASE_URL}/astrology`;
    const json = await fetchCachedJson<any>(url);
    if (json?.success && json.data?.signs) {
      return json.data.signs;
    }
  } catch (error: any) {
    console.warn('Backend API fetch error for astrology:', error?.message || error);
  }
  return [];
}
