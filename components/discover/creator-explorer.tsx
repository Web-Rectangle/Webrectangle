'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { CreatorCard } from '@/components/creators/creator-card';
import { Button } from '@/components/ui/button';
import { SampleDataNotice } from '@/components/ui/sample-data-notice';
import { countFacets, matchesFilters, sortCreators } from '@/lib/creators/filter';
import { searchParamsFromFilters } from '@/lib/creators/url';
import type { Creator, CreatorFilters, CreatorSort } from '@/lib/schemas/creator';
import { cn } from '@/lib/utils/cn';

import { CompareTray } from './compare-tray';
import { type FilterPatch, FilterRail } from './filter-rail';

const SORT_OPTIONS: ReadonlyArray<{ value: CreatorSort; label: string }> = [
  { value: 'relevance', label: 'Best match' },
  { value: 'engagement-desc', label: 'Highest engagement' },
  { value: 'followers-desc', label: 'Most followers' },
  { value: 'followers-asc', label: 'Fewest followers' },
];

/** Comparison is capped here; past three the columns stop being scannable. */
const MAX_COMPARE = 3;

/**
 * Full creator discovery experience.
 *
 * ARCHITECTURE: filtering runs in the browser over the complete seed set,
 * which is 24 records. At this size a network round trip per keystroke would
 * add latency for no benefit, and the same pure filter module runs on the
 * server so results are identical either way. When the real creator network
 * makes client-side filtering impractical, this component switches to calling
 * /api/creators/search - the filter shape and the URL contract do not change.
 *
 * URL STATE: every filter is mirrored into the query string with `replace`, so
 * a search is shareable and the back button steps through history rather than
 * leaving the page.
 */
export function CreatorExplorer({
  creators,
  initialFilters,
  cities,
}: {
  creators: Creator[];
  initialFilters: CreatorFilters;
  cities: readonly string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const [filters, setFilters] = useState<CreatorFilters>(initialFilters);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /** Counted over the whole dataset so option counts stay meaningful. */
  const facets = useMemo(() => countFacets(creators), [creators]);

  const results = useMemo(
    () =>
      sortCreators(
        creators.filter((c) => matchesFilters(c, filters)),
        filters.sort,
      ),
    [creators, filters],
  );

  const compared = useMemo(
    () =>
      compareIds
        .map((id) => creators.find((c) => c.id === id))
        .filter((c): c is Creator => Boolean(c)),
    [compareIds, creators],
  );

  /**
   * `replace` rather than `push`, and `scroll: false`: adjusting a filter is a
   * refinement, not a navigation. Pushing every chip toggle would make the
   * back button walk through dozens of intermediate states.
   */
  const commit = useCallback(
    (next: CreatorFilters) => {
      setFilters(next);
      const query = searchParamsFromFilters(next);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const patch = useCallback(
    (update: FilterPatch) => commit({ ...filters, ...update }),
    [commit, filters],
  );

  const reset = useCallback(
    () => commit({ sort: 'relevance', limit: filters.limit }),
    [commit, filters.limit],
  );

  const toggleCompare = useCallback((id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const rail = (
    <FilterRail
      filters={filters}
      facets={facets}
      cities={cities}
      onChange={patch}
      onReset={reset}
    />
  );

  return (
    <div className="container-wr">
      <SampleDataNotice
        variant="bar"
        label="Sample creator network"
        detail="These profiles are illustrative and were created to demonstrate the product. Our real creator network is onboarding now - join the early access list to be told when it opens."
        className="mb-6"
      />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop rail. Sticky so filters stay reachable down a long grid. */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 pb-8">
            {rail}
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="border-border bg-surface focus-within:border-accent flex min-w-[240px] flex-1 items-center gap-2.5 rounded-[var(--r-btn)] border px-3.5 transition-colors">
              <Search aria-hidden="true" className="text-muted size-4 shrink-0" />
              <input
                type="search"
                value={filters.q ?? ''}
                onChange={(e) => patch({ q: e.target.value || undefined })}
                placeholder="Search by name, niche or city"
                aria-label="Search creators"
                className="text-ink placeholder:text-muted w-full bg-transparent py-3 text-[14.5px] outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="border-border text-ink hover:border-accent flex items-center gap-2 rounded-[var(--r-btn)] border px-4 py-3 text-[14px] font-semibold transition-colors lg:hidden"
            >
              <SlidersHorizontal aria-hidden="true" className="size-4" />
              Filters
            </button>

            <label htmlFor="sort" className="sr-only">
              Sort creators
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => patch({ sort: e.target.value as CreatorSort })}
              className="border-border bg-surface text-ink focus:border-accent cursor-pointer rounded-[var(--r-btn)] border px-3.5 py-3 text-[14px] font-semibold outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <p aria-live="polite" className="text-muted mb-4 text-[13.5px] font-medium">
            {results.length === 0
              ? 'No creators match these filters.'
              : `${results.length} ${results.length === 1 ? 'creator' : 'creators'}`}
          </p>

          {results.length === 0 ? (
            <div className="border-border rounded-[var(--r-card)] border border-dashed px-6 py-16 text-center">
              <p className="text-ink mb-1.5 text-[16px] font-bold">Nothing matches yet</p>
              <p className="mx-auto mb-5 max-w-sm text-[14px]">
                Try removing a filter, or widening the follower band. The sample set is small by
                design.
              </p>
              <Button variant="outline" size="sm" onClick={reset}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((creator) => (
                  <motion.div
                    key={creator.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <CreatorCard
                      creator={creator}
                      variant="full"
                      shortlisted={compareIds.includes(creator.id)}
                      onShortlist={toggleCompare}
                      onInvite={() => undefined}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <CompareTray
            creators={compared}
            onRemove={toggleCompare}
            onClear={() => setCompareIds([])}
          />
        </div>
      </div>

      {/* Mobile filters as a bottom sheet: thumb-reachable, and it keeps the
          results visible behind it so the effect of a change is obvious. */}
      <div
        className={cn(
          'fixed inset-0 z-[70] lg:hidden',
          mobileFiltersOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileFiltersOpen}
      >
        <button
          type="button"
          tabIndex={mobileFiltersOpen ? 0 : -1}
          aria-label="Close filters"
          onClick={() => setMobileFiltersOpen(false)}
          className={cn(
            'absolute inset-0 bg-[rgb(10_15_30_/_0.45)] backdrop-blur-sm transition-opacity duration-300',
            mobileFiltersOpen ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div
          className={cn(
            'glass-md glass-readable absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto',
            'rounded-b-none p-6 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]',
            'motion-reduce:transition-none',
            mobileFiltersOpen ? 'translate-y-0' : 'translate-y-full',
          )}
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-ink text-[17px] font-bold">Filters</h2>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
              className="text-ink -mr-2 p-2"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          {rail}

          <div className="mt-7">
            <Button fullWidth onClick={() => setMobileFiltersOpen(false)}>
              Show {results.length} {results.length === 1 ? 'creator' : 'creators'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
