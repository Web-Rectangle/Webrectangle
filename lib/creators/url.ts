import { type CreatorFilters, creatorFiltersSchema } from '@/lib/schemas/creator';

/**
 * Two-way mapping between discovery filters and the URL query string.
 *
 * WHY URL STATE: a shortlist search is something a marketer sends to a
 * colleague. Keeping filters in the address bar makes every result set
 * shareable and bookmarkable, makes browser back behave the way people expect,
 * and lets the server render the correct results on a cold load.
 *
 * Arrays serialise as repeated keys (`?categories=food&categories=fitness`)
 * rather than a delimited string, so values containing commas or spaces - city
 * names, for instance - survive a round trip untouched.
 */

const ARRAY_KEYS = [
  'platforms',
  'categories',
  'cities',
  'contentTypes',
  'languages',
  'tiers',
] as const;

const SCALAR_KEYS = ['q', 'minFollowers', 'maxFollowers', 'minEngagement', 'sort'] as const;

/** Parse a query string into validated filters, discarding anything unknown. */
export function filtersFromSearchParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): CreatorFilters {
  const raw: Record<string, unknown> = {};

  if (params instanceof URLSearchParams) {
    for (const key of ARRAY_KEYS) {
      const values = params.getAll(key);
      if (values.length > 0) raw[key] = values;
    }
    for (const key of SCALAR_KEYS) {
      const value = params.get(key);
      if (value !== null && value !== '') raw[key] = value;
    }
  } else {
    for (const key of [...ARRAY_KEYS, ...SCALAR_KEYS]) {
      const value = params[key];
      if (value !== undefined && value !== '') raw[key] = value;
    }
  }

  // Invalid input falls back to defaults rather than throwing: a hand-edited
  // or stale URL should show unfiltered results, not an error page.
  const parsed = creatorFiltersSchema.safeParse(raw);
  return parsed.success ? parsed.data : creatorFiltersSchema.parse({});
}

/**
 * Serialise filters back to a query string.
 *
 * Defaults are omitted so the common case produces a clean `/discover` URL
 * rather than one carrying every unset parameter.
 */
export function searchParamsFromFilters(filters: CreatorFilters): string {
  const params = new URLSearchParams();

  for (const key of ARRAY_KEYS) {
    const values = filters[key];
    if (!values) continue;
    for (const value of values) params.append(key, String(value));
  }

  if (filters.q) params.set('q', filters.q);
  if (filters.minFollowers !== undefined) params.set('minFollowers', String(filters.minFollowers));
  if (filters.maxFollowers !== undefined) params.set('maxFollowers', String(filters.maxFollowers));
  if (filters.minEngagement !== undefined) {
    params.set('minEngagement', String(filters.minEngagement));
  }
  if (filters.sort && filters.sort !== 'relevance') params.set('sort', filters.sort);

  // Sorted so the same filter set always produces the same URL, which keeps
  // shared links and cache keys stable.
  params.sort();
  return params.toString();
}
