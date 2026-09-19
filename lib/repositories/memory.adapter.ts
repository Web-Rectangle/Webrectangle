import { randomUUID } from 'node:crypto';

import seed from '@/content/seed/creators.json';
import { type Creator, type CreatorFilters, creatorSchema } from '@/lib/schemas/creator';
import type { Lead, LeadInput, WaitlistEntry, WaitlistInput } from '@/lib/schemas/lead';

import type {
  CreatorRepository,
  CreatorSearchResult,
  Facets,
  LeadRepository,
  Repositories,
  WaitlistRepository,
} from './types';

/**
 * In-memory adapter, backed by seed JSON.
 *
 * This is the default and it is what makes `npm run dev` work immediately
 * after a clone with no environment configuration. The creators it returns are
 * illustrative sample profiles, not a real network - every surface rendering
 * them must also render <SampleDataNotice />.
 *
 * Filtering happens in JS over a small fixed array. That is fine at this size
 * and intentionally mirrors the query shape the Prisma adapter implements, so
 * behaviour stays identical across the swap.
 */

/**
 * Seed data is validated once at module load. A malformed record is a build
 * time problem, not a runtime surprise in a request handler.
 */
const CREATORS: Creator[] = creatorSchema.array().parse(seed);

function matches(creator: Creator, f: CreatorFilters): boolean {
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
    const needle = f.q.toLowerCase();
    const haystack = [
      creator.displayName,
      creator.handle,
      creator.niche,
      creator.city,
      creator.region,
      creator.category,
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

/**
 * Relevance ordering for the default sort.
 *
 * Deliberately not "most followers first" - the product thesis is relevance
 * over reach, so engagement is weighted above audience size, with a mild
 * penalty for very large accounts where engagement typically thins out.
 */
function relevanceScore(creator: Creator): number {
  const engagement = creator.engagementRate * 10;
  const reach = Math.log10(Math.max(creator.followers, 1));
  return engagement + reach;
}

function sortCreators(items: Creator[], sort: CreatorFilters['sort']): Creator[] {
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

function countFacets(items: Creator[]): Facets {
  const facets: Facets = { platforms: {}, categories: {}, cities: {}, tiers: {} };

  for (const c of items) {
    facets.platforms[c.platform] = (facets.platforms[c.platform] ?? 0) + 1;
    facets.categories[c.category] = (facets.categories[c.category] ?? 0) + 1;
    facets.cities[c.city] = (facets.cities[c.city] ?? 0) + 1;
    facets.tiers[c.tier] = (facets.tiers[c.tier] ?? 0) + 1;
  }

  return facets;
}

const creators: CreatorRepository = {
  async search(filters: CreatorFilters): Promise<CreatorSearchResult> {
    const matched = CREATORS.filter((c) => matches(c, filters));
    const sorted = sortCreators(matched, filters.sort);

    return {
      items: sorted.slice(0, filters.limit),
      total: matched.length,
      // Facets are counted over the full dataset rather than the matched
      // subset so option counts do not collapse to zero as filters narrow.
      facets: countFacets(CREATORS),
    };
  },

  async findByHandle(handle: string): Promise<Creator | null> {
    const normalised = handle.replace(/^@/, '').toLowerCase();
    return CREATORS.find((c) => c.handle.toLowerCase() === normalised) ?? null;
  },

  async findManyByIds(ids: readonly string[]): Promise<Creator[]> {
    const wanted = new Set(ids);
    return CREATORS.filter((c) => wanted.has(c.id));
  },

  async listCities(): Promise<string[]> {
    return [...new Set(CREATORS.map((c) => c.city))].sort((a, b) => a.localeCompare(b));
  },
};

/**
 * Leads captured without a database configured.
 *
 * Held in a module-level array, which means they do not survive a restart -
 * that is acceptable only because lib/services/notify.ts always forwards the
 * submission somewhere durable (email, Slack, a local JSONL file, or a
 * WhatsApp handoff) before this ever runs. The array exists so the repository
 * contract is honoured, not as a storage strategy.
 */
const capturedLeads: Lead[] = [];
const capturedWaitlist: WaitlistEntry[] = [];

const leads: LeadRepository = {
  async create(input: LeadInput): Promise<Lead> {
    const lead: Lead = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    capturedLeads.push(lead);
    return lead;
  },
};

const waitlist: WaitlistRepository = {
  async create(input: WaitlistInput): Promise<WaitlistEntry> {
    const entry: WaitlistEntry = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    capturedWaitlist.push(entry);
    return entry;
  },
};

export const memoryRepositories: Repositories = {
  creators,
  leads,
  waitlist,
  adapter: 'memory',
};
