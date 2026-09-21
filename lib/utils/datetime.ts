/**
 * Date formatting for the admin panel.
 *
 * Relative times ("2h ago") are far easier to triage a queue by than absolute
 * timestamps - the question is almost always "how stale is this", not "what
 * time exactly". The absolute value stays available as a tooltip.
 */

const UNITS: ReadonlyArray<
  [limitSeconds: number, seconds: number, label: Intl.RelativeTimeFormatUnit]
> = [
  [60, 1, 'second'],
  [3600, 60, 'minute'],
  [86_400, 3600, 'hour'],
  [604_800, 86_400, 'day'],
  [2_629_800, 604_800, 'week'],
  [31_557_600, 2_629_800, 'month'],
  [Infinity, 31_557_600, 'year'],
];

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "3 hours ago", "just now". */
export function formatRelative(iso: string, now = Date.now()): string {
  const elapsed = (new Date(iso).getTime() - now) / 1000;
  const magnitude = Math.abs(elapsed);

  if (magnitude < 30) return 'just now';

  for (const [limit, seconds, unit] of UNITS) {
    if (magnitude < limit) return relative.format(Math.round(elapsed / seconds), unit);
  }

  return relative.format(Math.round(elapsed / 31_557_600), 'year');
}

/** Full timestamp, for tooltips and detail views. */
export function formatAbsolute(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
