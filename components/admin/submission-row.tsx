import { Check, ExternalLink, Pencil, X } from 'lucide-react';
import Link from 'next/link';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { reviewSubmission } from '@/lib/actions/admin';
import type { Lead } from '@/lib/schemas/lead';
import { cn } from '@/lib/utils/cn';
import { formatAbsolute, formatRelative } from '@/lib/utils/datetime';

const STATUS_STYLES: Record<Lead['status'], string> = {
  pending: 'bg-warning-soft text-warning border-warning/25',
  approved: 'bg-positive-soft text-positive border-positive/25',
  declined: 'bg-critical-soft text-critical border-critical/25',
};

/**
 * One row in the review queue.
 *
 * The message is shown in full rather than truncated - it is the only thing
 * that tells an admin whether this person is worth approving, and hiding it
 * behind a click would slow down the task the page exists for.
 *
 * WHOLE-ROW NAVIGATION: an absolutely positioned link covers the card, with
 * the action controls lifted above it on the z axis. Wrapping the card in an
 * anchor instead would nest buttons and forms inside a link, which is invalid
 * HTML and behaves unpredictably. This keeps one tab stop for the row and
 * leaves the buttons independently reachable.
 *
 * Approve and decline are plain forms posting to Server Actions, so the queue
 * works with JavaScript disabled.
 */
export function SubmissionRow({
  lead,
  selected,
  selectionSlot,
}: {
  lead: Lead;
  selected?: boolean;
  /** Checkbox injected by the client list wrapper; omitted when not selectable. */
  selectionSlot?: React.ReactNode;
}) {
  const isCreator = lead.audience === 'creator';
  const published = Boolean(lead.publishedCreatorId);

  return (
    <Card
      as="li"
      className={cn(
        'relative p-5 transition-[border-color,box-shadow]',
        selected && 'border-accent shadow-[var(--shadow)]',
      )}
    >
      {/* Covers the card. Everything interactive sits at z-10 above it. */}
      <Link
        href={`/admin/submissions/${lead.id}`}
        className="absolute inset-0 rounded-[var(--r-card)] focus-visible:outline-offset-[-3px]"
      >
        <span className="sr-only">Open {lead.name}&rsquo;s submission</span>
      </Link>

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {selectionSlot ? <div className="relative z-10 pt-1">{selectionSlot}</div> : null}

          <Avatar name={lead.name} seed={lead.email} size="sm" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-ink text-[15.5px] font-bold">{lead.name}</p>
              <span
                className={cn(
                  'rounded-[var(--r-pill)] border px-2 py-0.5 text-[10.5px] font-bold tracking-[0.06em] uppercase',
                  STATUS_STYLES[lead.status],
                )}
              >
                {lead.status}
              </span>
              <span className="bg-surface-alt text-muted rounded-[var(--r-pill)] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.06em] uppercase">
                {lead.audience}
              </span>
              {published ? (
                <span className="bg-accent-soft text-accent rounded-[var(--r-pill)] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.06em] uppercase">
                  Listed
                </span>
              ) : null}
              {lead.adminNote ? (
                <span
                  title={lead.adminNote}
                  className="border-border text-muted rounded-[var(--r-pill)] border px-2 py-0.5 text-[10.5px] font-bold tracking-[0.06em] uppercase"
                >
                  Note
                </span>
              ) : null}
            </div>

            <p className="text-muted relative z-10 mt-0.5 w-fit text-[13px]">
              <a href={`mailto:${lead.email}`} className="hover:text-accent">
                {lead.email}
              </a>
              {lead.company ? ` · ${lead.company}` : ''}
              {lead.phone ? ` · ${lead.phone}` : ''}
            </p>
            <p className="text-muted text-[12px]" title={formatAbsolute(lead.createdAt)}>
              {formatRelative(lead.createdAt)} · via {lead.source}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex shrink-0 flex-wrap gap-2">
          {lead.status !== 'approved' ? (
            <form action={reviewSubmission}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="status" value="approved" />
              <button
                type="submit"
                className="bg-positive-soft text-positive hover:bg-positive flex items-center gap-1.5 rounded-[var(--r-btn)] px-3 py-2 text-[13px] font-semibold transition-colors hover:text-white"
              >
                <Check aria-hidden="true" className="size-3.5" />
                Approve
              </button>
            </form>
          ) : null}

          {isCreator && lead.status === 'approved' ? (
            <Link
              href={`/admin/submissions/${lead.id}/publish`}
              className="bg-accent text-accent-contrast hover:bg-accent-hover flex items-center gap-1.5 rounded-[var(--r-btn)] px-3 py-2 text-[13px] font-semibold transition-colors"
            >
              <Pencil aria-hidden="true" className="size-3.5" />
              {published ? 'Edit listing' : 'Add details'}
            </Link>
          ) : null}

          {published ? (
            <Link
              href="/discover"
              className="border-border text-body hover:border-accent hover:text-accent flex items-center gap-1.5 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-semibold transition-colors"
            >
              <ExternalLink aria-hidden="true" className="size-3.5" />
              View
            </Link>
          ) : null}

          {lead.status !== 'declined' ? (
            <form action={reviewSubmission}>
              <input type="hidden" name="id" value={lead.id} />
              <input type="hidden" name="status" value="declined" />
              <button
                type="submit"
                className="border-border text-muted hover:border-critical hover:text-critical flex items-center gap-1.5 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-semibold transition-colors"
              >
                <X aria-hidden="true" className="size-3.5" />
                Decline
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <p className="border-border relative mt-4 border-t pt-4 text-[14px] whitespace-pre-line">
        {lead.message}
      </p>
    </Card>
  );
}
