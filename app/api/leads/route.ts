import { type NextRequest, NextResponse } from 'next/server';

import { getRepositories } from '@/lib/repositories';
import { leadSchema, looksAutomated } from '@/lib/schemas/lead';
import { notifyNewLead } from '@/lib/services/notify';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Lead capture over HTTP.
 *
 * The site's own forms use the Server Action in lib/actions/submit-lead.ts;
 * this endpoint exists for anything that cannot, such as an embedded form on a
 * partner page, a landing page built elsewhere, or a no-code tool.
 *
 * Shares the schema, the spam heuristics and the notification cascade with the
 * Server Action, so the two paths cannot validate differently.
 */
export async function POST(request: NextRequest) {
  const ip = clientIpFrom(request.headers);
  const { allowed, retryAfter } = rateLimit(`leads:${ip}`, 5, 60_000);

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
    return NextResponse.json({ error: 'Expected a JSON body' }, { status: 400 });
  }

  const candidate = body as Record<string, unknown>;

  // Accepted and discarded. Returning 200 gives an author no signal about
  // which check tripped.
  if (
    looksAutomated({
      companyWebsite: candidate.companyWebsite as string | undefined,
      renderedAt: candidate.renderedAt as string | undefined,
    })
  ) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      },
      { status: 422 },
    );
  }

  try {
    const repos = await getRepositories();
    const lead = await repos.leads.create(parsed.data);
    void notifyNewLead(lead);

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error('[api/leads] failed:', error);
    return NextResponse.json({ error: 'Could not store the lead' }, { status: 500 });
  }
}
