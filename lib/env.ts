import { z } from 'zod';

/**
 * Validated environment configuration.
 *
 * DESIGN RULE: every integration here is optional and has a working no-op
 * default. The site must run correctly after a fresh clone with no `.env` file
 * at all - forms still capture, discovery still works against seed data, and
 * nothing throws. Setting a variable upgrades a capability; leaving it unset
 * never breaks one.
 *
 * Parsed once at module load so a malformed value fails fast at build time
 * rather than at 2am in a request handler.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  /** Canonical origin, used for metadata, sitemap and OG image URLs. */
  NEXT_PUBLIC_SITE_URL: z.url().default('https://webrectangle.com'),

  /**
   * When set, lib/repositories resolves to the Prisma adapter instead of the
   * in-memory one. This single variable is the entire "go to a real database"
   * switch.
   */
  DATABASE_URL: z.string().min(1).optional(),

  /** Transactional email. Unset -> notifications fall through to the next channel. */
  RESEND_API_KEY: z.string().min(1).optional(),
  LEAD_NOTIFY_EMAIL: z.email().optional(),

  /** Incoming-webhook URL for lead notifications. */
  SLACK_WEBHOOK_URL: z.url().optional(),

  /** Cloudflare Turnstile. Both must be set for verification to activate. */
  TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1).optional(),

  /** Cookieless analytics. Unset -> track() is a no-op. */
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().min(1).optional(),

  /** Meeting scheduler embedded on /contact. */
  NEXT_PUBLIC_CAL_LINK: z.string().min(1).optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Surfacing the field list rather than the raw Zod dump keeps the build log
  // readable and avoids echoing secret values.
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;

/**
 * Capability flags derived from what is actually configured. Prefer these over
 * checking `env.SOMETHING !== undefined` at call sites so the reasoning behind
 * each switch lives in one place.
 */
export const features = {
  /** A real database is configured; the Prisma adapter should be used. */
  database: Boolean(env.DATABASE_URL),
  email: Boolean(env.RESEND_API_KEY && env.LEAD_NOTIFY_EMAIL),
  slack: Boolean(env.SLACK_WEBHOOK_URL),
  turnstile: Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY),
  analytics: Boolean(env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN),
  scheduling: Boolean(env.NEXT_PUBLIC_CAL_LINK),
} as const;

/** Public business contact details. Referenced by the WhatsApp fallback and footer. */
export const contact = {
  email: 'contact@webrectangle.com',
  phoneDisplay: '+91 93680 65654',
  /** E.164 without the leading plus, for wa.me links. */
  whatsapp: '919368065654',
  city: 'Noida, India',
  instagram: 'https://www.instagram.com/webrectangle/',
} as const;
