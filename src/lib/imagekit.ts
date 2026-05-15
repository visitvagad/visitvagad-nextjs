/**
 * ImageKit integration for VisitVagad.
 * URL generation, transformations, responsive sizing, fallbacks.
 */

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '';

interface TransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  focus?: 'auto' | 'face' | 'center';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  blur?: number;
  aspectRatio?: string;
}

function buildTransform(opts: TransformOptions): string {
  const parts: string[] = [];
  if (opts.width) parts.push(`w-${opts.width}`);
  if (opts.height) parts.push(`h-${opts.height}`);
  if (opts.quality) parts.push(`q-${opts.quality}`);
  if (opts.focus) parts.push(`fo-${opts.focus}`);
  if (opts.format) parts.push(`f-${opts.format}`);
  if (opts.blur) parts.push(`bl-${opts.blur}`);
  if (opts.aspectRatio) parts.push(`ar-${opts.aspectRatio}`);
  return parts.join(',');
}

/** Generate an optimized ImageKit URL with transformations */
export function getImageKitUrl(path: string, opts: TransformOptions = {}): string {
  if (!path) return '';
  // Non-ImageKit full URL — return as-is
  if (path.startsWith('http') && !path.includes('imagekit.io') && !path.includes('ik.imagekit.io')) {
    return path;
  }
  // Already full ImageKit URL — extract path portion
  if (path.startsWith('http')) {
    try {
      const url = new URL(path);
      path = url.pathname;
    } catch { /* use as-is */ }
  }
  const base = IMAGEKIT_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const transform = buildTransform({ format: 'auto', quality: opts.quality || 80, ...opts });
  return transform ? `${base}/tr:${transform}${cleanPath}` : `${base}${cleanPath}`;
}

/** Preset transformations */
export const imagePresets = {
  hero: (path: string) => getImageKitUrl(path, { width: 1920, quality: 85, focus: 'auto', aspectRatio: '21-9' }),
  card: (path: string) => getImageKitUrl(path, { width: 640, quality: 80, focus: 'auto', aspectRatio: '4-3' }),
  thumbnail: (path: string) => getImageKitUrl(path, { width: 320, quality: 75, focus: 'auto' }),
  og: (path: string) => getImageKitUrl(path, { width: 1200, height: 630, quality: 85, focus: 'auto' }),
  gallery: (path: string) => getImageKitUrl(path, { width: 800, quality: 80, focus: 'auto' }),
  blur: (path: string) => getImageKitUrl(path, { width: 32, quality: 20, blur: 30 }),
} as const;

/** Generate responsive srcSet */
export function getResponsiveSrcSet(path: string, widths = [320, 640, 960, 1280, 1920]): string {
  return widths.map((w) => `${getImageKitUrl(path, { width: w })} ${w}w`).join(', ');
}

/** Resolve image: prefer ImageKit path, fallback to raw URL or placeholder */
export function resolveImageUrl(
  imageUrl: string | undefined | null,
  fallback = '/images/placeholder.jpg'
): string {
  if (!imageUrl) return fallback;
  if (IMAGEKIT_URL && !imageUrl.startsWith('http')) {
    return getImageKitUrl(imageUrl);
  }
  return imageUrl || fallback;
}
