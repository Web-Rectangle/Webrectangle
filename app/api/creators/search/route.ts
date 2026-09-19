import { type NextRequest, NextResponse } from 'next/server';

import { filtersFromSearchParams } from '@/lib/creators/url';
import { getRepositories } from '@/lib/repositories';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Creator search.
 *
 * The discovery UI currently filters client-side over the seed set, so this
 * endpoint is not on the critical path today. It exists because it is the
 * interface that has to be there the moment the real creator network makes
 * client-side filtering impractical - at that point the explorer switches to
 * calling this, and neither the filter shape nor the URL contract changes.
 *
 * It also makes discovery scriptable, which is useful for our own tooling.
 *
 * Accepts exactly the same query parameters as /discover, so a URL can be
 * copied from the browser straight onto this endpoint.
 */
export async function GET(request: NextRequest) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`creators-search:${ip}`, 60, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  const filters = filtersFromSearchParams(request.nextUrl.searchParams);
  const repos = await getRepositories();
  const result = await repos.creators.search(filters);

  return NextResponse.json(
    {
      ...result,
      // Stated in the payload as well as the UI: anyone consuming this
      // programmatically needs to know these are illustrative profiles.
      sampleData: repos.adapter === 'memory',
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  );
}
