/**
 * In-process rate limiter.
 *
 * SCOPE AND LIMITS: this is a single-instance, in-memory sliding window. It is
 * genuinely useful against the common case - one script hammering the contact
 * form - and useless against a distributed attack or across multiple serverless
 * instances, each of which gets its own map.
 *
 * That trade-off is deliberate at this stage. It costs nothing, adds no
 * infrastructure, and stops the abuse we are actually likely to see. When the
 * site warrants it, swap the Map for Upstash Redis or Vercel KV; the exported
 * signature is designed not to change.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Entries older than this are swept so the map cannot grow without bound. */
const SWEEP_AFTER_MS = 10 * 60 * 1000;
let lastSweep = Date.now();

function sweep(now: number): void {
  if (now - lastSweep < SWEEP_AFTER_MS) return;
  lastSweep = now;

  for (const [key, window] of windows) {
    if (window.resetAt < now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window resets. Suitable for a Retry-After header. */
  retryAfter: number;
};

/**
 * @param key      Caller-scoped identity, usually `${route}:${ip}`.
 * @param limit    Requests permitted per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt < now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { allowed: true, retryAfter: 0 };
}

/**
 * Best-effort client IP from proxy headers.
 *
 * These headers are trivially spoofable, so this is only ever a rate-limiting
 * hint and must never be used for authorisation. `x-forwarded-for` may carry a
 * chain; the first entry is the original client.
 */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  return headers.get('x-real-ip') ?? 'unknown';
}
