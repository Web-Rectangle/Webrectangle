import type { Creator, CreatorFilters } from '@/lib/schemas/creator';
import type { Lead, LeadInput, WaitlistEntry, WaitlistInput } from '@/lib/schemas/lead';

import type {
  CreatorAdminRecord,
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
  origin: string;
  hidden: boolean;
  featured: boolean;
  featuredOrder: number | null;
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
  update(args: { where: Where; data: Record<string, unknown> }): Promise<Row>;
  upsert(args: {
    where: Where;
    create: Record<string, unknown>;
    update: Record<string, unknown>;
  }): Promise<Row>;
  delete(args: { where: Where }): Promise<Row>;
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
    origin: (row.origin as Creator['origin']) ?? 'seed',
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

    async findById(id: string): Promise<Creator | null> {
      const row = await db.creator.findFirst({ where: { id } });
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

    async upsert(creator: Creator): Promise<Creator> {
      // The nested `audience` object is flattened onto the row; see toCreator
      // for the inverse mapping.
      const { audience, ...rest } = creator;
      const data = { ...rest, ...audience };

      const row = await db.creator.upsert({
        where: { id: creator.id },
        create: data,
        update: data,
      });

      return toCreator(row);
    },

    /*
     * Visibility and ordering are real columns here, not an overlay. The
     * memory adapter needs a side table because seed profiles come from
     * read-only JSON; a database row has no such constraint, so the state
     * lives where it belongs.
     */
    async listAll(options): Promise<CreatorAdminRecord[]> {
      const where: Where = {};
      if (options?.includeHidden === false) where.hidden = false;

      const rows = await db.creator.findMany({ where, orderBy: { featuredOrder: 'asc' } });

      return rows.map((row) => ({
        ...toCreator(row),
        hidden: Boolean(row.hidden),
        featured: Boolean(row.featured),
      }));
    },

    async setHidden(id, hidden): Promise<void> {
      await db.creator.update({ where: { id }, data: { hidden } });
    },

    async setFeatured(id, featured): Promise<void> {
      await db.creator.update({
        where: { id },
        data: { featured, featuredOrder: featured ? Date.now() : null },
      });
    },

    async reorderFeatured(ids): Promise<void> {
      // Sequential rather than a transaction: the list is a handful of rows,
      // and a partial reorder is cosmetically wrong rather than corrupting.
      for (const [index, id] of ids.entries()) {
        await db.creator.update({
          where: { id },
          data: { featured: true, featuredOrder: index },
        });
      }
    },

    async remove(id): Promise<void> {
      await db.creator.delete({ where: { id } });
    },
  };

  const leads: LeadRepository = {
    async create(input: LeadInput): Promise<Lead> {
      return db.lead.create({ data: { ...input, status: 'pending' } });
    },

    async list(filter): Promise<Lead[]> {
      const where: Where = {};
      if (filter?.audience) where.audience = filter.audience;
      if (filter?.status) where.status = filter.status;

      return db.lead.findMany({ where, orderBy: { createdAt: 'desc' } });
    },

    async findById(id: string): Promise<Lead | null> {
      return db.lead.findFirst({ where: { id } });
    },

    async setStatus(id, status): Promise<Lead | null> {
      return db.lead.update({
        where: { id },
        data: { status, reviewedAt: new Date().toISOString() },
      });
    },

    async linkPublishedCreator(id, creatorId): Promise<Lead | null> {
      return db.lead.update({ where: { id }, data: { publishedCreatorId: creatorId } });
    },

    async setNote(id, note): Promise<Lead | null> {
      return db.lead.update({ where: { id }, data: { adminNote: note.trim() || null } });
    },
  };

  const waitlist: WaitlistRepository = {
    async create(input: WaitlistInput): Promise<WaitlistEntry> {
      return db.waitlistEntry.create({ data: { ...input, status: 'pending' } });
    },

    async list(filter): Promise<WaitlistEntry[]> {
      const where: Where = {};
      if (filter?.audience) where.audience = filter.audience;

      return db.waitlistEntry.findMany({ where, orderBy: { createdAt: 'desc' } });
    },
  };

  return { creators, leads, waitlist, adapter: 'prisma' };
}
