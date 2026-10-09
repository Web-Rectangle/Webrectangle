import { type NextRequest, NextResponse } from 'next/server';

import { getRepositories } from '@/lib/repositories';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Creator Profile API.
 *
 * GET /api/creators/[id]
 * Fetches a single creator profile by either their unique ID or their handle.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`creator-profile:${ip}`, 120, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  const { id } = await params;
  const repos = await getRepositories();

  // Try lookup by ID first, then fallback to handle
  let creator = await repos.creators.findById(id);
  if (!creator) {
    const cleanHandle = id.replace(/^@/, '');
    creator = await repos.creators.findByHandle(cleanHandle);
  }

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  return NextResponse.json(
    {
      creator,
      sampleData: repos.adapter === 'memory' && creator.origin === 'seed',
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    },
  );
}
