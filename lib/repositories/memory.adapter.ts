import { randomUUID } from 'node:crypto';

import seed from '@/content/seed/creators.json';
import { countFacets, matchesFilters, sortCreators } from '@/lib/creators/filter';
import { type Creator, type CreatorFilters, creatorSchema } from '@/lib/schemas/creator';
import type { Lead, LeadInput, WaitlistEntry, WaitlistInput } from '@/lib/schemas/lead';

import type {
  CreatorAdminRecord,
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
const SEED_CREATORS: Creator[] = creatorSchema.array().parse(seed);

/**
 * Mutable store, deliberately hung off globalThis.
 *
 * WHY NOT PLAIN MODULE VARIABLES: Next compiles every route into its own
 * server bundle, so a module imported by both `app/api/leads/route.ts` and
 * `app/admin/page.tsx` is instantiated more than once. With module-level
 * arrays, a lead written through the API is invisible to the admin page -
 * each route quietly gets a private store. Anchoring the state to globalThis
 * gives one instance per process regardless of how many times the module is
 * evaluated. This is the same trick used to keep a single Prisma client in
 * development.
 *
 * Still process-local, so it is wiped on restart. That is the accepted
 * trade-off until DATABASE_URL is set; swapping to the Prisma adapter makes it
 * durable with no change to any caller.
 */
type MemoryStore = {
  /** Profiles created through the admin panel. Seed profiles are never here. */
  publishedCreators: Creator[];
  /**
   * Visibility, ordering and deletion, keyed by creator id.
   *
   * An overlay rather than fields on the records themselves, because seed
   * profiles come from a read-only JSON file and cannot be mutated. Keying by
   * id means the same admin controls work identically on a seed sample and an
   * admin-created profile, with no branching at the call site.
   */
  hiddenCreatorIds: string[];
  deletedCreatorIds: string[];
  /** Ordered. Rendered ahead of everything else, in this order. */
  featuredCreatorIds: string[];
  leads: Lead[];
  waitlist: WaitlistEntry[];
};

const globalForMemory = globalThis as typeof globalThis & { __wrMemoryStore?: MemoryStore };

const store: MemoryStore = (globalForMemory.__wrMemoryStore ??= {
  publishedCreators: [],
  hiddenCreatorIds: [],
  deletedCreatorIds: [],
  featuredCreatorIds: [],
  leads: [],
  waitlist: [],
});

const PUBLISHED_CREATORS = store.publishedCreators;

function toggleIn(list: string[], id: string, on: boolean): void {
  const index = list.indexOf(id);
  if (on && index < 0) list.push(id);
  if (!on && index >= 0) list.splice(index, 1);
}

/**
 * Apply the featured ordering.
 *
 * Featured profiles lead, in the order an admin arranged them; everything else
 * keeps its natural order behind them.
 */
function applyFeaturedOrder(items: Creator[]): Creator[] {
  const order = store.featuredCreatorIds;
  if (order.length === 0) return items;

  const rank = new Map(order.map((id, i) => [id, i]));
  const featured = items
    .filter((c) => rank.has(c.id))
    .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
  const rest = items.filter((c) => !rank.has(c.id));

  return [...featured, ...rest];
}

/** Every profile that still exists, admin-created first, tombstones removed. */
function livingCreators(): Creator[] {
  const deleted = new Set(store.deletedCreatorIds);
  return [...PUBLISHED_CREATORS, ...SEED_CREATORS].filter((c) => !deleted.has(c.id));
}

/** What the public should see: living, not hidden, featured order applied. */
function allCreators(): Creator[] {
  const hidden = new Set(store.hiddenCreatorIds);
  return applyFeaturedOrder(livingCreators().filter((c) => !hidden.has(c.id)));
}

const creators: CreatorRepository = {
  async search(filters: CreatorFilters): Promise<CreatorSearchResult> {
    const pool = allCreators();
    const matched = pool.filter((c) => matchesFilters(c, filters));
    const sorted = sortCreators(matched, filters.sort);

    return {
      items: sorted.slice(0, filters.limit),
      total: matched.length,
      // Counted over the full dataset rather than the matched subset, so
      // option counts in the filter rail do not collapse to zero as a user
      // narrows their search.
      facets: countFacets(pool),
    };
  },

  async findByHandle(handle: string): Promise<Creator | null> {
    const normalised = handle.replace(/^@/, '').toLowerCase();
    return allCreators().find((c) => c.handle.toLowerCase() === normalised) ?? null;
  },

  async findById(id: string): Promise<Creator | null> {
    return allCreators().find((c) => c.id === id) ?? null;
  },

  async findManyByIds(ids: readonly string[]): Promise<Creator[]> {
    const wanted = new Set(ids);
    return allCreators().filter((c) => wanted.has(c.id));
  },

  async listCities(): Promise<string[]> {
    return [...new Set(allCreators().map((c) => c.city))].sort((a, b) => a.localeCompare(b));
  },

  async upsert(creator: Creator): Promise<Creator> {
    const index = PUBLISHED_CREATORS.findIndex((c) => c.id === creator.id);
    if (index >= 0) PUBLISHED_CREATORS[index] = creator;
    else PUBLISHED_CREATORS.unshift(creator);

    // Re-publishing something previously deleted should bring it back rather
    // than writing a record the tombstone immediately filters out again.
    toggleIn(store.deletedCreatorIds, creator.id, false);
    return creator;
  },

  async listAll(options): Promise<CreatorAdminRecord[]> {
    const hidden = new Set(store.hiddenCreatorIds);
    const featured = new Set(store.featuredCreatorIds);
    const includeHidden = options?.includeHidden ?? true;

    const pool = livingCreators().filter((c) => includeHidden || !hidden.has(c.id));

    return applyFeaturedOrder(pool).map((creator) => ({
      ...creator,
      hidden: hidden.has(creator.id),
      featured: featured.has(creator.id),
    }));
  },

  async setHidden(id, hidden): Promise<void> {
    toggleIn(store.hiddenCreatorIds, id, hidden);
  },

  async setFeatured(id, featured): Promise<void> {
    toggleIn(store.featuredCreatorIds, id, featured);
  },

  async reorderFeatured(ids): Promise<void> {
    store.featuredCreatorIds.splice(0, store.featuredCreatorIds.length, ...ids);
  },

  async remove(id): Promise<void> {
    const index = PUBLISHED_CREATORS.findIndex((c) => c.id === id);
    if (index >= 0) {
      PUBLISHED_CREATORS.splice(index, 1);
    } else {
      // A seed profile lives in read-only JSON, so it can only be tombstoned.
      toggleIn(store.deletedCreatorIds, id, true);
    }

    // Leave no dangling overlay entries behind.
    toggleIn(store.hiddenCreatorIds, id, false);
    toggleIn(store.featuredCreatorIds, id, false);
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
const capturedLeads = store.leads;
const capturedWaitlist = store.waitlist;

/** Newest first - the admin queue should open on what just arrived. */
function byNewest<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

const leads: LeadRepository = {
  async create(input: LeadInput): Promise<Lead> {
    const lead: Lead = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    capturedLeads.push(lead);
    return lead;
  },

  async list(filter): Promise<Lead[]> {
    let items = capturedLeads;
    if (filter?.audience) items = items.filter((l) => l.audience === filter.audience);
    if (filter?.status) items = items.filter((l) => l.status === filter.status);
    return byNewest(items);
  },

  async findById(id: string): Promise<Lead | null> {
    return capturedLeads.find((l) => l.id === id) ?? null;
  },

  async setStatus(id, status): Promise<Lead | null> {
    const lead = capturedLeads.find((l) => l.id === id);
    if (!lead) return null;

    lead.status = status;
    lead.reviewedAt = new Date().toISOString();
    return lead;
  },

  async linkPublishedCreator(id, creatorId): Promise<Lead | null> {
    const lead = capturedLeads.find((l) => l.id === id);
    if (!lead) return null;

    lead.publishedCreatorId = creatorId;
    return lead;
  },

  async setNote(id, note): Promise<Lead | null> {
    const lead = capturedLeads.find((l) => l.id === id);
    if (!lead) return null;

    lead.adminNote = note.trim() || undefined;
    return lead;
  },
};

const waitlist: WaitlistRepository = {
  async create(input: WaitlistInput): Promise<WaitlistEntry> {
    const entry: WaitlistEntry = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    capturedWaitlist.push(entry);
    return entry;
  },

  async list(filter): Promise<WaitlistEntry[]> {
    const items = filter?.audience
      ? capturedWaitlist.filter((e) => e.audience === filter.audience)
      : capturedWaitlist;
    return byNewest(items);
  },
};

export const memoryRepositories: Repositories = {
  creators,
  leads,
  waitlist,
  adapter: 'memory',
};

/**
 * Everything discovery should show, for client components that filter locally.
 *
 * Bypasses the repository intentionally: the hero and discovery demos need a
 * plain array to hand to the browser, and routing that through an async
 * repository call would add a round trip for data that is already in memory.
 *
 * Includes admin-published profiles as well as the seed set, so a creator
 * approved and published in the admin panel appears in discovery immediately.
 */
export function getSeedCreators(): Creator[] {
  return allCreators();
}
