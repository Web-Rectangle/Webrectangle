import { type NextRequest, NextResponse } from 'next/server';

import { getRepositories } from '@/lib/repositories';
import { creatorApplicationSchema } from '@/lib/schemas/creator-application';
import { notifyNewLead, whatsappHandoff } from '@/lib/services/notify';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Creator Application / Onboarding API.
 *
 * POST /api/creators/apply
 * Allows creators to submit their profile for verification and listing on WebRectangle.
 */
export async function POST(request: NextRequest) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`creator-apply:${ip}`, 10, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = creatorApplicationSchema.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));
    return NextResponse.json({ error: 'Validation failed', issues }, { status: 422 });
  }

  const data = parsed.data;

  // Build a structured, actionable message for review in the admin panel
  const messageLines = [
    `Creator Profile Application:`,
    `Handle: @${data.handle} (${data.platform})`,
    `Category: ${data.category} / Niche: ${data.niche}`,
    `Location: ${data.city}, ${data.region}`,
    `Languages: ${data.languages.join(', ')}`,
    `Content Formats: ${data.contentTypes.join(', ')}`,
    data.estimatedFollowers
      ? `Estimated Followers: ${data.estimatedFollowers.toLocaleString()}`
      : null,
    data.startingRateInr
      ? `Expected Starting Rate: ₹${data.startingRateInr.toLocaleString()}`
      : null,
    data.portfolioLinks?.length
      ? `Portfolio Links:\n${data.portfolioLinks.map((l) => `  - ${l}`).join('\n')}`
      : null,
    `Bio:\n${data.bio}`,
    data.notes ? `Additional Notes:\n${data.notes}` : null,
  ].filter(Boolean);

  const repos = await getRepositories();

  const lead = await repos.leads.create({
    name: data.displayName || data.name,
    email: data.email,
    phone: data.phone || undefined,
    company: `@${data.handle} (${data.platform})`,
    audience: 'creator',
    source: 'creator-waitlist',
    message: messageLines.join('\n\n'),
  });

  // Notify team via cascading notification channels (Email / Slack / Log)
  void notifyNewLead(lead);

  const whatsappUrl = whatsappHandoff({
    name: data.displayName || data.name,
    email: data.email,
  });

  return NextResponse.json(
    {
      success: true,
      applicationId: lead.id,
      message: 'Creator application submitted successfully. Our team will review your profile.',
      whatsappUrl,
    },
    { status: 201 },
  );
}
