import type { Facets } from '@/lib/repositories/types';
import type { Creator, CreatorFilters } from '@/lib/schemas/creator';

/**
 * Pure creator filtering, sorting and faceting.
 *
 * Shared deliberately: the in-memory repository uses it on the server, and the
 * interactive hero and discovery demos use it on the client for instant
 * feedback without a round trip. Keeping one implementation means the demo can
 * never quietly disagree with the real search.
 *
 * No I/O, no React, no framework imports - safe to run anywhere.
 */

export function matchesFilters(creator: Creator, f: CreatorFilters): boolean {
  if (f.platforms?.length && !f.platforms.includes(creator.platform)) return false;
  if (f.categories?.length && !f.categories.includes(creator.category)) return false;
  if (f.cities?.length && !f.cities.includes(creator.city)) return false;
  if (f.tiers?.length && !f.tiers.includes(creator.tier)) return false;

  if (f.contentTypes?.length && !f.contentTypes.some((t) => creator.contentTypes.includes(t))) {
    return false;
  }
  if (f.languages?.length && !f.languages.some((l) => creator.languages.includes(l))) {
    return false;
  }

  if (f.minFollowers !== undefined && creator.followers < f.minFollowers) return false;
  if (f.maxFollowers !== undefined && creator.followers > f.maxFollowers) return false;
  if (f.minEngagement !== undefined && creator.engagementRate < f.minEngagement) return false;

  if (f.q) {
    const needle = f.q.toLowerCase().trim();
    const haystack = [
      creator.displayName,
      creator.handle,
      creator.niche,
      creator.city,
      creator.region,
      creator.category,
      ...creator.languages,
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

/**
 * Default ordering.
 *
 * Deliberately not follower count. The product thesis is relevance over reach,
 * so engagement dominates and audience size contributes only logarithmically -
 * enough to break ties between similarly engaged creators without letting a
 * large account outrank a better-matched small one.
 */
export function relevanceScore(creator: Creator): number {
  return creator.engagementRate * 10 + Math.log10(Math.max(creator.followers, 1));
}

export function sortCreators(items: readonly Creator[], sort: CreatorFilters['sort']): Creator[] {
  const sorted = [...items];

  switch (sort) {
    case 'followers-desc':
      return sorted.sort((a, b) => b.followers - a.followers);
    case 'followers-asc':
      return sorted.sort((a, b) => a.followers - b.followers);
    case 'engagement-desc':
      return sorted.sort((a, b) => b.engagementRate - a.engagementRate);
    case 'relevance':
    default:
      return sorted.sort((a, b) => relevanceScore(b) - relevanceScore(a));
  }
}

export function countFacets(items: readonly Creator[]): Facets {
  const facets: Facets = { platforms: {}, categories: {}, cities: {}, tiers: {} };

  for (const c of items) {
    facets.platforms[c.platform] = (facets.platforms[c.platform] ?? 0) + 1;
    facets.categories[c.category] = (facets.categories[c.category] ?? 0) + 1;
    facets.cities[c.city] = (facets.cities[c.city] ?? 0) + 1;
    facets.tiers[c.tier] = (facets.tiers[c.tier] ?? 0) + 1;
  }

  return facets;
}
