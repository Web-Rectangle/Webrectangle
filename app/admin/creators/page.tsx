import { Plus, Users } from 'lucide-react';
import Link from 'next/link';

import { CreatorRow } from '@/components/admin/creator-row';
import { Card } from '@/components/ui/card';
import { getRepositories } from '@/lib/repositories';
import { cn } from '@/lib/utils/cn';

type Filters = { origin?: string; visibility?: string };

/**
 * Creator listing control.
 *
 * This is the page that decides what appears on /discover. It shows hidden
 * profiles too - an admin needs to see a hidden creator in order to unhide
 * them, which is exactly why `listAll` exists separately from `search`.
 *
 * Sample and real profiles are managed identically. The only difference is
 * that deleting a sample records a tombstone rather than removing a row,
 * because the seed set is a read-only JSON file.
 */
export default async function AdminCreatorsPage({
  searchParams,
}: {
  searchParams: Promise<Filters & { saved?: string }>;
}) {
  const params = await searchParams;
  const repos = await getRepositories();
  const all = await repos.creators.listAll({ includeHidden: true });

  const filtered = all.filter((c) => {
    if (params.origin === 'sample' && c.origin !== 'seed') return false;
    if (params.origin === 'real' && c.origin !== 'admin') return false;
    if (params.visibility === 'visible' && c.hidden) return false;
    if (params.visibility === 'hidden' && !c.hidden) return false;
    return true;
  });

  const counts = {
    total: all.length,
    visible: all.filter((c) => !c.hidden).length,
    hidden: all.filter((c) => c.hidden).length,
    real: all.filter((c) => c.origin === 'admin').length,
    featured: all.filter((c) => c.featured).length,
  };

  return (
    <main className="container-wr py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="mb-1.5 text-[clamp(26px,3vw,34px)]">Creators</h1>
          <p className="text-[15px]">
            Everything on the public Discover page, plus anything hidden. Changes here take effect
            immediately.
          </p>
        </div>

        <Link
          href="/admin/creators/new"
          className="bg-accent text-accent-contrast hover:bg-accent-hover flex items-center gap-1.5 rounded-[var(--r-btn)] px-4 py-2.5 text-[14px] font-semibold transition-colors"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add creator
        </Link>
      </div>

      {params.saved ? (
        <p
          role="status"
          className="bg-positive-soft text-positive mb-6 rounded-[var(--r-card)] px-4 py-3 text-[14.5px] font-semibold"
        >
          Creator saved.
        </p>
      ) : null}

      {/* Same caveat as the submissions queue: curation is configuration, and
          with the in-memory adapter it resets on restart. */}
      {repos.adapter === 'memory' ? (
        <p className="bg-warning-soft text-warning mb-6 rounded-[var(--r-card)] px-4 py-3 text-[13.5px]">
          <strong className="font-bold">Listing changes are stored in memory.</strong> Hiding,
          featuring and deletions reset whenever the server restarts. Set{' '}
          <code className="font-mono">DATABASE_URL</code> to make them permanent.
        </p>
      ) : null}

      <div className="mb-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Total" value={counts.total} />
        <Stat label="On Discover" value={counts.visible} emphasis />
        <Stat label="Hidden" value={counts.hidden} />
        <Stat label="Real creators" value={counts.real} />
        <Stat label="Featured" value={counts.featured} />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Filter label="All" href="/admin/creators" active={!params.origin && !params.visibility} />
        <Filter
          label="On Discover"
          href="/admin/creators?visibility=visible"
          active={params.visibility === 'visible'}
        />
        <Filter
          label="Hidden"
          href="/admin/creators?visibility=hidden"
          active={params.visibility === 'hidden'}
        />
        <Filter label="Real" href="/admin/creators?origin=real" active={params.origin === 'real'} />
        <Filter
          label="Samples"
          href="/admin/creators?origin=sample"
          active={params.origin === 'sample'}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="px-6 py-16 text-center">
          <Users aria-hidden="true" className="text-muted mx-auto mb-4 size-8" />
          <p className="text-ink mb-1.5 text-[17px] font-bold">No creators match this filter</p>
          <p className="mx-auto max-w-sm text-[14.5px]">Try a different filter above.</p>
        </Card>
      ) : (
        <ul className="grid gap-4">
          {filtered.map((creator) => (
            <CreatorRow key={creator.id} creator={creator} />
          ))}
        </ul>
      )}
    </main>
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

function Filter({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <a
      href={href}
      className={cn(
        'rounded-[var(--r-pill)] border px-3.5 py-2 text-[13.5px] font-semibold transition-colors',
        active
          ? 'bg-accent border-accent text-accent-contrast'
          : 'border-border bg-surface text-body hover:border-accent hover:text-accent',
      )}
    >
      {label}
    </a>
  );
}
