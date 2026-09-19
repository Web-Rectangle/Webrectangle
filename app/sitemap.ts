import type { MetadataRoute } from 'next';

import { sortedArticles } from '@/lib/content/resources';
import { env } from '@/lib/env';

/**
 * XML sitemap.
 *
 * Priorities reflect what we actually want ranking: the homepage and the two
 * audience pages carry the positioning, and /discover is the product surface
 * that matches the highest-intent searches. Utility pages are present so they
 * are discoverable but are not competing for crawl budget.
 *
 * /kitchen-sink and /login are deliberately absent - one is development-only,
 * the other is noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = env.NEXT_PUBLIC_SITE_URL;
  const now = new Date();

  const pages: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  }> = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/for-brands', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/for-creators', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/discover', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/resources', priority: 0.6, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/join/brand', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/join/creator', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  ];

  const staticEntries = pages.map((page) => ({
    url: new URL(page.path, base).toString(),
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const articleEntries = sortedArticles().map((article) => ({
    url: new URL(`/resources/${article.slug}`, base).toString(),
    lastModified: new Date(article.published),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...articleEntries];
}
