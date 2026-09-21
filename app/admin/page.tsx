import { Inbox } from 'lucide-react';
import Link from 'next/link';

import { QueueToolbar } from '@/components/admin/queue-toolbar';
import { SubmissionList } from '@/components/admin/submission-list';
import { Card } from '@/components/ui/card';
import { getRepositories } from '@/lib/repositories';
import type { AudienceType, SubmissionStatus } from '@/lib/schemas/lead';
import { cn } from '@/lib/utils/cn';

type QueryParams = {
  audience?: string;
  status?: string;
  q?: string;
  sort?: string;
  published?: string;
};

/**
 * Submissions queue.
 *
 * One list for both audiences rather than separate brand and creator tabs: at
 * this volume the useful ordering is chronological - what arrived today,
 * regardless of who sent it.
 *
 * Every control writes to the URL, so a filtered view is linkable and the back
 * button steps through refinements properly. Audience and status are separate
 * parameters and therefore combine, rather than the earlier one-at-a-time
 * pills.
 */
export default async function AdminPage({ searchParams }: { searchParams: Promise<QueryParams> }) {
  const params = await searchParams;
  const repos = await getRepositories();

  const audience = isAudience(params.audience) ? params.audience : undefined;
  const status = isStatus(params.status) ? params.status : undefined;
  const query = params.q?.trim().toLowerCase() ?? '';

  const [all, scoped] = await Promise.all([
    repos.leads.list(),
    repos.leads.list({ audience, status }),
  ]);

  // Free-text search runs here rather than in the repository: it spans several
  // fields including the message body, and pushing it down would mean every
  // adapter reimplementing the same fuzzy matching.
  const searched = query
    ? scoped.filter((lead) =>
        [lead.name, lead.email, lead.company, lead.phone, lead.message]
          .join(' ')
          .toLowerCase()
          .includes(query),
      )
    : scoped;

  const results =
    params.sort === 'oldest'
      ? [...searched].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      : searched;

  const counts = {
    total: all.length,
    pending: all.filter((l) => l.status === 'pending').length,
    creators: all.filter((l) => l.audience === 'creator').length,
    brands: all.filter((l) => l.audience === 'brand').length,
    listed: all.filter((l) => l.publishedCreatorId).length,
  };

  const hasFilters = Boolean(audience || status || query);

  return (
    <main className="container-wr py-10">
      <div className="mb-8">
        <h1 className="mb-1.5 text-[clamp(26px,3vw,34px)]">Submissions</h1>
        <p className="text-[15px]">
          Everyone who has filled in a form. Approve a creator to add their profile details and list
          them on Discover.
        </p>
      </div>

      {params.published ? (
        <p
          role="status"
          className="bg-positive-soft text-positive mb-6 rounded-[var(--r-card)] px-4 py-3 text-[14.5px] font-semibold"
        >
          Profile published. It is now live on Discover.
        </p>
      ) : null}

      {/*
        Storage caveat, stated up front. With the in-memory adapter this queue
        is an inbox, not a record - an admin who does not know that could lose
        a submission to a routine restart.
      */}
      {repos.adapter === 'memory' ? (
        <p className="bg-warning-soft text-warning mb-6 rounded-[var(--r-card)] px-4 py-3 text-[13.5px]">
          <strong className="font-bold">Submissions are stored in memory.</strong> They are cleared
          whenever the server restarts. Set <code className="font-mono">DATABASE_URL</code> to make
          them permanent.
        </p>
      ) : null}

      <div className="mb-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Total" value={counts.total} />
        <Stat label="Awaiting review" value={counts.pending} emphasis />
        <Stat label="Creators" value={counts.creators} />
        <Stat label="Brands" value={counts.brands} />
        <Stat label="Listed" value={counts.listed} />
      </div>

      <QueueToolbar results={results} />

      {/* Audience and status are independent, so the two rows combine. */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-muted mr-1 text-[12px] font-bold tracking-[0.08em] uppercase">
          Who
        </span>
        <Filter
          label="Everyone"
          params={params}
          patch={{ audience: undefined }}
          active={!audience}
        />
        <Filter
          label="Creators"
          params={params}
          patch={{ audience: 'creator' }}
          active={audience === 'creator'}
        />
        <Filter
          label="Brands"
          params={params}
          patch={{ audience: 'brand' }}
          active={audience === 'brand'}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-muted mr-1 text-[12px] font-bold tracking-[0.08em] uppercase">
          State
        </span>
        <Filter label="Any" params={params} patch={{ status: undefined }} active={!status} />
        <Filter
          label="Pending"
          params={params}
          patch={{ status: 'pending' }}
          active={status === 'pending'}
        />
        <Filter
          label="Approved"
          params={params}
          patch={{ status: 'approved' }}
          active={status === 'approved'}
        />
        <Filter
          label="Declined"
          params={params}
          patch={{ status: 'declined' }}
          active={status === 'declined'}
        />

        {hasFilters ? (
          <Link
            href="/admin"
            className="text-muted hover:text-accent ml-2 text-[13px] font-semibold underline underline-offset-4"
          >
            Clear all
          </Link>
        ) : null}
      </div>

      <p aria-live="polite" className="text-muted mb-4 text-[13.5px] font-medium">
        {results.length} of {counts.total} {counts.total === 1 ? 'submission' : 'submissions'}
      </p>

      {results.length === 0 ? (
        <EmptyState hasAny={counts.total > 0} />
      ) : (
        <SubmissionList leads={results} />
      )}
    </main>
  );
}

function isAudience(value: string | undefined): value is AudienceType {
  return value === 'brand' || value === 'creator' || value === 'other';
}

function isStatus(value: string | undefined): value is SubmissionStatus {
  return value === 'pending' || value === 'approved' || value === 'declined';
}

/**
 * Filter pill that preserves the other parameters.
 *
 * Building the href from the current params is what makes the filters
 * composable - a plain static link would silently drop whatever else was set.
 */
function Filter({
  label,
  params,
  patch,
  active,
}: {
  label: string;
  params: QueryParams;
  patch: Partial<Record<'audience' | 'status', string | undefined>>;
  active: boolean;
}) {
  const next = new URLSearchParams();
  const merged = { ...params, ...patch };

  for (const key of ['audience', 'status', 'q', 'sort'] as const) {
    const value = merged[key];
    if (value) next.set(key, value);
  }

  const query = next.toString();

  return (
    <Link
      href={query ? `/admin?${query}` : '/admin'}
      className={cn(
        'rounded-[var(--r-pill)] border px-3.5 py-1.5 text-[13.5px] font-semibold transition-colors',
        active
          ? 'bg-accent border-accent text-accent-contrast'
          : 'border-border bg-surface text-body hover:border-accent hover:text-accent',
      )}
    >
      {label}
    </Link>
  );
}

function Stat({ label, value, emphasis }: { label: string; value: number; emphasis?: boolean }) {
  return (
    <Card className="px-4 py-3.5">
      <p
        data-metric
        className={cn('text-[24px] font-extrabold', emphasis ? 'text-accent' : 'text-ink')}
      >
        {value}
      </p>
      <p className="text-muted text-[12.5px] font-semibold">{label}</p>
    </Card>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <Card className="px-6 py-16 text-center">
      <Inbox aria-hidden="true" className="text-muted mx-auto mb-4 size-8" />
      <p className="text-ink mb-1.5 text-[17px] font-bold">
        {hasAny ? 'Nothing matches these filters' : 'No submissions yet'}
      </p>
      <p className="mx-auto max-w-sm text-[14.5px]">
        {hasAny
          ? 'Try clearing a filter or the search above.'
          : 'Anything sent through the contact, brand or creator forms will appear here.'}
      </p>
    </Card>
  );
}
