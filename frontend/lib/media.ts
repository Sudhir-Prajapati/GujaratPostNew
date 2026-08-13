/**
 * Utility functions for handling article media (images & videos)
 */

export function isMediaVideo(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase().trim();
  return (
    lower.includes('/video/upload/') ||
    lower.includes('/video/') ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.m4v') ||
    lower.endsWith('.ogv') ||
    lower.includes('.mp4?') ||
    lower.includes('.webm?') ||
    lower.includes('.mov?')
  );
}

export function getVideoPosterUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '/assets/demo/1.jpg';
  const clean = url.trim();
  if (!isMediaVideo(clean)) return clean;

  // Cloudinary video transformation to extract high-quality poster frame
  if (clean.includes('res.cloudinary.com') && clean.includes('/video/upload/')) {
    const poster = clean
      .replace(/\/video\/upload\/(?:v\d+\/)?/, (match) => {
        return match.replace('/video/upload/', '/video/upload/so_0,f_jpg,q_auto,w_800/');
      })
      .replace(/\.[a-zA-Z0-9]+$/, '') + '.jpg';
    return poster;
  }

  return clean;
}
