import type { Creator, CreatorFilters } from '@/lib/schemas/creator';
import type { Lead, LeadInput, WaitlistEntry, WaitlistInput } from '@/lib/schemas/lead';

/**
 * Repository contracts.
 *
 * WHY THIS LAYER EXISTS: the UI must never know where data comes from. Every
 * component and Server Action talks to these interfaces, so moving from seed
 * JSON to Postgres is a one-line change in lib/repositories/index.ts with zero
 * component edits. That is the whole "backend-friendly" requirement, and it
 * only holds if nothing imports an adapter directly.
 *
 * All methods are async even where the in-memory implementation is synchronous,
 * so that swapping in a real database does not change any call site.
 */

/** Counts per facet value, used to label and disable filter options. */
export type Facets = {
  platforms: Record<string, number>;
  categories: Record<string, number>;
  cities: Record<string, number>;
  tiers: Record<string, number>;
};

export type CreatorSearchResult = {
  items: Creator[];
  /** Total matches before the limit is applied. */
  total: number;
  facets: Facets;
};

export interface CreatorRepository {
  search(filters: CreatorFilters): Promise<CreatorSearchResult>;
  findByHandle(handle: string): Promise<Creator | null>;
  findManyByIds(ids: readonly string[]): Promise<Creator[]>;
  /** Distinct cities present in the dataset, for the location filter. */
  listCities(): Promise<string[]>;
}

export interface LeadRepository {
  create(input: LeadInput): Promise<Lead>;
}

export interface WaitlistRepository {
  create(input: WaitlistInput): Promise<WaitlistEntry>;
}

export type Repositories = {
  creators: CreatorRepository;
  leads: LeadRepository;
  waitlist: WaitlistRepository;
  /** Identifies which adapter is active; surfaced by /api/health. */
  adapter: 'memory' | 'prisma';
};
