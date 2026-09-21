'use client';

import { Eye, EyeOff, Pencil, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { deleteCreator, setCreatorFeatured, setCreatorHidden } from '@/lib/actions/admin';
import type { CreatorAdminRecord } from '@/lib/repositories/types';
import { cn } from '@/lib/utils/cn';
import { formatCount, formatHandle, formatPercent, humanise } from '@/lib/utils/format';

/**
 * One creator in the admin listing.
 *
 * Hide is the primary control and delete is deliberately the quietest: a
 * creator between campaigns should be hidden, not destroyed, and only one of
 * those two is reversible.
 *
 * Client component purely for the delete confirmation. The three actions are
 * still plain forms posting to Server Actions, so they work without
 * JavaScript - `onSubmit` only adds the guard when JS is available.
 */
export function CreatorRow({ creator }: { creator: CreatorAdminRecord }) {
  const isSample = creator.origin === 'seed';

  return (
    <Card as="li" className={cn('p-5 transition-opacity', creator.hidden && 'opacity-60')}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar name={creator.displayName} seed={creator.handle} size="sm" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-ink text-[15.5px] font-bold">{creator.displayName}</p>

              <span
                className={cn(
                  'rounded-[var(--r-pill)] border px-2 py-0.5 text-[10.5px] font-bold tracking-[0.06em] uppercase',
                  isSample
                    ? 'bg-warning-soft text-warning border-warning/25'
                    : 'bg-positive-soft text-positive border-positive/25',
                )}
              >
                {isSample ? 'Sample' : 'Real'}
              </span>

              {creator.featured ? (
                <span className="bg-accent-soft text-accent rounded-[var(--r-pill)] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.06em] uppercase">
                  Featured
                </span>
              ) : null}

              {creator.hidden ? (
                <span className="bg-surface-alt text-muted rounded-[var(--r-pill)] px-2 py-0.5 text-[10.5px] font-bold tracking-[0.06em] uppercase">
                  Hidden
                </span>
              ) : null}
            </div>

            <p className="text-muted mt-0.5 text-[13px]">
              {formatHandle(creator.handle)} &middot; {humanise(creator.platform)} &middot;{' '}
              {humanise(creator.category)} &middot; {creator.city}
            </p>
            <p className="text-muted text-[12px]">
              {formatPercent(creator.engagementRate)} engagement &middot;{' '}
              {formatCount(creator.followers)} followers
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <form action={setCreatorHidden}>
            <input type="hidden" name="id" value={creator.id} />
            <input type="hidden" name="hidden" value={String(!creator.hidden)} />
            <IconAction
              label={creator.hidden ? 'Show' : 'Hide'}
              icon={creator.hidden ? <Eye /> : <EyeOff />}
              tone={creator.hidden ? 'accent' : 'default'}
            />
          </form>

          <form action={setCreatorFeatured}>
            <input type="hidden" name="id" value={creator.id} />
            <input type="hidden" name="featured" value={String(!creator.featured)} />
            <IconAction
              label={creator.featured ? 'Unfeature' : 'Feature'}
              icon={<Star className={creator.featured ? 'fill-current' : undefined} />}
              tone={creator.featured ? 'accent' : 'default'}
            />
          </form>

          <Link
            href={`/admin/creators/${creator.id}/edit`}
            className="border-border text-body hover:border-accent hover:text-accent flex items-center gap-1.5 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-semibold transition-colors"
          >
            <Pencil aria-hidden="true" className="size-3.5" />
            Edit
          </Link>

          <form
            action={deleteCreator}
            onSubmit={(e) => {
              if (
                !confirm(
                  `Delete ${creator.displayName} permanently? Hiding them is reversible; this is not.`,
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={creator.id} />
            <IconAction label="Delete" icon={<Trash2 />} tone="critical" />
          </form>
        </div>
      </div>
    </Card>
  );
}

function IconAction({
  label,
  icon,
  tone = 'default',
}: {
  label: string;
  icon: React.ReactNode;
  tone?: 'default' | 'accent' | 'critical';
}) {
  return (
    <button
      type="submit"
      className={cn(
        'flex items-center gap-1.5 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-semibold transition-colors',
        '[&_svg]:size-3.5',
        tone === 'accent' && 'border-accent bg-accent-soft text-accent',
        tone === 'critical' && 'border-border text-muted hover:border-critical hover:text-critical',
        tone === 'default' && 'border-border text-body hover:border-accent hover:text-accent',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
