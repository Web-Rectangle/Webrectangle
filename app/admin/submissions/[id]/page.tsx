import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Mail,
  MessageCircle,
  Pencil,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AdminNoteForm } from '@/components/admin/admin-note-form';
import { CopyButton } from '@/components/admin/copy-button';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { reviewSubmission } from '@/lib/actions/admin';
import { getRepositories } from '@/lib/repositories';
import type { Lead } from '@/lib/schemas/lead';
import { cn } from '@/lib/utils/cn';
import { formatAbsolute, formatRelative } from '@/lib/utils/datetime';
import { humanise } from '@/lib/utils/format';

const STATUS_STYLES: Record<Lead['status'], string> = {
  pending: 'bg-warning-soft text-warning border-warning/25',
  approved: 'bg-positive-soft text-positive border-positive/25',
  declined: 'bg-critical-soft text-critical border-critical/25',
};

/**
 * Full detail of one submission.
 *
 * Shows every stored field, including the ones the list row omits -
 * `reviewedAt`, the raw record id and the linked profile id. Those matter when
 * something has gone wrong and you need to correlate a listing with the
 * submission it came from.
 *
 * Previous and next links walk the queue in the same order the list uses, so
 * reviewing a backlog does not mean bouncing back to the index between each
 * one.
 */
export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repos = await getRepositories();

  const [submission, all] = await Promise.all([repos.leads.findById(id), repos.leads.list()]);
  if (!submission) notFound();

  const index = all.findIndex((l) => l.id === id);
  const previous = index > 0 ? all[index - 1] : undefined;
  const next = index >= 0 && index < all.length - 1 ? all[index + 1] : undefined;

  const publishedCreator = submission.publishedCreatorId
    ? await repos.creators.findById(submission.publishedCreatorId)
    : null;

  const whatsapp = submission.phone
    ? `https://wa.me/${submission.phone.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <main className="container-wr max-w-4xl py-10">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin"
          className="text-muted hover:text-accent inline-flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          All submissions
        </Link>

        <nav aria-label="Between submissions" className="flex items-center gap-2">
          <StepLink href={previous && `/admin/submissions/${previous.id}`} direction="previous" />
          <span className="text-muted text-[12.5px] font-semibold">
            {index + 1} of {all.length}
          </span>
          <StepLink href={next && `/admin/submissions/${next.id}`} direction="next" />
        </nav>
      </div>

      <div className="mb-6 flex flex-wrap items-start gap-4">
        <Avatar name={submission.name} seed={submission.email} size="lg" />

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-[clamp(24px,3vw,32px)]">{submission.name}</h1>
            <span
              className={cn(
                'rounded-[var(--r-pill)] border px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] uppercase',
                STATUS_STYLES[submission.status],
              )}
            >
              {submission.status}
            </span>
            <span className="bg-surface-alt text-muted rounded-[var(--r-pill)] px-2.5 py-1 text-[11px] font-bold tracking-[0.06em] uppercase">
              {submission.audience}
            </span>
          </div>

          <p className="text-muted text-[13.5px]" title={formatAbsolute(submission.createdAt)}>
            Submitted {formatRelative(submission.createdAt)} &middot; via {submission.source}
          </p>
        </div>
      </div>

      {/* Actions first: the reason anyone opens this page is to decide. */}
      <div className="mb-8 flex flex-wrap gap-2">
        {submission.status !== 'approved' ? (
          <form action={reviewSubmission}>
            <input type="hidden" name="id" value={submission.id} />
            <input type="hidden" name="status" value="approved" />
            <button
              type="submit"
              className="bg-positive-soft text-positive hover:bg-positive flex items-center gap-1.5 rounded-[var(--r-btn)] px-4 py-2.5 text-[13.5px] font-semibold transition-colors hover:text-white"
            >
              <Check aria-hidden="true" className="size-4" />
              Approve
            </button>
          </form>
        ) : null}

        {submission.audience === 'creator' && submission.status === 'approved' ? (
          <Link
            href={`/admin/submissions/${submission.id}/publish`}
            className="bg-accent text-accent-contrast hover:bg-accent-hover flex items-center gap-1.5 rounded-[var(--r-btn)] px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
          >
            <Pencil aria-hidden="true" className="size-4" />
            {publishedCreator ? 'Edit listing' : 'Add profile details'}
          </Link>
        ) : null}

        <a
          href={`mailto:${submission.email}`}
          className="border-border text-body hover:border-accent hover:text-accent flex items-center gap-1.5 rounded-[var(--r-btn)] border px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
        >
          <Mail aria-hidden="true" className="size-4" />
          Email
        </a>

        {whatsapp ? (
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-body hover:border-accent hover:text-accent flex items-center gap-1.5 rounded-[var(--r-btn)] border px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            WhatsApp
          </a>
        ) : null}

        {submission.status !== 'declined' ? (
          <form action={reviewSubmission}>
            <input type="hidden" name="id" value={submission.id} />
            <input type="hidden" name="status" value="declined" />
            <button
              type="submit"
              className="border-border text-muted hover:border-critical hover:text-critical flex items-center gap-1.5 rounded-[var(--r-btn)] border px-4 py-2.5 text-[13.5px] font-semibold transition-colors"
            >
              <X aria-hidden="true" className="size-4" />
              Decline
            </button>
          </form>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-muted mb-3 text-[11px] font-bold tracking-[0.1em] uppercase">
              What they wrote
            </h2>
            <p className="text-[15px] leading-relaxed whitespace-pre-line">{submission.message}</p>
          </Card>

          <Card className="p-6">
            <AdminNoteForm id={submission.id} note={submission.adminNote} />
          </Card>
        </div>

        <Card className="h-fit p-6">
          <h2 className="text-muted mb-4 text-[11px] font-bold tracking-[0.1em] uppercase">
            Every field
          </h2>

          <dl className="divide-border divide-y">
            <Row label="Email" value={submission.email} copy />
            <Row label="Company" value={submission.company} />
            <Row label="Phone" value={submission.phone} copy />
            <Row label="Audience" value={humanise(submission.audience)} />
            <Row label="Source" value={humanise(submission.source)} />
            <Row label="Status" value={humanise(submission.status)} />
            <Row label="Submitted" value={formatAbsolute(submission.createdAt)} />
            <Row
              label="Reviewed"
              value={submission.reviewedAt ? formatAbsolute(submission.reviewedAt) : undefined}
            />
            <Row label="Submission ID" value={submission.id} copy mono />
            <Row label="Profile ID" value={submission.publishedCreatorId} copy mono />
          </dl>

          {publishedCreator ? (
            <Link
              href="/discover"
              className="text-accent mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold hover:underline"
            >
              <ExternalLink aria-hidden="true" className="size-3.5" />
              Listed as @{publishedCreator.handle}
            </Link>
          ) : null}
        </Card>
      </div>
    </main>
  );
}

function StepLink({ href, direction }: { href?: string; direction: 'previous' | 'next' }) {
  const Icon = direction === 'previous' ? ArrowLeft : ArrowRight;
  const label = direction === 'previous' ? 'Previous submission' : 'Next submission';

  // Rendered disabled rather than hidden, so the control does not jump around
  // as you move through the queue.
  if (!href) {
    return (
      <span
        aria-disabled="true"
        aria-label={`${label} (none)`}
        className="border-border text-muted/40 flex size-8 items-center justify-center rounded-[var(--r-btn)] border"
      >
        <Icon aria-hidden="true" className="size-3.5" />
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="border-border text-body hover:border-accent hover:text-accent flex size-8 items-center justify-center rounded-[var(--r-btn)] border transition-colors"
    >
      <Icon aria-hidden="true" className="size-3.5" />
    </Link>
  );
}

function Row({
  label,
  value,
  copy = false,
  mono = false,
}: {
  label: string;
  value?: string;
  copy?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-muted shrink-0 text-[12.5px] font-semibold">{label}</dt>
      <dd
        className={cn(
          'min-w-0 text-right text-[13.5px] break-words',
          value ? 'text-ink' : 'text-muted/60',
          mono && 'font-mono text-[12px]',
        )}
      >
        {value ?? 'Not provided'}
        {value && copy ? <CopyButton value={value} label="Copy" className="mt-1 ml-auto" /> : null}
      </dd>
    </div>
  );
}
