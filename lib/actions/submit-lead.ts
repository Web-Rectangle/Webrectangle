'use server';

import { headers } from 'next/headers';

import { getRepositories } from '@/lib/repositories';
import { leadSchema, looksAutomated, waitlistSchema } from '@/lib/schemas/lead';
import { notifyNewLead, whatsappHandoff } from '@/lib/services/notify';
import { clientIpFrom, rateLimit } from '@/lib/services/rate-limit';

/**
 * Server Actions behind every form on the site.
 *
 * These are bound on the client via `useActionState`, so the forms require
 * JavaScript to submit - see the note in components/forms/lead-form.tsx. The
 * no-JS path is the plain mailto: and WhatsApp links on the contact page, and
 * POST /api/leads for anything integrating programmatically. All three share
 * the schema and the spam heuristics below, so they cannot validate
 * differently.
 *
 * DEFENCE ORDER - cheapest checks first, so an abusive request is rejected
 * before it can cost us anything:
 *   1. spam heuristics (free, no I/O)
 *   2. rate limit      (in-memory)
 *   3. schema validation
 *   4. persist
 *   5. notify (fire-and-forget)
 */

export type FormState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /** Per-field validation messages, keyed by field name. */
  errors?: Record<string, string>;
  /** Offered in the success state as a guaranteed second channel. */
  whatsappUrl?: string;
};

export const initialFormState: FormState = { status: 'idle' };

function fieldErrors(issues: Array<{ path: PropertyKey[]; message: string }>) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? '');
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

async function guard(route: string): Promise<FormState | null> {
  const ip = clientIpFrom(await headers());
  const { allowed, retryAfter } = rateLimit(`${route}:${ip}`, 5, 60_000);

  if (!allowed) {
    return {
      status: 'error',
      message: `Too many submissions. Try again in ${retryAfter} seconds, or message us on WhatsApp.`,
    };
  }

  return null;
}

/**
 * Full enquiry form (contact page, brand onboarding).
 *
 * Note the spam path returns `success`. Telling a bot it was detected just
 * tells the author what to change; a silent no-op is more useful to us and
 * indistinguishable to them.
 */
export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  if (
    looksAutomated({
      companyWebsite: formData.get('companyWebsite')?.toString(),
      renderedAt: formData.get('renderedAt')?.toString(),
    })
  ) {
    return { status: 'success', message: 'Thanks - we will be in touch.' };
  }

  const limited = await guard('lead');
  if (limited) return limited;

  const parsed = leadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company') ?? '',
    phone: formData.get('phone') ?? '',
    audience: formData.get('audience') ?? 'brand',
    message: formData.get('message'),
    source: formData.get('source') ?? 'contact',
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: fieldErrors(parsed.error.issues),
    };
  }

  try {
    const repos = await getRepositories();
    const lead = await repos.leads.create(parsed.data);

    // Not awaited: the lead is already stored, and notification latency should
    // not be charged to the person waiting on the button.
    void notifyNewLead(lead);

    return {
      status: 'success',
      message: 'Thanks - we have got it. You will hear from us within 24 hours.',
      whatsappUrl: whatsappHandoff(lead),
    };
  } catch (error) {
    console.error('[submitLead] failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong on our side. Please message us on WhatsApp instead.',
    };
  }
}

/** Short-form capture for early access and creator signups. */
export async function joinWaitlist(_prev: FormState, formData: FormData): Promise<FormState> {
  if (
    looksAutomated({
      companyWebsite: formData.get('companyWebsite')?.toString(),
      renderedAt: formData.get('renderedAt')?.toString(),
    })
  ) {
    return { status: 'success', message: 'Thanks - you are on the list.' };
  }

  const limited = await guard('waitlist');
  if (limited) return limited;

  const parsed = waitlistSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name') ?? '',
    company: formData.get('company') ?? '',
    audience: formData.get('audience') ?? 'creator',
    source: formData.get('source') ?? 'discover-early-access',
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      errors: fieldErrors(parsed.error.issues),
    };
  }

  try {
    const repos = await getRepositories();
    const entry = await repos.waitlist.create(parsed.data);
    void notifyNewLead(entry);

    return {
      status: 'success',
      message: 'You are on the list. We will email you when it opens.',
      whatsappUrl: whatsappHandoff(entry),
    };
  } catch (error) {
    console.error('[joinWaitlist] failed:', error);
    return {
      status: 'error',
      message: 'Something went wrong on our side. Please message us on WhatsApp instead.',
    };
  }
}
