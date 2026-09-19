'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CreatorCard } from '@/components/creators/creator-card';
import { Chip } from '@/components/ui/chip';
import { Glass } from '@/components/ui/glass';
import { SampleDataNotice } from '@/components/ui/sample-data-notice';
import { matchesFilters, sortCreators } from '@/lib/creators/filter';
import type { Creator, CreatorFilters } from '@/lib/schemas/creator';

/**
 * Preset filters offered as one-tap chips.
 *
 * These mirror the worked example from the brand brief ("Find 20 Instagram
 * fitness creators in Delhi NCR with 20K-100K followers"), so the demo
 * demonstrates a real query a brand would actually run rather than an abstract
 * one.
 */
const PRESETS = [
  { id: 'fitness', label: 'Fitness', patch: { categories: ['fitness'] } },
  { id: 'delhi', label: 'Delhi NCR', patch: { cities: ['Delhi NCR'] } },
  { id: 'instagram', label: 'Instagram', patch: { platforms: ['instagram'] } },
  { id: 'band', label: '20K-100K', patch: { minFollowers: 20_000, maxFollowers: 100_000 } },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  patch: Partial<CreatorFilters>;
}>;

const RESULT_LIMIT = 3;

/**
 * Interactive product demonstration in the hero.
 *
 * WHY THIS IS HERE: the single most important job of the homepage is to make a
 * visitor understand within about five seconds that WebRectangle is a product,
 * not an agency. A screenshot cannot do that; a search box that genuinely
 * responds can. Every chip really refilters the seed set through the same pure
 * module the server uses, so what a visitor sees here is what the product does.
 *
 * Runs entirely in the browser against data passed down from the server - no
 * fetch, no latency, no loading state to design around.
 */
export function HeroDemo({ creators }: { creators: Creator[] }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Set<string>>(new Set(['fitness', 'delhi']));
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const reduced = useReducedMotion();

  const filters = useMemo<CreatorFilters>(() => {
    const merged: CreatorFilters = { sort: 'relevance', limit: RESULT_LIMIT };

    for (const preset of PRESETS) {
      if (active.has(preset.id)) Object.assign(merged, preset.patch);
    }

    if (query.trim()) merged.q = query.trim();
    return merged;
  }, [active, query]);

  const matches = useMemo(
    () =>
      sortCreators(
        creators.filter((c) => matchesFilters(c, filters)),
        'relevance',
      ),
    [creators, filters],
  );

  const visible = matches.slice(0, RESULT_LIMIT);

  const toggle = (id: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleShortlist = (id: string) =>
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <Glass className="glass-readable relative p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-ink text-[14px] font-bold">Find creators for your campaign</p>
        <SampleDataNotice label="Product preview" />
      </div>

      {/* Search. A real input, not a decorative mock. */}
      <div className="border-border bg-surface focus-within:border-accent mb-3 flex items-center gap-2.5 rounded-[var(--r-btn)] border px-3.5 transition-colors">
        <Search aria-hidden="true" className="text-muted size-4 shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'strength training' or 'Mumbai'"
          aria-label="Search sample creators by name, niche or city"
          className="text-ink placeholder:text-muted w-full bg-transparent py-3 text-[14.5px] outline-none"
        />
        <SlidersHorizontal aria-hidden="true" className="text-muted size-4 shrink-0" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Chip
            key={preset.id}
            selected={active.has(preset.id)}
            onToggle={() => toggle(preset.id)}
            className="text-[12.5px]"
          >
            {preset.label}
          </Chip>
        ))}
      </div>

      <p aria-live="polite" className="text-muted mb-3 text-[12.5px] font-medium">
        {matches.length === 0
          ? 'No sample creators match those filters.'
          : `Showing ${visible.length} of ${matches.length} matching creators`}
      </p>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((creator) => (
            <motion.div
              key={creator.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <CreatorCard
                creator={creator}
                shortlisted={shortlisted.has(creator.id)}
                onShortlist={toggleShortlist}
                onInvite={() => undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {matches.length === 0 ? (
          <div className="border-border text-muted rounded-[var(--r-card)] border border-dashed px-4 py-8 text-center text-[13.5px]">
            Clear a filter to see more of the sample set.
          </div>
        ) : null}
      </div>
    </Glass>
  );
}
