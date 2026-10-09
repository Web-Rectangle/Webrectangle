import { randomUUID } from 'node:crypto';

import { type NextRequest, NextResponse } from 'next/server';

import { getRepositories } from '@/lib/repositories';
import { createCampaignSchema } from '@/lib/schemas/campaign';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Campaigns API.
 *
 * GET /api/campaigns?brandId=...
 * Lists campaigns for a brand.
 *
 * POST /api/campaigns
 * Creates a new campaign with deliverables, budget, and targeting.
 */
export async function GET(request: NextRequest) {
  const brandId = request.nextUrl.searchParams.get('brandId');
  if (!brandId) {
    return NextResponse.json({ error: 'brandId query parameter is required' }, { status: 400 });
  }

  const repos = await getRepositories();
  const campaigns = await repos.campaigns.listByBrand(brandId);

  return NextResponse.json({ campaigns });
}

export async function POST(request: NextRequest) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`create-campaign:${ip}`, 30, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = createCampaignSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 });
  }

  const input = parsed.data;
  const repos = await getRepositories();

  const deliverablesWithIds = input.deliverables.map((d) => ({
    ...d,
    id: d.id || `del-${randomUUID().slice(0, 8)}`,
  }));

  const campaign = await repos.campaigns.create({
    ...input,
    deliverables: deliverablesWithIds,
  });

  return NextResponse.json({ success: true, campaign }, { status: 201 });
}
