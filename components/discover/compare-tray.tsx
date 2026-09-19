'use client';

import { X } from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Creator } from '@/lib/schemas/creator';
import { cn } from '@/lib/utils/cn';
import { formatCount, formatHandle, formatPercent, humanise } from '@/lib/utils/format';

/** Rows in the comparison table, in the order a brand actually evaluates them. */
const ROWS: ReadonlyArray<{ label: string; get: (c: Creator) => string; emphasis?: boolean }> = [
  { label: 'Engagement', get: (c) => formatPercent(c.engagementRate), emphasis: true },
  { label: 'Followers', get: (c) => formatCount(c.followers) },
  { label: 'Avg. views', get: (c) => formatCount(c.avgViews) },
  { label: 'Platform', get: (c) => humanise(c.platform) },
  { label: 'Category', get: (c) => humanise(c.category) },
  { label: 'Niche', get: (c) => c.niche },
  { label: 'Location', get: (c) => c.city },
  { label: 'Main age band', get: (c) => c.audience.primaryAgeBand },
  { label: 'Women in audience', get: (c) => `${c.audience.femaleShare}%` },
  { label: 'Languages', get: (c) => c.languages.join(', ') },
  { label: 'Past collaborations', get: (c) => String(c.pastCollaborations) },
];

/**
 * Side-by-side creator comparison.
 *
 * Shortlisting is where a brand stops browsing and starts deciding, and that
 * decision is almost impossible to make by scrolling back and forth between
 * cards. Engagement is the first row for the same reason it leads on the card:
 * relevance over reach.
 *
 * Capped at three creators - beyond that the columns get too narrow to scan on
 * a laptop, and the comparison stops being useful.
 */
export function CompareTray({
  creators,
  onRemove,
  onClear,
}: {
  creators: Creator[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (creators.length === 0) return null;

  return (
    <section
      aria-label="Creator comparison"
      className="glass-md glass-readable sticky bottom-4 z-40 mt-8 p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-ink text-[15px] font-bold">
          Comparing {creators.length} {creators.length === 1 ? 'creator' : 'creators'}
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-muted hover:text-accent text-[13px] font-semibold transition-colors"
        >
          Clear all
        </button>
      </div>

      {creators.length === 1 ? (
        <p className="text-muted mb-4 text-[13.5px]">
          Shortlist one or two more creators to see them side by side.
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr>
              <th scope="col" className="w-36" />
              {creators.map((c) => (
                <th key={c.id} scope="col" className="pb-3 align-bottom">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.displayName} seed={c.handle} size="sm" />
                    <div className="min-w-0">
                      <p className="text-ink truncate text-[13.5px] font-bold">{c.displayName}</p>
                      <p className="text-muted truncate text-[11.5px]">{formatHandle(c.handle)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(c.id)}
                      aria-label={`Remove ${c.displayName} from comparison`}
                      className="text-muted hover:text-critical ml-auto shrink-0 transition-colors"
                    >
                      <X aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-border border-t">
                <th
                  scope="row"
                  className="text-muted py-2 pr-4 text-[12.5px] font-semibold whitespace-nowrap"
                >
                  {row.label}
                </th>
                {creators.map((c) => (
                  <td
                    key={c.id}
                    className={cn(
                      'py-2 pr-4 text-[13.5px]',
                      row.emphasis ? 'text-accent font-extrabold' : 'text-ink',
                    )}
                  >
                    {row.get(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-border mt-4 border-t pt-4">
        <Button href="/contact" size="sm" withArrow>
          Talk to us about these creators
        </Button>
      </div>
    </section>
  );
}
