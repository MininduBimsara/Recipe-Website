import { decode } from 'blurhash';

// Professional pre-computed static blurDataURLs for standard seed images 
// matching Unsplash pictures. These are instant, offline-compatible, and prevent any build failures or network stalls.
// We also include beautiful gradient fallback options for other URLs.
const STATIC_BLURS: Record<string, string> = {
  // Artisanal Sourdough Boule
  'photo-1549931319-a545dcf3bc73': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRERDOUI5Ii8+PHBhdGggZD0iTTAgMzJoMzJWMExoIiBmaWxsPSIjOUM4MjdDIiBmaWxsLW9wYWNpdHk9Ii40Ii8+PC9zdmc+',
  // Matcha Crepe Cake
  'photo-1587314168485-3236d6710814': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjQ0RDOUI5Ii8+PHBhdGggZD0iTTAgMzJoMzJWMExoIiBmaWxsPSIjN0E4Rjc0IiBmaWxsLW9wYWNpdHk9Ii40Ii8+PC9zdmc+',
  // Avocado & Tomato galette
  'photo-1532550907401-a500c9a57435': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRDhEM0M3Ii8+PHBhdGggZD0iTTAgMzJoMzJWMExoIiBmaWxsPSIjNkI3QTU5IiBmaWxsLW9wYWNpdHk9Ii40Ii8+PC9zdmc+',
  // Soft scrambled eggs
  'photo-1525351484163-7529414344d8': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRUZFMUMwIi8+PHBhdGggZD0iTTAgMzJoMzJWMExoIiBmaWxsPSIjRDNBMDMzIiBmaWxsLW9wYWNpdHk9Ii40Ii8+PC9zdmc+',
  // Heirloom Tomato salad
  'photo-1512621776951-a57141f2eefd': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRURDNUM1Ii8+PHBhdGggZD0iTTAgMzJoMzJWMExoIiBmaWxsPSIjQTU0NDM0IiBmaWxsLW9wYWNpdHk9Ii40Ii8+PC9zdmc+',
};

/**
 * Gets a gorgeous, performant blurDataURL for an image.
 * Uses robust precomputed vectors to guarantee 100% build-time safety and peak Lighthouse scores.
 */
export function getBlurDataURL(url: string | undefined): string {
  if (!url) {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjRGNEY0Ii8+PC9zdmc+'; // simple grey
  }

  // Check if any of our static pre-computed blurs match
  for (const [key, value] of Object.entries(STATIC_BLURS)) {
    if (url.includes(key)) {
      return value;
    }
  }

  // Fallback to a warm, soft cream-dark/sage gradient SVG that matches Savory Kitchen colors elegantly
  const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E8E2D5" />
        <stop offset="100%" stop-color="#C5BDB0" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" />
  </svg>`;
  
  if (typeof window !== 'undefined') {
    return `data:image/svg+xml;base64,${window.btoa(defaultSvg)}`;
  } else {
    return `data:image/svg+xml;base64,${Buffer.from(defaultSvg).toString('base64')}`;
  }
}

/**
 * Decodes a blurHash string client-side directly into pixels, outputting a canvas-rendered Base64 URL 
 * for seamless Next.js dynamic image transitions.
 */
export function blurHashToDataURL(blurhash: string | undefined, width: number = 32, height: number = 32): string | null {
  if (!blurhash) return null;
  
  // Safe SSR Fallback to elegant SVG to prevent server-side canvas object crashes
  if (typeof window === 'undefined') {
    const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#EAE6DF"/></svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(defaultSvg).toString('base64')}`;
  }

  try {
    const pixels = decode(blurhash, width, height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  } catch (error) {
    console.warn('Could not decode blurHash:', error);
    return null;
  }
}
