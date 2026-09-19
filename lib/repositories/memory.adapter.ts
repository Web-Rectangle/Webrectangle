import { randomUUID } from 'node:crypto';

import seed from '@/content/seed/creators.json';
import { countFacets, matchesFilters, sortCreators } from '@/lib/creators/filter';
import { type Creator, type CreatorFilters, creatorSchema } from '@/lib/schemas/creator';
import type { Lead, LeadInput, WaitlistEntry, WaitlistInput } from '@/lib/schemas/lead';

import type {
  CreatorRepository,
  CreatorSearchResult,
  LeadRepository,
  Repositories,
  WaitlistRepository,
} from './types';

/**
 * In-memory adapter, backed by seed JSON.
 *
 * This is the default, and it is what makes `npm run dev` work immediately
 * after a clone with no environment configuration. The creators it returns are
 * illustrative sample profiles, not a real network - every surface rendering
 * them must also render <SampleDataNotice />.
 *
 * Filtering is delegated to lib/creators/filter.ts, the same pure module the
 * client-side demos use, so server results and in-browser results cannot
 * diverge.
 */

/**
 * Seed data is validated once at module load. A malformed record becomes a
 * build-time failure rather than a runtime surprise in a request handler.
 */
const CREATORS: Creator[] = creatorSchema.array().parse(seed);

const creators: CreatorRepository = {
  async search(filters: CreatorFilters): Promise<CreatorSearchResult> {
    const matched = CREATORS.filter((c) => matchesFilters(c, filters));
    const sorted = sortCreators(matched, filters.sort);

    return {
      items: sorted.slice(0, filters.limit),
      total: matched.length,
      // Counted over the full dataset rather than the matched subset, so
      // option counts in the filter rail do not collapse to zero as a user
      // narrows their search.
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
 * Leads captured with no database configured.
 *
 * Held in a module-level array, so they do not survive a restart. That is
 * acceptable only because lib/services/notify.ts always forwards a submission
 * somewhere durable (email, Slack, a local JSONL file, or a WhatsApp handoff)
 * before this runs. The array exists to honour the repository contract, not as
 * a storage strategy.
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

/**
 * Direct read of the seed set, for client components that filter locally.
 *
 * Bypasses the repository intentionally: the hero and discovery demos need a
 * plain array to hand to the browser, and routing that through an async
 * repository call would add a round trip for data that is already static.
 */
export function getSeedCreators(): Creator[] {
  return CREATORS;
}
