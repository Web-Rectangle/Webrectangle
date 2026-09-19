import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

import { contact, env, features } from '@/lib/env';
import type { Lead, WaitlistEntry } from '@/lib/schemas/lead';

/**
 * Lead notification, with a cascade of fallbacks.
 *
 * THE GUARANTEE: a submission is never silently dropped. Every channel below
 * is optional, and if all of them are unconfigured the submission still lands
 * somewhere a human will see it - either a local JSONL file in development, or
 * the server log in production, with the UI offering a prefilled WhatsApp
 * message as an immediate second route.
 *
 * This is what makes the site genuinely useful on day one, before anyone has
 * set up email or a database. The cascade, in order:
 *
 *   1. Resend        - if RESEND_API_KEY and LEAD_NOTIFY_EMAIL are set
 *   2. Slack webhook - if SLACK_WEBHOOK_URL is set
 *   3. Local JSONL   - in development, appended to .data/leads.jsonl
 *   4. Server log    - always, as the final backstop
 *
 * Channels are attempted in parallel and failures are swallowed deliberately:
 * a Slack outage must never turn into a 500 for someone filling in a form. The
 * lead is already persisted through the repository before this runs.
 */

const LOCAL_LOG = '.data/leads.jsonl';

type Notifiable = Lead | WaitlistEntry;

function isFullLead(entry: Notifiable): entry is Lead {
  return 'message' in entry;
}

function formatPlain(entry: Notifiable): string {
  const lines = [`Source: ${entry.source}`, `Audience: ${entry.audience}`, `Email: ${entry.email}`];

  if (entry.name) lines.push(`Name: ${entry.name}`);
  if (entry.company) lines.push(`Company: ${entry.company}`);
  if (isFullLead(entry)) {
    if (entry.phone) lines.push(`Phone: ${entry.phone}`);
    lines.push('', entry.message);
  }

  return lines.join('\n');
}

async function sendEmail(entry: Notifiable): Promise<void> {
  if (!features.email) return;

  const subject = isFullLead(entry)
    ? `New enquiry from ${entry.name} (${entry.audience})`
    : `New ${entry.audience} waitlist signup`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'WebRectangle <noreply@webrectangle.com>',
      to: [env.LEAD_NOTIFY_EMAIL],
      // Set so a reply from the inbox goes straight back to the person who
      // wrote in, rather than to a noreply address.
      reply_to: entry.email,
      subject,
      text: formatPlain(entry),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}`);
  }
}

async function sendSlack(entry: Notifiable): Promise<void> {
  if (!features.slack || !env.SLACK_WEBHOOK_URL) return;

  const response = await fetch(env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `*New ${isFullLead(entry) ? 'enquiry' : 'waitlist signup'}*\n\`\`\`${formatPlain(entry)}\`\`\``,
    }),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook responded ${response.status}`);
  }
}

async function appendLocal(entry: Notifiable): Promise<void> {
  // Only in development: a serverless production filesystem is ephemeral, so
  // writing there would create a false sense of durability.
  if (env.NODE_ENV !== 'development') return;

  await mkdir(dirname(LOCAL_LOG), { recursive: true });
  await appendFile(LOCAL_LOG, `${JSON.stringify(entry)}\n`, 'utf8');
}

/**
 * Fan out a captured submission to every configured channel.
 *
 * Always resolves. Callers should not await this before responding to the
 * user - the lead is already stored, and notification latency should not be
 * charged to the person who filled in the form.
 */
export async function notifyNewLead(entry: Notifiable): Promise<void> {
  const attempts: Array<Promise<void>> = [sendEmail(entry), sendSlack(entry), appendLocal(entry)];

  const results = await Promise.allSettled(attempts);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[notify] channel failed:', result.reason);
    }
  }

  // Final backstop. Always logged, so a submission is recoverable from server
  // logs even when every integration is down or unconfigured.
  console.info('[lead]', JSON.stringify(entry));
}

/**
 * Prefilled WhatsApp handoff offered in every form's success state.
 *
 * The second half of the no-dropped-leads guarantee: even if every server-side
 * channel fails, the visitor is one tap from a conversation that definitely
 * reaches us.
 */
export function whatsappHandoff(entry: { name?: string; email: string }): string {
  const message = [
    'Hi WebRectangle!',
    '',
    `I just submitted the form on your site${entry.name ? ` as ${entry.name}` : ''}.`,
    `My email is ${entry.email}.`,
  ].join('\n');

  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
