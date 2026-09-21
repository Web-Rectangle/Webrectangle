import { z } from 'zod';

/**
 * Creator domain schemas.
 *
 * Zod is the single source of truth: TypeScript types are inferred from these
 * rather than declared separately, so the runtime validation and the compile
 * time types cannot drift apart. The same schemas validate seed data at load,
 * API query strings, and (once a database is attached) rows coming back from
 * Prisma.
 */

export const PLATFORMS = ['instagram', 'youtube'] as const;
export const platformSchema = z.enum(PLATFORMS);

export const CATEGORIES = [
  'fashion',
  'beauty',
  'fitness',
  'food',
  'travel',
  'technology',
  'finance',
  'education',
  'lifestyle',
  'gaming',
  'business',
  'automotive',
] as const;
export const categorySchema = z.enum(CATEGORIES);

export const CONTENT_TYPES = ['reel', 'post', 'story', 'video', 'short'] as const;
export const contentTypeSchema = z.enum(CONTENT_TYPES);

/**
 * Follower bands. Deliberately named rather than numeric-only: the brand brief
 * says not to assume exact follower ranges, so these are presentational
 * groupings we control, not industry definitions we are asserting as fact.
 */
export const TIERS = ['nano', 'micro', 'mid', 'macro'] as const;
export const tierSchema = z.enum(TIERS);

export const audienceSchema = z.object({
  /** Share of audience in the creator's primary age band, 0-100. */
  primaryAgeBand: z.enum(['13-17', '18-24', '25-34', '35-44', '45+']),
  primaryAgeShare: z.number().min(0).max(100),
  femaleShare: z.number().min(0).max(100),
  topLocations: z.array(z.string()).min(1),
});

/**
 * Where a profile came from.
 *
 * `seed` profiles are the illustrative samples in content/seed/creators.json;
 * `admin` profiles are real creators reviewed and published through the admin
 * panel. Defaulted so the seed JSON needs no edit, and the distinction matters
 * because only samples should be labelled as illustrative in the UI - once a
 * real creator is listed, describing them as sample data is simply false.
 */
export const CREATOR_ORIGINS = ['seed', 'admin'] as const;
export const creatorOriginSchema = z.enum(CREATOR_ORIGINS);
export type CreatorOrigin = z.infer<typeof creatorOriginSchema>;

export const creatorSchema = z.object({
  id: z.string().min(1),
  origin: creatorOriginSchema.default('seed'),
  handle: z.string().min(1),
  displayName: z.string().min(1),
  platform: platformSchema,
  category: categorySchema,
  /** Free-text specialism shown under the category, e.g. "strength training". */
  niche: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  languages: z.array(z.string()).min(1),
  followers: z.number().int().nonnegative(),
  engagementRate: z.number().min(0).max(100),
  avgViews: z.number().int().nonnegative(),
  contentTypes: z.array(contentTypeSchema).min(1),
  audience: audienceSchema,
  /** Count of prior brand collaborations. Sample data only. */
  pastCollaborations: z.number().int().nonnegative(),
  bio: z.string().min(1),
  tier: tierSchema,
});

export type Creator = z.infer<typeof creatorSchema>;
export type Platform = z.infer<typeof platformSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ContentType = z.infer<typeof contentTypeSchema>;
export type Tier = z.infer<typeof tierSchema>;

/** Sort orders offered on the discovery surfaces. */
export const SORTS = ['relevance', 'followers-desc', 'followers-asc', 'engagement-desc'] as const;
export const sortSchema = z.enum(SORTS);
export type CreatorSort = z.infer<typeof sortSchema>;

/**
 * Discovery filter set.
 *
 * Every field is optional so the schema can parse a bare URL query string.
 * Array fields accept either a single value or a repeated key, which is what
 * `URLSearchParams.getAll` produces.
 */
const arrayish = <T extends z.ZodTypeAny>(inner: T) =>
  z.preprocess((v) => {
    if (v === undefined || v === null || v === '') return undefined;
    return Array.isArray(v) ? v : [v];
  }, z.array(inner).optional());

const numberish = z.preprocess((v) => {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}, z.number().optional());

export const creatorFiltersSchema = z.object({
  /** Free-text match against name, handle, niche and city. */
  q: z.string().trim().max(120).optional(),
  platforms: arrayish(platformSchema),
  categories: arrayish(categorySchema),
  cities: arrayish(z.string()),
  contentTypes: arrayish(contentTypeSchema),
  languages: arrayish(z.string()),
  tiers: arrayish(tierSchema),
  minFollowers: numberish,
  maxFollowers: numberish,
  minEngagement: numberish,
  sort: sortSchema.optional().default('relevance'),
  limit: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().int().min(1).max(60).optional().default(24),
  ),
});

export type CreatorFilters = z.infer<typeof creatorFiltersSchema>;
