import { type NextRequest, NextResponse } from 'next/server';

import { getRepositories } from '@/lib/repositories';
import { respondInvitationSchema } from '@/lib/schemas/campaign';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Respond to Campaign Invitation API.
 *
 * POST /api/invitations/[id]/respond
 * Allows a creator to respond to a campaign invitation:
 * - 'accepted': creator accepts brief
 * - 'rejected': creator declines
 * - 'changes-requested': creator negotiates / requests changes
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`respond-invite:${ip}`, 30, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  const { id } = await params;
  const repos = await getRepositories();

  const invitation = await repos.invitations.findById(id);
  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = respondInvitationSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 });
  }

  const { status, message } = parsed.data;

  const updated = await repos.invitations.respond(id, status, message);

  // If accepted, update the campaign status to 'accepted' or 'active' if appropriate
  if (status === 'accepted') {
    const campaign = await repos.campaigns.findById(invitation.campaignId);
    if (campaign && campaign.status === 'invited') {
      await repos.campaigns.updateStatus(campaign.id, 'accepted');
    }
  }

  return NextResponse.json({
    success: true,
    invitation: updated,
    message: `Invitation ${status} successfully.`,
  });
}
