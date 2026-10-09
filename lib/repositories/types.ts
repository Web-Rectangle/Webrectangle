import type {
  Campaign,
  CampaignStatus,
  Invitation,
  InvitationStatus,
} from '@/lib/schemas/campaign';
import type { Creator, CreatorFilters } from '@/lib/schemas/creator';
import type {
  AudienceType,
  Lead,
  LeadInput,
  SubmissionStatus,
  WaitlistEntry,
  WaitlistInput,
} from '@/lib/schemas/lead';

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
  findById(id: string): Promise<Creator | null>;
  findManyByIds(ids: readonly string[]): Promise<Creator[]>;
  /** Distinct cities present in the dataset, for the location filter. */
  listCities(): Promise<string[]>;

  /**
   * Publish a profile into the live discovery listing.
   *
   * Called by the admin panel once an approved creator's details have been
   * filled in. Profiles created this way sit alongside the seed set and are
   * returned by search like any other.
   */
  upsert(creator: Creator): Promise<Creator>;

  /**
   * Every creator the admin panel should manage, hidden ones included.
   *
   * Distinct from `search`, which only ever returns what the public should
   * see. An admin needs to find a hidden profile in order to unhide it.
   */
  listAll(options?: { includeHidden?: boolean }): Promise<CreatorAdminRecord[]>;

  /** Remove from the public listing without deleting the profile. */
  setHidden(id: string, hidden: boolean): Promise<void>;

  /** Pin to the front of the listing. */
  setFeatured(id: string, featured: boolean): Promise<void>;

  /** Reorder the featured set. Ids not in the list keep their relative order. */
  reorderFeatured(ids: readonly string[]): Promise<void>;

  /**
   * Delete a profile outright.
   *
   * Seed profiles live in a read-only JSON file, so deleting one records a
   * tombstone rather than splicing an array. Either way it stops appearing.
   */
  remove(id: string): Promise<void>;
}

/** A creator plus the admin-only state that is never exposed publicly. */
export type CreatorAdminRecord = Creator & {
  hidden: boolean;
  featured: boolean;
};

export interface LeadRepository {
  create(input: LeadInput): Promise<Lead>;
  /** Newest first. Optionally narrowed to one audience or review state. */
  list(filter?: { audience?: AudienceType; status?: SubmissionStatus }): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  setStatus(id: string, status: SubmissionStatus): Promise<Lead | null>;
  /** Records which published profile an approved creator submission became. */
  linkPublishedCreator(id: string, creatorId: string): Promise<Lead | null>;
  /** Private admin annotation. Never surfaced to the submitter. */
  setNote(id: string, note: string): Promise<Lead | null>;
}

export interface WaitlistRepository {
  create(input: WaitlistInput): Promise<WaitlistEntry>;
  list(filter?: { audience?: AudienceType }): Promise<WaitlistEntry[]>;
}

export type CampaignInput = Omit<Campaign, 'id' | 'createdAt'>;

export interface CampaignRepository {
  create(input: CampaignInput): Promise<Campaign>;
  findById(id: string): Promise<Campaign | null>;
  listByBrand(brandId: string): Promise<Campaign[]>;
  updateStatus(id: string, status: CampaignStatus): Promise<Campaign | null>;
}

export type InvitationInput = {
  campaignId: string;
  creatorId: string;
  message?: string;
};

export interface InvitationRepository {
  create(input: InvitationInput): Promise<Invitation>;
  findById(id: string): Promise<Invitation | null>;
  listByCreator(creatorId: string): Promise<Invitation[]>;
  listByCampaign(campaignId: string): Promise<Invitation[]>;
  respond(id: string, status: InvitationStatus, message?: string): Promise<Invitation | null>;
}

export type Repositories = {
  creators: CreatorRepository;
  leads: LeadRepository;
  waitlist: WaitlistRepository;
  campaigns: CampaignRepository;
  invitations: InvitationRepository;
  /** Identifies which adapter is active; surfaced by /api/health. */
  adapter: 'memory' | 'prisma';
};
