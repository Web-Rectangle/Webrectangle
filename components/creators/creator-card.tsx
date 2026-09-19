'use client';

import { Bookmark, BookmarkCheck, MapPin, Send } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Glass } from '@/components/ui/glass';
import type { Creator } from '@/lib/schemas/creator';
import { cn } from '@/lib/utils/cn';
import { formatCount, formatHandle, formatPercent, humanise } from '@/lib/utils/format';

import { PlatformBadge } from './platform-badge';

type CreatorCardProps = {
  creator: Creator;
  /** `compact` is the hero variant; `full` adds audience detail for /discover. */
  variant?: 'compact' | 'full';
  shortlisted?: boolean;
  onShortlist?: (id: string) => void;
  onInvite?: (id: string) => void;
  onOpen?: (id: string) => void;
  className?: string;
};

/**
 * Creator summary card - the core unit of the discovery experience.
 *
 * Leads with engagement rather than follower count. That ordering is a product
 * position, not a layout accident: the thesis is relevance over reach, and
 * putting reach first would quietly undercut it.
 *
 * Renders illustrative sample profiles. Any surface using this must also show
 * a <SampleDataNotice />.
 */
export function CreatorCard({
  creator,
  variant = 'compact',
  shortlisted = false,
  onShortlist,
  onInvite,
  onOpen,
  className,
}: CreatorCardProps) {
  const interactive = Boolean(onOpen);

  return (
    <Glass
      as="article"
      className={cn(
        'flex flex-col gap-4 p-5',
        interactive && 'cursor-pointer transition-transform duration-300 hover:-translate-y-1',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={creator.displayName} seed={creator.handle} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {onOpen ? (
              <button
                type="button"
                onClick={() => onOpen(creator.id)}
                className="text-ink hover:text-accent truncate text-[15.5px] font-bold transition-colors"
              >
                {creator.displayName}
              </button>
            ) : (
              <span className="text-ink truncate text-[15.5px] font-bold">
                {creator.displayName}
              </span>
            )}
            <PlatformBadge platform={creator.platform} />
          </div>

          <p className="text-muted truncate text-[13px]">{formatHandle(creator.handle)}</p>
        </div>
      </div>

      <div>
        <p className="text-ink text-[13.5px] font-semibold">{humanise(creator.category)}</p>
        <p className="text-[13px] leading-snug">{creator.niche}</p>
        <p className="text-muted mt-1.5 flex items-center gap-1 text-[12.5px]">
          <MapPin aria-hidden="true" className="size-3" />
          {creator.city}
        </p>
      </div>

      {/* Engagement first - see the component note above. */}
      <dl className="border-border grid grid-cols-3 gap-2 border-t pt-3">
        <Metric label="Engagement" value={formatPercent(creator.engagementRate)} emphasis />
        <Metric label="Followers" value={formatCount(creator.followers)} />
        <Metric label="Avg. views" value={formatCount(creator.avgViews)} />
      </dl>

      {variant === 'full' ? (
        <p className="text-muted text-[12.5px]">
          Mostly {creator.audience.primaryAgeBand} &middot; {creator.audience.femaleShare}% women
          &middot; {creator.languages.join(', ')}
        </p>
      ) : null}

      {onShortlist || onInvite ? (
        <div className="mt-auto flex gap-2 pt-1">
          {onShortlist ? (
            <button
              type="button"
              onClick={() => onShortlist(creator.id)}
              aria-pressed={shortlisted}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-[var(--r-btn)] border px-3 py-2 text-[13px] font-semibold transition-colors',
                shortlisted
                  ? 'bg-accent-soft border-accent text-accent'
                  : 'border-border text-body hover:border-accent hover:text-accent',
              )}
            >
              {shortlisted ? (
                <BookmarkCheck aria-hidden="true" className="size-3.5" />
              ) : (
                <Bookmark aria-hidden="true" className="size-3.5" />
              )}
              {shortlisted ? 'Shortlisted' : 'Shortlist'}
            </button>
          ) : null}

          {onInvite ? (
            <button
              type="button"
              onClick={() => onInvite(creator.id)}
              className="bg-accent text-accent-contrast hover:bg-accent-hover flex flex-1 items-center justify-center gap-1.5 rounded-[var(--r-btn)] px-3 py-2 text-[13px] font-semibold transition-colors"
            >
              <Send aria-hidden="true" className="size-3.5" />
              Invite
            </button>
          ) : null}
        </div>
      ) : null}
    </Glass>
  );
}

function Metric({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <dd
        data-metric
        className={cn('text-[15px] font-extrabold', emphasis ? 'text-accent' : 'text-ink')}
      >
        {value}
      </dd>
      <dt className="text-muted text-[11px] font-medium">{label}</dt>
    </div>
  );
}
