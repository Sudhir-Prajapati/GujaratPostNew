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

/**
 * Formats ISO date string into readable short date (e.g. "13 Jul 2026").
 */
export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
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
