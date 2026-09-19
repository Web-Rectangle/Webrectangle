import type { MetadataRoute } from 'next';

import { env } from '@/lib/env';

/**
 * robots.txt.
 *
 * /api is disallowed because the endpoints return JSON that would dilute the
 * indexed surface, and /kitchen-sink is a development-only gallery. Everything
 * else is open - there is nothing on this site we want ranking that a crawler
 * should not see.
 */
export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_SITE_URL;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/kitchen-sink', '/login'],
      },
    ],
    sitemap: new URL('/sitemap.xml', base).toString(),
    host: base,
  };
}
