/**
 * Article index.
 *
 * Kept as a typed array rather than derived from filesystem frontmatter: with
 * a handful of posts it is simpler, it type-checks, and ordering is explicit.
 * Move to frontmatter parsing when the count makes hand-maintenance annoying.
 *
 * Each entry must correspond to an app/resources/<slug>/page.mdx file.
 */

export type Article = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, used for sorting and for the dateline. */
  published: string;
  readingMinutes: number;
  tag: 'For brands' | 'For creators' | 'Measurement';
};

export const articles: readonly Article[] = [
  {
    slug: 'how-to-brief-a-creator',
    title: 'How to brief a creator properly',
    description:
      'Most collaborations go wrong at the brief, not the content. What to put in one, what to leave out, and why creative control is worth giving up.',
    published: '2026-09-12',
    readingMinutes: 6,
    tag: 'For brands',
  },
  {
    slug: 'engagement-rate-explained',
    title: 'Engagement rate: what it actually tells you',
    description:
      'Why a 9% engagement rate can be worse than a 3% one, how the number is calculated differently everywhere, and what to look at instead.',
    published: '2026-09-05',
    readingMinutes: 7,
    tag: 'Measurement',
  },
] as const;

export function articleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/** Newest first. */
export function sortedArticles(): Article[] {
  return [...articles].sort((a, b) => b.published.localeCompare(a.published));
}

export function formatArticleDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
