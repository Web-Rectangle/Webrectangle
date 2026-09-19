/**
 * Display formatters.
 *
 * Centralised so that a follower count renders identically in the hero, the
 * discovery grid and the comparison table. Inconsistent number formatting is
 * one of the fastest ways to make a product feel unfinished.
 */

/**
 * Compact follower/view counts: 8_900 -> "8.9K", 214_000 -> "214K",
 * 1_240_000 -> "1.24M".
 *
 * Uses Western K/M rather than Indian lakh/crore because creator audience
 * sizes are quoted in K/M across Instagram, YouTube and every competing tool -
 * switching units here would make our numbers look wrong next to a creator's
 * own profile. Currency still uses Indian conventions; see formatInr.
 */
export function formatCount(value: number): string {
  if (value < 1_000) return String(value);

  if (value < 1_000_000) {
    const k = value / 1_000;
    // Drop the decimal past 100K, where a tenth of a thousand is noise.
    return k >= 100 ? `${Math.round(k)}K` : `${trimZero(k.toFixed(1))}K`;
  }

  return `${trimZero((value / 1_000_000).toFixed(2))}M`;
}

function trimZero(s: string): string {
  return s.replace(/\.?0+$/, '');
}

/** Engagement rate as a single-decimal percentage. */
export function formatPercent(value: number): string {
  return `${trimZero(value.toFixed(1))}%`;
}

/**
 * Indian rupee amounts from a minor-unit (paise) integer.
 * Money is stored as an integer everywhere; see prisma/schema.prisma.
 */
export function formatInr(minorUnits: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(minorUnits / 100);
}

/** "fitwithriya" -> "@fitwithriya" */
export function formatHandle(handle: string): string {
  return handle.startsWith('@') ? handle : `@${handle}`;
}

/** "product-launch" -> "Product launch" */
export function humanise(value: string): string {
  const spaced = value.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
