import type { Creator, CreatorFilters } from '@/lib/schemas/creator';
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
 * Prisma-backed adapter.
 *
 * ACTIVATION (the entire "move to a real database" procedure):
 *   1. npm install @prisma/client
 *   2. set DATABASE_URL in .env
 *   3. npx prisma migrate dev
 *   4. npm run dev
 *
 * No component, page or Server Action changes. lib/repositories/index.ts sees
 * DATABASE_URL, dynamically imports this module instead of the memory adapter,
 * and every call site keeps working because both satisfy the same contract.
 *
 * WHY THE CLIENT IS TYPED LOCALLY: @prisma/client is deliberately not a
 * dependency of this project yet, so that a fresh clone installs fast and runs
 * with zero configuration. Declaring the narrow slice of the generated client
 * we actually use keeps this file type-checking before `prisma generate` has
 * ever been run, and the real generated types are structurally compatible.
 */

type Where = Record<string, unknown>;

type CreatorRow = {
  id: string;
  handle: string;
  displayName: string;
  platform: string;
  category: string;
  niche: string;
  city: string;
  region: string;
  languages: string[];
  followers: number;
  engagementRate: number;
  avgViews: number;
  contentTypes: string[];
  primaryAgeBand: string;
  primaryAgeShare: number;
  femaleShare: number;
  topLocations: string[];
  pastCollaborations: number;
  bio: string;
  tier: string;
};

type Delegate<Row> = {
  findMany(args?: {
    where?: Where;
    orderBy?: Record<string, 'asc' | 'desc'>;
    take?: number;
  }): Promise<Row[]>;
  findFirst(args: { where: Where }): Promise<Row | null>;
  count(args?: { where?: Where }): Promise<number>;
  groupBy(args: { by: string[]; _count: true }): Promise<Array<Record<string, unknown>>>;
  create(args: { data: Record<string, unknown> }): Promise<Row>;
};

type PrismaClientLike = {
  creator: Delegate<CreatorRow>;
  lead: Delegate<Lead>;
  waitlistEntry: Delegate<WaitlistEntry>;
  $disconnect(): Promise<void>;
};

/**
 * Loaded through a non-literal specifier so the bundler and the type checker
 * both treat @prisma/client as optional. This module is itself only imported
 * when DATABASE_URL is set, so the indirection never runs otherwise.
 */
const PRISMA_MODULE = '@prisma/client';

async function loadPrismaClient(): Promise<PrismaClientLike> {
  let mod: unknown;
  try {
    mod = await import(/* webpackIgnore: true */ PRISMA_MODULE);
  } catch {
    throw new Error(
      'DATABASE_URL is set but @prisma/client is not installed. Run: npm install @prisma/client && npx prisma generate',
    );
  }

  const ctor = (mod as { PrismaClient?: new () => PrismaClientLike }).PrismaClient;
  if (!ctor) throw new Error('@prisma/client did not export PrismaClient.');

  return new ctor();
}

/** Flatten the relational row back into the flat domain shape the UI expects. */
function toCreator(row: CreatorRow): Creator {
  return {
    id: row.id,
    handle: row.handle,
    displayName: row.displayName,
    platform: row.platform as Creator['platform'],
    category: row.category as Creator['category'],
    niche: row.niche,
    city: row.city,
    region: row.region,
    languages: row.languages,
    followers: row.followers,
    engagementRate: row.engagementRate,
    avgViews: row.avgViews,
    contentTypes: row.contentTypes as Creator['contentTypes'],
    audience: {
      primaryAgeBand: row.primaryAgeBand as Creator['audience']['primaryAgeBand'],
      primaryAgeShare: row.primaryAgeShare,
      femaleShare: row.femaleShare,
      topLocations: row.topLocations,
    },
    pastCollaborations: row.pastCollaborations,
    bio: row.bio,
    tier: row.tier as Creator['tier'],
  };
}

/** Translate the shared filter object into a Prisma `where` clause. */
function buildWhere(f: CreatorFilters): Where {
  const where: Where = {};

  if (f.platforms?.length) where.platform = { in: f.platforms };
  if (f.categories?.length) where.category = { in: f.categories };
  if (f.cities?.length) where.city = { in: f.cities };
  if (f.tiers?.length) where.tier = { in: f.tiers };
  if (f.contentTypes?.length) where.contentTypes = { hasSome: f.contentTypes };
  if (f.languages?.length) where.languages = { hasSome: f.languages };

  if (f.minFollowers !== undefined || f.maxFollowers !== undefined) {
    where.followers = {
      ...(f.minFollowers !== undefined ? { gte: f.minFollowers } : {}),
      ...(f.maxFollowers !== undefined ? { lte: f.maxFollowers } : {}),
    };
  }

  if (f.minEngagement !== undefined) where.engagementRate = { gte: f.minEngagement };

  if (f.q) {
    where.OR = [
      { displayName: { contains: f.q, mode: 'insensitive' } },
      { handle: { contains: f.q, mode: 'insensitive' } },
      { niche: { contains: f.q, mode: 'insensitive' } },
      { city: { contains: f.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

function buildOrderBy(sort: CreatorFilters['sort']): Record<string, 'asc' | 'desc'> {
  switch (sort) {
    case 'followers-desc':
      return { followers: 'desc' };
    case 'followers-asc':
      return { followers: 'asc' };
    case 'engagement-desc':
    case 'relevance':
    default:
      // The memory adapter's relevance score is not expressible in a plain
      // orderBy. Engagement-first is the closest single-column approximation;
      // move to a generated score column if ordering fidelity starts to matter.
      return { engagementRate: 'desc' };
  }
}

async function buildFacets(db: PrismaClientLike): Promise<Facets> {
  const facets: Facets = { platforms: {}, categories: {}, cities: {}, tiers: {} };

  const fields = [
    ['platform', 'platforms'],
    ['category', 'categories'],
    ['city', 'cities'],
    ['tier', 'tiers'],
  ] as const;

  for (const [column, bucket] of fields) {
    const rows = await db.creator.groupBy({ by: [column], _count: true });
    for (const row of rows) {
      const key = String(row[column]);
      facets[bucket][key] = Number(row._count ?? 0);
    }
  }

  return facets;
}

export async function createPrismaRepositories(): Promise<Repositories> {
  const db = await loadPrismaClient();

  const creators: CreatorRepository = {
    async search(filters: CreatorFilters): Promise<CreatorSearchResult> {
      const where = buildWhere(filters);
      const [rows, total, facets] = await Promise.all([
        db.creator.findMany({ where, orderBy: buildOrderBy(filters.sort), take: filters.limit }),
        db.creator.count({ where }),
        buildFacets(db),
      ]);

      return { items: rows.map(toCreator), total, facets };
    },

    async findByHandle(handle: string): Promise<Creator | null> {
      const row = await db.creator.findFirst({ where: { handle: handle.replace(/^@/, '') } });
      return row ? toCreator(row) : null;
    },

    async findManyByIds(ids: readonly string[]): Promise<Creator[]> {
      const rows = await db.creator.findMany({ where: { id: { in: [...ids] } } });
      return rows.map(toCreator);
    },

    async listCities(): Promise<string[]> {
      const rows = await db.creator.groupBy({ by: ['city'], _count: true });
      return rows.map((r) => String(r.city)).sort((a, b) => a.localeCompare(b));
    },
  };

  const leads: LeadRepository = {
    async create(input: LeadInput): Promise<Lead> {
      return db.lead.create({ data: { ...input } });
    },
  };

  const waitlist: WaitlistRepository = {
    async create(input: WaitlistInput): Promise<WaitlistEntry> {
      return db.waitlistEntry.create({ data: { ...input } });
    },
  };

  return { creators, leads, waitlist, adapter: 'prisma' };
}
