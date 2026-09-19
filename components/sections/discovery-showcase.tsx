'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { CreatorCard } from '@/components/creators/creator-card';
import { Chip } from '@/components/ui/chip';
import { Glass } from '@/components/ui/glass';
import { SampleDataNotice } from '@/components/ui/sample-data-notice';
import { SectionHeading } from '@/components/ui/section-heading';
import { StatusBadge } from '@/components/ui/status-badge';
import { discovery } from '@/lib/content/home';
import { matchesFilters, sortCreators } from '@/lib/creators/filter';
import type { Creator, CreatorFilters, CreatorSort } from '@/lib/schemas/creator';
import { humanise } from '@/lib/utils/format';

const CATEGORY_CHIPS = ['fitness', 'food', 'technology', 'fashion', 'finance'] as const;
const SORT_OPTIONS: ReadonlyArray<{ value: CreatorSort; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'engagement-desc', label: 'Engagement' },
  { value: 'followers-desc', label: 'Followers' },
];

/**
 * Wide discovery panel on the homepage.
 *
 * A second, larger taste of the product after the hero - this time showing
 * category filtering and sorting across a six-card grid, which is closer to
 * how /discover actually feels. Still client-side over the seed set, using the
 * same pure filter module as the server.
 */
export function DiscoveryShowcase({ creators }: { creators: Creator[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<CreatorSort>('relevance');
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const reduced = useReducedMotion();

  const results = useMemo(() => {
    const filters: CreatorFilters = {
      sort,
      limit: 6,
      ...(category ? { categories: [category as Creator['category']] } : {}),
    };

    return sortCreators(
      creators.filter((c) => matchesFilters(c, filters)),
      sort,
    ).slice(0, 6);
  }, [creators, category, sort]);

  const toggleShortlist = (id: string) =>
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="section-y defer-paint">
      <div className="container-wr">
        <SectionHeading
          eyebrow={discovery.eyebrow}
          title={discovery.title}
          description={discovery.description}
        />

        {/* Natural-language search, honestly labelled as not yet available. */}
        <Glass className="glass-readable mb-6 flex flex-wrap items-center gap-4 px-5 py-4">
          <span aria-hidden="true" className="text-accent">
            <Sparkles className="size-5" />
          </span>
          <div className="min-w-[240px] flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2.5">
              <p className="text-ink text-[15px] font-bold">{discovery.naturalLanguage.title}</p>
              <StatusBadge status={discovery.naturalLanguage.status} />
            </div>
            <p className="text-[13.5px]">{discovery.naturalLanguage.body}</p>
          </div>
          <p className="text-muted border-border w-full border-t pt-3 text-[13px] italic sm:w-auto sm:border-0 sm:pt-0">
            &ldquo;{discovery.exampleQuery}&rdquo;
          </p>
        </Glass>

        <Glass className="glass-readable p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Chip selected={category === null} onToggle={() => setCategory(null)}>
                All
              </Chip>
              {CATEGORY_CHIPS.map((c) => (
                <Chip
                  key={c}
                  selected={category === c}
                  onToggle={() => setCategory(category === c ? null : c)}
                >
                  {humanise(c)}
                </Chip>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="showcase-sort" className="text-muted text-[12.5px] font-semibold">
                Sort
              </label>
              <select
                id="showcase-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as CreatorSort)}
                className="border-border bg-surface text-ink focus:border-accent cursor-pointer rounded-[var(--r-btn)] border px-3 py-1.5 text-[13px] font-semibold outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <SampleDataNotice variant="bar" className="mb-5" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((creator) => (
                <motion.div
                  key={creator.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CreatorCard
                    creator={creator}
                    variant="full"
                    shortlisted={shortlisted.has(creator.id)}
                    onShortlist={toggleShortlist}
                    onInvite={() => undefined}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/discover"
              className="text-accent inline-flex items-center gap-1.5 text-[15px] font-bold hover:underline"
            >
              Open full creator discovery
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </Glass>
      </div>
    </section>
  );
}
