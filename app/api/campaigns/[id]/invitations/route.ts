import { type NextRequest, NextResponse } from 'next/server';

import { getRepositories } from '@/lib/repositories';
import { createInvitationSchema } from '@/lib/schemas/campaign';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Campaign Invitations API.
 *
 * GET /api/campaigns/[id]/invitations
 * Lists all creator invitations for the specified campaign.
 *
 * POST /api/campaigns/[id]/invitations
 * Sends a collaboration invitation to a creator for this campaign.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: campaignId } = await params;
  const repos = await getRepositories();

  const campaign = await repos.campaigns.findById(campaignId);
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  const invitations = await repos.invitations.listByCampaign(campaignId);
  return NextResponse.json({ campaignId, invitations });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`campaign-invite:${ip}`, 30, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  const { id: campaignId } = await params;
  const repos = await getRepositories();

  const campaign = await repos.campaigns.findById(campaignId);
  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = createInvitationSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 });
  }

  const { creatorId, message } = parsed.data;

  // Verify creator exists
  const creator = await repos.creators.findById(creatorId);
  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  const invitation = await repos.invitations.create({
    campaignId,
    creatorId,
    message,
  });

  return NextResponse.json(
    {
      success: true,
      invitation,
      message: `Invitation sent to @${creator.handle}`,
    },
    { status: 201 },
  );
}
