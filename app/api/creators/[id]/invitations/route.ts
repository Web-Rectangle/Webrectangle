import { type NextRequest, NextResponse } from 'next/server';

import { getRepositories } from '@/lib/repositories';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Creator Invitations API.
 *
 * GET /api/creators/[id]/invitations
 * Retrieves all campaign collaboration briefs and invitations sent to a creator.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`creator-invitations:${ip}`, 60, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  const { id: rawId } = await params;
  const repos = await getRepositories();

  // Resolve creator by id or handle
  let creator = await repos.creators.findById(rawId);
  if (!creator) {
    creator = await repos.creators.findByHandle(rawId.replace(/^@/, ''));
  }

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  const invitations = await repos.invitations.listByCreator(creator.id);

  // Hydrate invitations with campaign details so the creator has full context
  const hydrated = await Promise.all(
    invitations.map(async (inv) => {
      const campaign = await repos.campaigns.findById(inv.campaignId);
      return {
        ...inv,
        campaign: campaign
          ? {
              name: campaign.name,
              objective: campaign.objective,
              status: campaign.status,
              productOrService: campaign.productOrService,
              budgetMinor: campaign.budgetMinor,
              currency: campaign.currency,
              deliverables: campaign.deliverables,
              notes: campaign.notes,
            }
          : null,
      };
    }),
  );

  return NextResponse.json({
    creatorId: creator.id,
    handle: creator.handle,
    invitations: hydrated,
  });
}
