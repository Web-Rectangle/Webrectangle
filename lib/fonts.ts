import { Inter } from 'next/font/google';

/**
 * Inter, self-hosted by Next at build time.
 *
 * Carried over from the legacy site, which loaded Inter 400-800 from the
 * Google Fonts CDN. Routing it through `next/font` instead removes the
 * render-blocking stylesheet and the third-party connection, and lets Next
 * emit a `size-adjust` fallback so the swap causes no layout shift.
 *
 * `cv11` gives the single-storey lowercase 'a' used across the brand; `ss01`
 * tidies the ampersand and related glyphs.
 */
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  axes: ['opsz'],
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});
